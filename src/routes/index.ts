import { Router } from "express";
import auth from "./auth";
import gift from "./gift";

const routes = Router();

routes.use("/auth", auth);
routes.use("/gifts", gift);

export default routes;
