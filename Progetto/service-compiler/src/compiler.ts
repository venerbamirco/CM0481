import { ProcessResult } from './models/processes/process_result';
import { TaskRequest } from './models/tasks/task_request';
import { TaskStatus } from './models/tasks/task_status';
import { ResultNotifier } from './utils/notification';
import { Environment } from './environment';
import { log } from './utils/logging';

const fs = require('fs');
const path = require('path');
const { spawn } = require("child_process");

let notifier = new ResultNotifier();

export class Compiler {
    
    processTaskRequest(taskRequest: TaskRequest) {
        // Start compile
        log.info(`Starting compile request ${taskRequest.id}`);
        taskRequest.changeStatus(TaskStatus.COMPILING);

        this.compileTaskRequest(taskRequest).then((compileResult) => {
            log.info(`Completed compile request ${taskRequest.id}`)
            log.debug(compileResult);

            // update compile statistics
            taskRequest.taskStats.updateCompileTime(compileResult);

            // send back the compile result/response
            notifier.sendCompileResult(taskRequest, compileResult); // (not interested in the result)

            if (compileResult.result){
                if (taskRequest.executeProgram){
                    // start execute
                    log.info(`Starting execute request ${taskRequest.id}`);
                    taskRequest.changeStatus(TaskStatus.RUNNING);

                    this.executeTaskRequest(taskRequest).then((executeResult) => {
                        log.info(`Completed execute request ${taskRequest.id}`)
                        log.debug(executeResult);

                        // update execute statistics
                        taskRequest.taskStats.updateExecuteTime(executeResult);

                        // send back the compile result/response
                        notifier.sendExecuteResult(taskRequest, executeResult).then((result) => {
                            // task completed (this will trigger also resources clean up)
                            taskRequest.endStatus(TaskStatus.COMPLETED);
                        });
                    });
                } else {
                    // task completed
                    taskRequest.endStatus(TaskStatus.COMPLETED);
                }
            } else {
                // somethings went wrong during build
                taskRequest.endStatus(TaskStatus.FAILED);
            }
        });
    }

    private async compileTaskRequest(taskRequest: TaskRequest) : Promise<ProcessResult> {
        const cmd = Environment.buildCommand;
        
        const sourceFullPath = taskRequest.fullSourcePath();
        const programFullPath = taskRequest.fullProgramPath();

        const params = ["-o", programFullPath, sourceFullPath].concat(taskRequest.flags);

        return new Promise<ProcessResult> ((resolve) => {
            this.runProcess(taskRequest.id, taskRequest.buildPath, cmd, params).then((processResult) => {
                // if the output file does not exist it means that the compilation has failed
                processResult.result = fs.existsSync(programFullPath);
                // and then resolve the promise with the modified result
                resolve(processResult);
            })
        });
    }
    
    private executeTaskRequest(taskRequest: TaskRequest) : Promise<ProcessResult> {
        const cmd = Environment.sandboxCommand;
        const params = [
            "-i", taskRequest.id,
            "-p", taskRequest.buildPath,
            "-b", Environment.programFileName,
            "-m", taskRequest.memoryLimit.toString(),
            "-t", (taskRequest.timeLimit + "s"),
            "-l", Environment.maxOutput.toString(),
            "-a", taskRequest.input
        ];
    
        return this.runProcess(taskRequest.id, taskRequest.buildPath, cmd, params);
    }
    
    private runProcess(id: string, buildPath: string, cmd: string, params: string[]) : Promise<ProcessResult> {
        return new Promise<ProcessResult> ((resolve) => {
            var command: string = (cmd + " " + params.join(" "));
            var startTimestamp = (+ new Date());
    
            var outputStream = fs.createWriteStream(
                path.join(buildPath, `output.${+new Date()}.log`), 
                {flags: 'a'}
            );

            function newProcessResult(result: boolean, logPath?: string, errorMessage?: string) {
                return new ProcessResult(id, result, command, startTimestamp, (+ new Date()), logPath, errorMessage);
            }

            try {
                const process = spawn(cmd, params);
    
                log.info(`${id} spawning command: ${command}`)
        
                process.stdout.pipe(outputStream);
                process.stderr.pipe(outputStream);
            
                process.on("close", (code: number) => {
                    // close the stream
                    outputStream.close();
                    // prepare and return the process result
                    resolve(newProcessResult(true, outputStream.path));
                });
            } catch (err: any) {
                log.error(err);
                resolve(newProcessResult(false, undefined, err.toString));
            }
        });
    }

}