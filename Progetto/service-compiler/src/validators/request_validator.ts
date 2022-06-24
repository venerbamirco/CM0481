const { checkSchema } = require('express-validator');

export abstract class RequestValidator {

    protected abstract getRequestSchema() : any;

    validateAndSanitize(){
        var _schema = this.getRequestSchema();
        return checkSchema(_schema);
    }

}