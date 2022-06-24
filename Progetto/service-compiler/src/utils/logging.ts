export var log4js = require('log4js');

log4js.configure({
    appenders: { 
        stdout: { type: "stdout" },
        file: { type: "file", filename: "application.log" } 
    },
    categories: { 
        "default": { appenders: ["stdout"], level: "debug" },
        "service-compiler": { appenders: ["stdout", "file"], level: "debug" }
    }
});

export var log = log4js.getLogger("service-compiler");