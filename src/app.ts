import { Application } from "express";
import { notFoundHandler } from "./middlewares/error.middleware";
import expressModule from "express";

const app: Application = expressModule();

app.use(expressModule.json());
app.use(notFoundHandler);

export default app;
