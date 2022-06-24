import { N_FCFS_Queue } from "./models/queues/n_fcfs_queue";
import { LoadBalancer } from "./models/load-balancer";
import { Server } from "./models/servers/server";


/* Servers & Instances CONFIG */
const servers = [];

const server1 = new Server('localhost');
server1.allocateInstance(3000);
// server1.allocateInstance(3002);
// server1.allocateInstance(3003);

/* Queue CONFIG */
let FCFS_Queue = new N_FCFS_Queue(500);

/* Load Balancer CONFIG */
export let lb : LoadBalancer = new LoadBalancer(
    [server1],
    FCFS_Queue,
);
