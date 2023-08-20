const express = require("express");
const cors = require("cors");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.usersPath = "/api/users";

    // Middlewares
    this.middlewares();

    // App Routes
    this.routes();
  }

  middlewares() {
    //CORS
    this.app.use(cors());

    this.app.use(express.json());

    // public directory
    this.app.use(express.static("public"));
  }

  routes() {
    this.app.use(this.usersPath, require("../routes/user"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("app listening in port", this.port);
    });
  }
}

module.exports = Server;
