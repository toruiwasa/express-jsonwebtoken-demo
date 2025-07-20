import "dotenv/config";
import { RequestListener } from "http";
import { authMiddleware } from "./auth/authMiddleware";
import { authRoutes } from "./auth/authRouts";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import fs from "fs";
import https from "https";

const server = express();

server.use(cookieParser());
server.use(
  cors({
    origin: "https://localhost:3000",
    credentials: true,
  }),
);
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use(authRoutes);

server.post("/protected", authMiddleware, (_, res) => {
  res.send({
    data: "This is protected data.",
  });
});

https
  .createServer(
    {
      key: fs.readFileSync("../../certs/key.pem"),
      cert: fs.readFileSync("../../certs/cert.pem"),
    },
    server as RequestListener,
  )
  .listen(process.env.SERVER_PORT, () => {
    console.log(`Server listening on port ${process.env.SERVER_PORT ?? ""}`);
  });
