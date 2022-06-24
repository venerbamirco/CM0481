import { io } from "../app";

// socket.io wrapper for sending data to client
// DOC: https://socket.io/docs/v3/emit-cheatsheet/#server-side
export let notifyClient = (socketID: any, message: Object, event : string) => io.to(socketID).emit(event, JSON.stringify(message));