import express, { Application } from "express";
import { notFoundHandler } from "./middlewares/error.middleware";
import promClient from "prom-client";

const app: Application = express();

const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics();

const requestDuration = new promClient.Histogram({
  name: "http_request_duration_seconds",
  help: "Histogram of HTTP request durations",
  buckets: [0.1, 0.5, 1, 2, 5],
});

app.use(express.json());

app.use((_req, res, next) => {
  const end = requestDuration.startTimer();
  res.on("finish", () => {
    end({ statusCode: res.statusCode });
  });
  next();
});

app.get("/metrics", (_req, res) => {
  res.set("Content-Type", promClient.register.contentType);
  res.end(promClient.register.metrics());
});

app.use(notFoundHandler);

export default app;
