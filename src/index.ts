require("dotenv/config");
import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import routes from "./routes";
import { Com_user } from "./entity/Com_user";
import { Com_user_reedem } from "./entity/Com_user_reedem";
import { Md_product } from "./entity/Md_product";
import { Mg_rating } from "./entity/Mg_rating";
import session = require("express-session");
import cookieParser = require("cookie-parser");

(async () => {
  await createConnection({
    name: "default",
    type: "postgres",
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    port: 5432,
    synchronize: true,
    logging: false,
    entities: [Com_user, Com_user_reedem, Md_product, Mg_rating],
    migrations: ["src/migration/**/*.{js,ts}"],
    subscribers: ["src/subscriber/**/*.{js,ts}"],
    cli: {
      entitiesDir: "src/entity",
      migrationsDir: "src/migration",
      subscribersDir: "src/subscriber",
    },
  });

  const app = express();
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  var corsOptions = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  };

  app.use(
    session({
      secret: "tezboy",
      resave: true,
      saveUninitialized: true,
    })
  );

  app.use(cors(corsOptions));
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(
    bodyParser.urlencoded({
      limit: "50mb",
      extended: true,
      parameterLimit: 50000,
    })
  );

  app.use("/", routes);

  app.listen(process.env.APP_PORT, () => {
    console.log("Server started on port " + process.env.APP_PORT);
  });
})();
