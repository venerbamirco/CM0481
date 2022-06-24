import { CompilationTask } from "../tasks/compilation_task";

export abstract class Queue {
    protected tasks: Array<CompilationTask>;

    constructor() {
        this.tasks = [];
    }

    abstract enqueue(task: CompilationTask) : boolean;
    abstract dequeue() : CompilationTask | null;
    abstract getLength() : number;
    abstract isFull() : boolean;
}