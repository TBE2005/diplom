import { httpRouter } from "convex/server";
import { callbackAuth, payment } from "./yoomoney";

const http = httpRouter();

http.route({
  path: "/callback",
  method: "GET",
  handler: callbackAuth,
});

http.route({
  path: "/payment",
  method: "POST",
  handler: payment,
});

export default http;