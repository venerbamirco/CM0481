import express from 'express';
import colors = require("colors");
import bodyparser = require("body-parser");
import cors = require("cors");
import http = require("http");
import { lb } from './balancer';
colors.enabled = true;

/****** Express & Socket libraries load ******/
console.log("Configuring Express middleware...".yellow);
export const app = express();
app.use(bodyparser.json({ limit: "5mb" })); // using a conservative limit 
app.use(cors());
console.log("Express configured successfully.".blue);

console.log("Initializing the socket...".yellow);
const server = http.createServer(app);
export const io = require("socket.io")(server, {
    allowEIO3: true,
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });
console.log("Socket initialized successfully.".blue);
/********************************************/

/****** Load Balancer Configuration ******/
console.log("Configuring the Load Balancer...".yellow);
require('./balancer');
console.log("Load Balancer configured successfully.".blue);
/*****************************************/

/****** Socket & Routes handlers ******/
server.listen(5000, () => { console.log(`Socket listening at http://localhost:${5000}`.blue); });
app.listen(7000, () => { console.log(`Webserver listening on port ${7000}`.blue) })

console.log("Loading routes...".yellow);
require('./routes/frontend')(app);
require('./routes/completedCompilation')(app, lb);
console.log("Routes loaded successfully.".blue);

console.log("Loading socket handler...".yellow);
require('./handlers/socketHandler')(server);
console.log("Socket handler loaded successfully.".blue);
/*************************************/