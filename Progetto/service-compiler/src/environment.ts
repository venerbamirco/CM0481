export class Environment {
    
    // ---
    
    public static get httpPort() : number {
        return parseInt(process.env.HTTP_PORT || '3000');
    }

    public static get payloadLimit() : string {
        return process.env.PAYLOAD_LIMIT || '2mb';
    }

    // ---

    public static get completedEndpoint(): string {
        return (process.env.COMPLETED_ENDPOINT || 'http://localhost:5000/completedCompilation')
    }

    // --

    public static get buildPath(): string {
        return (process.env.BUILD_PATH || '');
    }

    public static get buildCommand(): string {
        return (process.env.BUILD_COMMAND || 'g++');
    }

    public static get sandboxCommand(): string {
        return (process.env.SANDBOX_COMMAND || 'bwrap');
    }

    public static get sourceFileName(): string {
        return (process.env.SOURCE_FILE_NAME || 'main.cpp');
    }

    public static get programFileName(): string {
        return (process.env.PROGRAM_FILE_NAME || 'main');
    }

    // ---

    public static get defaultTimeout() : number {
        return parseInt(process.env.DEFAULT_TIMEOUT || '10');
    }

    public static get maxTimeout() : number {
        return parseInt(process.env.MAX_TIMEOUT || '30');
    }

    // ---

    public static get defaultMemory() : number {
        return parseInt(process.env.DEFAULT_MEMORY || '100000');
    }

    public static get maxMemory() : number {
        return parseInt(process.env.MAX_MEMORY || '250000');
    }

    // ---

    public static get maxOutput() : number {
        return parseInt(process.env.MAX_OUTPUT || '1048576');
    }

    // ---

    public static get sizeId() : number {
        return parseInt(process.env.SIZE_ID || '36');
    }

    public static get maxFlags() : number {
        return parseInt(process.env.MAX_FLAGS || '10');
    }

    public static get maxInput() : number {
        return parseInt(process.env.MAX_INPUT || '1024');
    }

    public static get maxSourceCode() : number {
        return parseInt(process.env.MAX_SOURCE_CODE || '1048576');
    }

}