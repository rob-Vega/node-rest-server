const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../db/config");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.paths = {
      auth: "/api/auth",
      categories: "/api/categories",
      products: "/api/products",
      search: "/api/search",
      users: "/api/users",
    };

    // DB connection
    this.connectDB();

    // Middlewares
    this.middlewares();

    // App Routes
    this.routes();
  }

  async connectDB() {
    await dbConnection();
  }

  middlewares() {
    //CORS
    this.app.use(cors());

    this.app.use(express.json());

    // public directory
    this.app.use(express.static("public"));
  }

  routes() {
    this.app.use(this.paths.auth, require("../routes/auth"));
    this.app.use(this.paths.categories, require("../routes/category"));
    this.app.use(this.paths.products, require("../routes/product"));
    this.app.use(this.paths.search, require("../routes/search"));
    this.app.use(this.paths.users, require("../routes/user"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`app listening at http://localhost:${process.env.PORT}`);
    });
  }
}

module.exports = Server;
