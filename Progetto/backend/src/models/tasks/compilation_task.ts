import { v4 as uuidv4 } from 'uuid';

export class CompilationTask {
    private id: String; // task ID
    private socketID: String; // socket.io id of the user who requested the task
    private code: String; // source code base64 encoded
    private flags: Array<String>; // compilation flag
    private input: String; // binary input
    private execute: boolean; // if code should be executed on succesful compilation

    constructor(
        socketID: String,
        code: String,
        flags: Array<String> = [],
        input: String = '',
        execute: boolean = false
    ) {
        this.id = uuidv4();
        this.socketID = socketID;
        this.code = code;
        this.flags = flags;
        this.input = input;
        this.execute = execute;
    }

    public toJSON() : Object {
        return {
            "id": this.id,
            "sourceCode": this.code,
            "input": this.input,
            "flags": this.flags,
            "executeProgram": this.execute,
        }
    }

    public getID(): String {
        return this.id;
    }

    public getSocketID() : String {
        return this.socketID;
    }

    public getCode() : String {
        return this.code;
    }

    public getFlags() : Array<String> {
        return this.flags;
    }

    public getInput() : String {
        return this.input;
    }

    public getExecute() : boolean {
        return this.execute;
    }
    
}