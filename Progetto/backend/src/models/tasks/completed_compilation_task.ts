
export class CompletedCompilationTask {
    private id: String;
    private socketID: String;
    private action: String;
    private nextAction: String;
    private status: boolean;
    private output: String;
    private actionTime: number;
    private totalTime: number;
    
    constructor(
        id: String,
        socketID: String,
        action: String,
        nextAction: String,
        status: boolean,
        output: String,
        actionTime: number,
        totalTime: number,
    ) {
        this.id = id;
        this.socketID = socketID;
        this.action = action;
        this.nextAction = nextAction;
        this.status = status;
        this.output = output;
        this.actionTime = actionTime;
        this.totalTime = totalTime;
    }

    public toJSON(): Object {
        return {
            "id": this.id,
            "action": this.action,
            "nextAction": this.nextAction,
            "status": this.status,
            "output": this.output,
            "actionTime": this.actionTime,
            "totalTime": this.totalTime,
        }
    }
    
    public getID(): String {
        return this.id;
    }

    public getNextAction(): String {
        return this.nextAction;
    }

    public getSocketID(): String {
        return this.socketID;
    }
    
}
