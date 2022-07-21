import express = require("express");
import bodyParser = require("body-parser");
import cors = require("cors");
import hpp = require("hpp");
// import xss = require("xss-clean");
import helmet, { originAgentCluster } from "helmet";
import cookieParser = require("cookie-parser");
import { Sanitize } from "../utils/functions/sanitize";
import rateLimit from "express-rate-limit";
import Mongo from "./db/Mongo";
import { AuthMiddleware } from "../utils/middlewares/auth";
import TEXTS from "../utils/Texts";
import "dotenv/config";
import AuthController from "../controllers/Auth.controller";
import MailController from "../controllers/Mail.controller";
import SessionController from "../controllers/Session.controller";
import { route } from "../utils/decorators/Route.decorator";

class App {
  public app: express.Application;
  private corsWhitelist: string[] = ["http://127.0.0.1"];

  constructor() {
    console.log("Starting server...");

    this.app = express();
    this.config();
    this.connectDatabases();
    this.securityConfig();
    this.configureCustomMiddlewares();
    this.configRoutes();
  }

  private connectDatabases(): void {
    console.log("Connecting to databases...");

    new Mongo();
  }

  private configRoutes(): void {
    console.log("Configuring routes...");

    new AuthController();
    new MailController();
    new SessionController();
    this.app.use(route);
  }

  private configureCors(): void {
    console.log("Configuring CORS...");

    this.app.use(
      cors({
        origin: this.corsWhitelist,
        credentials: true,
        allowedHeaders: "Content-Type, Accept, Origin, Timestamp",
        preflightContinue: false,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      })
    );
  }

  private async config(): Promise<void> {
    console.log("Configuring server...");

    this.configureCors();
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(bodyParser.json({ limit: "50mb" }));
    this.app.use(cookieParser());
    this.app.use(
      rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
        message: TEXTS.warning.TO_MUCH_REQUESTS,
      })
    );
  }

  private securityConfig(): void {
    console.log("Configuring security...");

    this.app.use(helmet());
    this.app.use(hpp());
    // this.app.use(xss());
  }

  public start(): void {
    this.app.listen(process.env.PORT || 3333, () =>
      console.log("Server started!")
    );
  }

  private configureCustomMiddlewares(): void {
    console.log("Configuring middlewares...");

    this.app.use(AuthMiddleware);

    this.app.use((req, res, next) => {
      Promise.all([
        Sanitize(req.body),
        Sanitize(req.params),
        Sanitize(req.query),
        Sanitize(req.headers),
      ]).then(([body, params, query, headers]) => {
        req.body = body;
        req.params = params as any;
        req.query = query as any;
        req.headers = headers as any;
        next();
      });
    });
  }
}

const app = new App();

export default app;
