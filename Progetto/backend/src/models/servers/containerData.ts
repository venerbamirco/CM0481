export class ContainerData {
    private host: String;
    private port: number;

    constructor(host: String, port: number) {
        this.host = host;
        this.port = port;
    }

    public toURL() : String {
        return 'http://' + this.host + ":" + this.port;
    }
}