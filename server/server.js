import dotenv from 'dotenv';
dotenv.config();
import express from "express";

import bodyParser from 'body-parser';
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors"
import { connectToDatabase } from './database/index.js';

connectToDatabase();

import { setUserOnline, setUserOffline } from "./user.js";

const app = express();
const corsOptions = {
  origin: process.env.APP_FRONT_END,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,  // Include cookies and credentials
  optionsSuccessStatus: 204, // No content response for preflight requests
}

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(router);


const httpServer = createServer(app);

import { router } from "./routes/index.js";


const io = new Server(httpServer, {
    cors: {
      origin: process.env.APP_FRONT_END,
      methods: ["GET", "POST"],
      credentials: true
    }
});
  

io.on("connection", (socket) => {

  socket.on('login', async ({uuid}) => {
    try {
      console.log(uuid);
      setUserOnline(uuid, socket)
    } catch (error) {
      console.error(error)
    }
  });


  


  socket.on('disconnect', () => {
    console.log("User disconnected", socket.id);
    setUserOffline( socket );
  });

});

httpServer.listen(3010);

export {io};