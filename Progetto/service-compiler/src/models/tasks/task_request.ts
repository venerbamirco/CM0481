import { TaskStats } from "./task_stats";
import { TaskStatus } from "./task_status";
import { Environment } from '../../environment';
import { cleanData } from "../../utils/filesystem";

import express = require('express')

const path = require('path');

export class TaskRequest {
    id: string;
    input: string;
    flags: string[];
    buildPath: string = '';
    timeLimit: number;
    memoryLimit: number;
    executeProgram: boolean;

    taskStats: TaskStats;

    constructor(_id: string, _input: string, _flags: string[], _timeLimit: number, _memoryLimit: number, _executeProgram: boolean, _taskStats: TaskStats) {
        this.id = _id;
        this.input = _input;
        this.flags = _flags;
        this.timeLimit = _timeLimit;
        this.memoryLimit = _memoryLimit;
        this.executeProgram = _executeProgram;

        this.taskStats = _taskStats;
    }

    static fromJSON(taskStats: TaskStats, request: express.Request) : TaskRequest {
        return new TaskRequest(
            request.body.id,
            request.body.input,
            request.body.flags,
            request.body.timeLimit,
            request.body.memoryLimit,
            request.body.executeProgram,
            taskStats
        );
    }

    changeStatus(taskStatus: TaskStatus) {
        this.taskStats.change(taskStatus);
    }

    endStatus(taskStatus: TaskStatus){
        cleanData(this.buildPath);
        this.taskStats.end(taskStatus);
    }

    fullSourcePath() : string {
        return path.join(this.buildPath, Environment.sourceFileName);
    }

    fullProgramPath() : string {
        return path.join(this.buildPath, Environment.programFileName);
    }

}