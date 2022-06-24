## Docker container
To build and run the application
```bash
# build node.js application
npx tsc

# build docker image
docker build . -t service-compiler # linux
docker build . -t service-compiler --build-arg LOCALHOST=host.docker.internal # windows

# run docker container
docker run -d -p 3000:3000 --privileged service-compiler 
```

## REST API Documentation

### Status

Returns the status service and starting time.

`GET http://localhost:3000/status`

Response:
```json
{
    "status": "RUNNING",
    "startTime": 1647797276646
}
```

## Statistics

Returns statistics regarding the number of compilations/executions completed.

`GET http://localhost:3000/statistics`

Response:
```json
{
    "PENDING": 0,
    "COMPILING": 0,
    "COMPILED": 0,
    "RUNNING": 0,
    "COMPLETED": 0,
    "DISCARDED": 0,
    "FAILED": 0
}
```

## Compile & Execute

Starts a compile/run task and returns if it was successfully started.

`POST http://localhost:3000/compile`

Request:
```json
{
    "id": "123e4567-e89b-12d3-a456-426614174000", // UUIDv4
    "sourceCode": "aGVsbG8=", // in base64
    "input": "100 500", // a single string
    "flags": [
        "-std=c++11",
        "-O2"
    ],
    "timeLimit": 30, // optional integer indicating the maximum execution time of the program
    "memoryLimit": 250, // optional integer indicating the maximum memory that can be used by the program,
    "executeProgram": true // optional boolean (by default false) indicating whether execution of the program is required in addition to compilation
}
```

The two **Limit* parameters are not mandatory and if they are not present, default values (*DEFAULT_TIMEOUT* and *DEFAULT_MEMORY*) ​​are used. In any case, the values ​​must be within a specific range (*MAX_MEMORY* and *MAX_TIMEOUT*).

#### Process and save

If all the parameters sent are correct and the source is correctly decoded and saved on disk, a response similar to the following is returned.

Response [200]:
```json
{
    "id": "123e4567-e89b-12d3-a456-426614174001",
    "success": true
}
```

While in the event of an error a 400 will be returned indicating the invalid fields.

Response [400]:
```json
[
    {
        "value": "123e467-e89b-12d3-a456-426614174001",
        "msg": "id missing or invalid",
        "param": "id",
        "location": "body"
    },
    {
        "value": "aGVsbG8",
        "msg": "sourceCode missing or invalid",
        "param": "sourceCode",
        "location": "body"
    }
]
```

#### Report the compile/execute results

The operations of compilation and execution of the program sent by the user are carried out asynchronously and the result/output is sent to the endpoint:

`POST http://localhost:5000/completedCompilation`

Request:
```json
{
    "id": "123e4567-e89b-12d3-a456-426614174000", // unique identifier of the compile/execute task request
    "action": "COMPILE|EXECUTE", // action that is being notified
    "nextAction": "EXECUTE|", // next action to be done for the request. Empty string means no further action or the current one is failed
    "status": true, // boolean indicating whether any errors occurred in the execution of the action
    "output": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua", // output of the action
    "actionTime": 15000, // how many milliseconds it took to perform the action
    "totalTime": 50000 // total milliseconds since the task was received
}
```