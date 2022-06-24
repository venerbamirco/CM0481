import { CompilationTask } from "../tasks/compilation_task";
import { FCFS_Queue } from "./fcfs_queue";

export class N_FCFS_Queue extends FCFS_Queue {
    private MAX_SIZE: number;

    constructor(MAX_SIZE: number) {
        super();
        this.MAX_SIZE = MAX_SIZE;
    }

    enqueue (task: CompilationTask) : boolean {
        return (this.tasks.length > this.MAX_SIZE) ? false : super.enqueue(task);
    }

    isFull() : boolean {
        return this.getLength() == this.MAX_SIZE;
    }
}