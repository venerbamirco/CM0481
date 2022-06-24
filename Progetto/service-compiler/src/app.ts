import { TaskRequestValidator  } from './validators/task_request_validator';
import { TaskRequest } from './models/tasks/task_request';
import { TaskStatus } from './models/tasks/task_status';
import { TaskStats } from './models/tasks/task_stats';
import { saveSourceCode } from './utils/filesystem';
import { log4js, log } from './utils/logging'
import { Environment } from './environment';

import express = require('express')
import { RequestValidator } from './validators/request_validator';
import { Compiler } from './compiler';

const { validationResult } = require('express-validator');
const bodyParser = require('body-parser');
const cors = require('cors');

// ===

let app = express();
app.use(cors());
app.use(bodyParser.json({ limit: Environment.payloadLimit }));
app.use(log4js.connectLogger(log, {level: log4js.levels.DEBUG}));

let validator : RequestValidator = new TaskRequestValidator();

let compiler = new Compiler();

let taskStatistics : TaskStats[] = []

// === STATUS

let startTime : number = (+ new Date());

app.get('/status', function(request: express.Request, response: express.Response){
    response.status(200).json({
        "status": "RUNNING",
        "startTime": startTime
    })
});

// === STATISTICS

app.get('/statistics', function(request: express.Request, response: express.Response){
    let stats = new Map<string, number>()

    for (const value in Object.keys(TaskStatus)) {
        if (typeof TaskStatus[value] !== "string") {
            continue;
        }
    
        stats.set(TaskStatus[value], 0);
    }

    taskStatistics.forEach(taskStats => {
        let status = TaskStatus[taskStats.status];
        stats.set(status, (stats.get(status) || 0) + 1);
    });

    response.json(Object.fromEntries(stats));
});

// === COMPILE

app.post('/compile', validator.validateAndSanitize(), function(request: express.Request, response: express.Response){
    const errors = validationResult(request);

    // statistics for tracking 
    var taskStats = new TaskStats(request.body.id || ("id-" + Math.random().toString(16)), TaskStatus.PENDING);
    
    // add for tracking
    taskStatistics.push(taskStats);

    if (!errors.isEmpty()) {
        taskStats.end(TaskStatus.DISCARDED);
        return response.status(400).json(errors.array());
    }

    try {
        // convert the body and create a reference with the stats class
        var taskRequest = TaskRequest.fromJSON(taskStats, request);
        // save the sourceCode to file
        taskRequest.buildPath = saveSourceCode(taskRequest.id, request.body.sourceCode);

        // continue with the build/execution after the response end
        response.on('finish', () => compiler.processTaskRequest(taskRequest));

        return response.status(200).json({
            "id": taskRequest.id,
            "success": true
        })
    } catch (err) {
        log.error(err);
        taskStats.end(TaskStatus.FAILED);

        return response.status(500).json([{
            "error": ((err instanceof Error) ? err.message : 'Internal server error')
        }]);
    }
});

// ===

app.listen(Environment.httpPort, () => {
    log.info(`App listening at http://localhost:${Environment.httpPort}`);
});
