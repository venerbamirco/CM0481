import { ProcessResult } from '../models/processes/process_result';
import { TaskRequest } from '../models/tasks/task_request';
import { AxiosResponse } from 'axios';
import { Environment } from '../environment';
import { promises as fs } from "fs";
import { log } from './logging'

const path = require('path');
const axios = require('axios');

export class ResultNotifier {

    async sendCompileResult(taskRequest: TaskRequest, processResult: ProcessResult) : Promise<boolean> {
        var nextAction = '';

        if (taskRequest.executeProgram && processResult.result) {
            nextAction = 'EXECUTE';
        }

        return this.sendProcessResult(taskRequest, processResult, 'COMPILE', nextAction, taskRequest.taskStats.compileTime);
    }
    
    async sendExecuteResult(taskRequest: TaskRequest, processResult: ProcessResult) : Promise<boolean> {
        return this.sendProcessResult(taskRequest, processResult, 'EXECUTE', '', taskRequest.taskStats.executeTime);
    }

    private async sendProcessResult(taskRequest: TaskRequest, processResult: ProcessResult, action: string, nextAction: string, actionTime: number) {
        var output: string = "";

        // output from file
        if (processResult.outputFile) {
            output = await fs.readFile(processResult.outputFile, 'utf-8');
        }

        // only in case of failed execution check if is present an error message log
        if (!processResult.result && processResult.errorMessage){
            output = processResult.errorMessage;
        }

        // hide the real compilatiom path for security reasons
        output = output.replace(taskRequest.fullSourcePath(), Environment.sourceFileName);
        output = output.replace(taskRequest.fullProgramPath(), Environment.programFileName);

        var body = {
            'id': taskRequest.id,
            'action': action,
            'nextAction': nextAction,
            'status': processResult.result,
            'output': output,
            'actionTime': actionTime,
            'totalTime': processResult.endTimestamp - taskRequest.taskStats.startTimestamp
        }

        log.debug(body);
    
        return new Promise<boolean> ((resolve) => {
            axios.post(Environment.completedEndpoint, body).then((response: AxiosResponse) => {
                resolve(response.status == 200);
            })
            .catch((error: string) => {
                log.error(error);
                resolve(false);
            })
        });
    }
}
