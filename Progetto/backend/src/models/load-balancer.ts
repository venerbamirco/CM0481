import { CompilationTask } from "./tasks/compilation_task";
import { CompletedCompilationTask } from "./tasks/completed_compilation_task";
import { Queue } from "./queues/queue";
import { assert } from "console";
import fetch from 'node-fetch';
import HashMap from "hashmap";
import { notifyClient } from "../auxilliary/notifier";
import { Server } from "./servers/server";
import { ContainerData } from "./servers/containerData";
import { ContainerInstance } from "./servers/containerInstance";
import { MAX_TASKS_PER_CONTAINER } from "../auxilliary/config";


export class LoadBalancer {
    private servers: Array<Server>;
    private queue: Queue;
    private taskID_socketID: HashMap<String, String>; // the socket ID from the corresponding task ID

    constructor(servers: Array<Server>, queue: Queue) {
        this.servers = servers;
        this.queue = queue;
        this.taskID_socketID = new HashMap<String, String>();
    }

    async handleTaskRequest(task: CompilationTask){
        // find an available container
        let server = this.findAvailableContainer();
        if (server == null) {
            // check queue length
            if (this.queue.isFull()) {
                notifyClient(task.getSocketID(), { "status": "error", "code": 100 }, "queued");
                return;
            }
            let result = this.sendTaskToQueue(task); // enqueue task
            if (result) {
                notifyClient(task.getSocketID(), { "status": "info", "code": 101, "message": this.queue.getLength() },"queued");
                return;
            }
            else {
                notifyClient(task.getSocketID(), { "status": "error", "code": 102 }, "queued");
                return;
            }
        }


        // send task to the first available server
        await this.sendTaskToServer(task, server);
    }

    handleCompletedTask(fromInstance: ContainerData, completedTask: CompletedCompilationTask) {
        //If I've completed all actions associated to the task then I can remove it
        if(completedTask.getNextAction() == '')
            this.taskID_socketID.delete(completedTask.getID()); 
        // send the result to user
        notifyClient(completedTask.getSocketID(), { "status": "success", "code": 103, "message": completedTask },"finished");
        // get a task from queue and send it to the server who just completed a task
        let task = this.queue.dequeue();
        if (task) this.sendTaskToServer(task, fromInstance);
    }

    socketIDFromtaskID(taskID: String) : String | undefined{
        //console.log(this.taskID_socketID);
        //console.log(this.taskID_socketID.get(taskID));
        return this.taskID_socketID.get(taskID);
    }

    private async sendTaskToServer(task: CompilationTask, containerInstance: ContainerData) {

        this.taskID_socketID.set(task.getID(), task.getSocketID());
        
        const response = await fetch(<any>containerInstance.toURL() + '/compile' , {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task.toJSON()),
        });
        const status = response.status;
        const body : any = await response.json();
        
        if (status == 200) {
            notifyClient(task.getSocketID(), { "status": "success", "code" : 104,  "message": task.getID(), },"handled");
            return;
        }
        else if (status == 400) {
            notifyClient(task.getSocketID(), { "status": "error", "code" : 105, "message": body.msg, },"handled");
            return;
        }
        else {
            notifyClient(task.getSocketID(), { "status": "error", "code" : 106, }, "handled");
            return;
        }
    }

    private sendTaskToQueue(task: CompilationTask) : boolean {
        return this.queue.enqueue(task);
    }

    private findAvailableContainer() : ContainerInstance | null {
        assert(this.servers.length > 0, "No servers available");
        assert(this.servers[0].getInstances().length > 0, "No containers available");

        for(let i=0; i<this.servers.length; i++) {
            let server = this.servers[i];
            let instances = server.getInstances();
            for (let j=0; j<instances.length; j++) {
                let instance = instances[j];
                if (instance.getLoad() < MAX_TASKS_PER_CONTAINER) {
                    return instance;
                }
            }
        }

        return null; // no available containers
    }

}