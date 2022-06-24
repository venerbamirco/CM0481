import { TaskStatus } from "./task_status";
import { ProcessResult } from "./../processes/process_result"

export class TaskStats {
    id: string;
    status: TaskStatus;

    startTimestamp: number;
    endTimestamp?: number;

    compileStartTimestamp?: number;
    compileEndTimestamp?: number;

    executeStartTimestamp?: number;
    executeEndTimestamp?: number;

    constructor(_id: string, _status: TaskStatus) {
        this.id = _id;
        this.status = _status;
        this.startTimestamp = (+ new Date());
    }

    get compileTime(){
        return ((this.compileEndTimestamp || 0) - (this.compileStartTimestamp || 0));
    }

    get executeTime(){
        return ((this.executeEndTimestamp || 0) - (this.executeStartTimestamp || 0));
    }

    get totalTime(){
        return ((this.endTimestamp || 0) - this.startTimestamp);
    }

    change(newTaskStatus: TaskStatus){
        this.status = newTaskStatus;
    }

    end(endTaskStatus: TaskStatus){
        this.status = endTaskStatus;
        this.endTimestamp = (+ new Date());
    }

    updateCompileTime(compileResult: ProcessResult) {
        this.compileStartTimestamp = compileResult.startTimestamp;
        this.compileEndTimestamp = compileResult.endTimestamp;
    }

    updateExecuteTime(executeResult: ProcessResult) {
        this.executeStartTimestamp = executeResult.startTimestamp;
        this.executeEndTimestamp = executeResult.endTimestamp;
    }

}