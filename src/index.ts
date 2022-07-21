import App from "./config/App";
import * as dotenv from "dotenv";
import AppClusterService from "./config/Cluster";

dotenv.config();
// AppClusterService.clusterize(new App());
App.start();
