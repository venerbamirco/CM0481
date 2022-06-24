export class ProcessResult {
    id: string;
    result: boolean;
    command: string;
    outputFile?: string;
    errorMessage?: string;
    startTimestamp: number;
    endTimestamp: number;

    constructor(_id: string, _result: boolean, _command: string, _startTimestamp: number, _endTimestamp: number,  _outputFile?: string, _errorMessage?: string){
        this.id = _id;
        this.result = _result;
        this.command = _command;
        this.outputFile = _outputFile;
        this.errorMessage = _errorMessage;
        this.startTimestamp = _startTimestamp;
        this.endTimestamp = _endTimestamp;
    }
}