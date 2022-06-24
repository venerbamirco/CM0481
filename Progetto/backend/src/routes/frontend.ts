import express from "express";
import path from 'path';

module.exports = function (app: express.Application) {
    app.get('/', (req: express.Request, res: express.Response) => {
        res.sendFile(path.join(__dirname+'../../../../frontend/index.html'));
    });
}