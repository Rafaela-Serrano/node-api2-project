const express = require("express");
const postRouter = require("./posts/posts-router");

const server = express();

server.use(express.json());
server.use(postRouter);

module.exports = server;