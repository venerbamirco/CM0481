## Load Balancer with Queue Management
To build and run the application
```bash
npm start
```
## Socket.io Documentation
### New compilation request

Socket Event: `compilationRequest`

Arguments:
```json
{
    "sourceCode": "aGVsbG8=", // in base64
    "input": "100 500", // a single string
    "flags": [ // compilation flags as an array for each one
        "-std=c++11",
        "-O2"
    ],
    "execute": true, // indicating whether execution of the program is required in addition to compilation
}
```

When the request is received, the balancer will check the load of all the servers and their respecive containers. Once it finds the first free container, it automatically sends the task to the server, without queueing it. In case, there is no instance available (max load is reached for all the instances), the balancer will queue the task and send a response via the same socket. All messages sent on the same socket where the  request is received, are sent as JSON, in the following format:

```json
{
    "status": "X", // where X can be: "success", "info", "error",
    "code": "Y", // where Y is a number from the below table, indicating the status of the request
    "message": "Z", // an optional message, depending on the status
}
```

Note:
1. In case the status is **error**, there is not going to be sent any message anymore. So the socket can be closed client-side.
2. The status **info** indicates a METADATA, such as queued, running, etc.
3. The status **success** indicates a successful response and in the message there is going to be the final result.

### List of the status codes

* 100 - Reason: "The queue is full. Try later." | Status: "error"
* 101 - Reason: "Task added to queue. Current waiting tasks: XXX." | Status: "info" | Message: XXX (nr of taks in the queue)
* 103 - Reason: "The result of compilation is present on message field" | Status: "success" | Message: Result
* 104 - Reason: "Task is being handled by Server"  Status: "success" | Message: Task assigned ID
* 105 - Reason: "Forwarded error message from server"  Status: "error" | Message: Body
* 106 - Reason: ""Unknown response from server." | Status: "error"
* 107 - Reason:  "Source code not correctly encoded in base64." | Status: "error"
* 108 - Reason:  "Task correctly received by the load balancer." | Status: "info"

### List of events
* "compilationRequest": This event occurs when the client send the C++ program to the load balancer, thus this one must handle this event
* "received": This event occurs when the load balancer receives correctly the C++ program from the client, so emit this event to him and client must handle this event
* "queued": This event occurs when the load balancer have received the program and is trying to add the program to its local queue, the outcome of the operation is     contained inside the messaage emitted by the load balancer to the client, so client must handle this event
* "handled": This event occurs when the program is assigned by the load balancer to a docker container, the outcome of the operation is contained inside the messaage emitted by the load balancer to the client, so client must handle this event
* "finished": This event occurs when the result of the execution of the program is returned by the server to the client, thus the client must handle this event

## REST API Documentation
`GET http://localhost:5000/`

Response:

The static page of the application.

`GET http://localhost:5000/completedCompilation`

Request:

```json
{
    "id": "123e4567-e89b-12d3-a456-426614174000", // unique identifier of the compile/execute task request
    "action": "COMPILE|EXECUTE", // action that is being notified
    "status": true, // boolean indicating whether any errors occurred in the execution of the action
    "output": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua", // output of the action
    "actionTime": 15000, // how many milliseconds it took to perform the action
    "totalTime": 50000 // total milliseconds since the task was received
}
```
