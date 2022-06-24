import { CompilationTask } from "../tasks/compilation_task";
import { Queue } from "./queue";

export abstract class FCFS_Queue extends Queue {
    private head: number;
    private tail: number;

    constructor() {
        super();
        this.head = 0;
        this.tail = 0;
    }

    enqueue(task: CompilationTask): boolean {
        this.tasks[this.tail] = task;
        this.tail++;
        return true;
    }

    dequeue(): CompilationTask | null {
        if (this.tasks.length == 0)
            return null;
        const task = this.tasks[this.head];
        delete this.tasks[this.head];
        this.head++;
        return task ?? null;
    }

    getLength(): number {
        return this.head - this.tail;
    }
}
