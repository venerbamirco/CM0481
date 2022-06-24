import express from "express";
import { LoadBalancer } from "../models/load-balancer";
import { ContainerData } from "../models/servers/containerData";
import { CompletedCompilationTask } from "../models/tasks/completed_compilation_task";

module.exports = function (app: express.Application, lb: LoadBalancer) {
    app.post('/completedCompilation', (req, res) => {
       

        let completed_task = new CompletedCompilationTask(
            req.body.id,
            lb.socketIDFromtaskID(req.body.id) || '',
            req.body.action,
            req.body.nextAction,
            req.body.status,
            req.body.output,
            req.body.actionTime,
            req.body.totalTime,
        );

         //console.log(completed_task.toJSON());
         // TODO get host and port from request
    
        let fromInstance = new ContainerData('localhost', 3000);
        console.log(fromInstance.toURL());
    
        lb.handleCompletedTask(fromInstance, completed_task);
    });
}