import { FCFS_Queue } from "./fcfs_queue";

export class INF_FCFS_Queue extends FCFS_Queue {

    constructor() {
        super();
    }

    isFull(): boolean {
        return false;
    }

}