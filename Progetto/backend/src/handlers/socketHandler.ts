import { io } from "../app";
import { correctBase64 } from "../auxilliary/checkers";
import { notifyClient } from "../auxilliary/notifier";
import { lb } from "../balancer";
import { CompilationTask } from "../models/tasks/compilation_task";

module.exports = function () {
    // new client connected
    io.on("connection", (socket: any) => {
        console.log(`New socket client connected with ID ${socket.id}`.green);
        
        socket.on("compilationRequest", function (sourceCodeb64 : String, input: String, flags : Array<String>, execute : boolean) {
            let socketID = socket.id;
            if (!correctBase64(sourceCodeb64)){
                notifyClient(socketID, { "status": "error", "code": 107 }, "received");
            }else{
                notifyClient(socketID, { "status": "info", "code": 108 }, "received");
                let task = new CompilationTask(socketID, sourceCodeb64, flags, input, execute);
                lb.handleTaskRequest(task); // send task to the load balancer. it's his duty to communicate via socket to client what's happening
            } 
        });
    });

    io.on("disconnect", (socket: any) => {
        console.log(`Socket.io client with ID ${socket.id} disconnected`.blue);
        // TODO remove task from queue (if still there)
    });
}