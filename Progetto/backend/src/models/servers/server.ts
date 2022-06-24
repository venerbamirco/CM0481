import { ContainerInstance } from "./containerInstance";

export class Server {
    private host: string;
    private instances: Array<ContainerInstance>;

    // constructor(host: string) {
    //     this.host = host;
    //     this.instances = []];
    // }

    constructor(host: string, instances: Array<ContainerInstance> = []) {
        this.host = host;
        this.instances = instances;
    }

    public allocateInstance(port: number) : boolean {
        let pingStatus = true; // TODO - ping service at given port
        if (pingStatus) {
            this.instances.push(new ContainerInstance(this.host, port));
            return true;
        }
        return false;
    }

    public getInstances(): Array<ContainerInstance>  {
        return this.instances;
    }
}