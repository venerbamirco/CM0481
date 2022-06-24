import { ContainerData } from "./containerData";

export class ContainerInstance extends ContainerData {
    private load: number;

    constructor(host: String, port: number) {
        super(host, port);
        this.load = 0;
    }

    public getLoad(): number {
        return this.load;
    }

}