import "./core/extension_methods/String";
import "./core/extension_methods/Number";
import "./core/extension_methods/Moment";

import express from "express";
import { host, port as port } from "./config";
import { handleError } from "error-api.hl";
import { BootsTrapper, Service } from "./moduleManager";

const app = express();
const bootstrapper = new BootsTrapper();

// One repo and service for all endpoints. Race condition?
const repository = bootstrapper.createRepository();
const service = new Service(repository);

app.use(express.json());

app.get("/", (req, res, next) => {
  res.send("I'm fucking alive");
});

app.get("/test", (req, res, next) => {
  res.send("Test if this really works");
});

app.post("/airlines/:month/:year/busier", async (req, res, next) => {
  res.send(service.busierAirlineIn({ month: +req.params.month, year: +req.params.year }));
});

app.get("/airlines/:airline/flights/:flight/occupation", async (req, res, next) => {
  res.send(
    service.flightOccupiedCapacity({
      airlineId: +req.params.airline,
      flightId: +req.params.flight
    })
  );
});

app.get("/airlines/:airline/flights/:flight/duration", async (req, res, next) => {
  res.send(
    service.estimatedFlightDuration({
      airlineId: +req.params.airline,
      flightId: +req.params.flight
    })
  );
});

app.get("/airports/:airport/:date/movements-count", async (req, res, next) => {
  res.send(
    service.movementsCountOnDay({
      airPortId: +req.params.airport,
      day: new Date(req.params.date)
    })
  );
});

// Error handling middleware, we delegate the handling to the centralized error handler
app.use(async (err: Error, req, res, next) => {
  await handleError(err, res);
});

process.on("uncaughtException", (error: Error) => {
  handleError(error);
});

process.on("unhandledRejection", reason => {
  handleError(reason);
});

app.listen(port, () => {
  console.log(`App listening at ${host}:${port}`);
});
