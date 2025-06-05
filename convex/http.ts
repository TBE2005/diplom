import { httpRouter } from "convex/server";
import { callbackAuth, payment } from "./yoomoney";
import { httpAction } from "./_generated/server";
import { getInfoByAccessToken } from "./user";

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

http.route({
  path: "/user/getByAccessToken",
  method: "GET",
  handler: getInfoByAccessToken,
});

// Обработка preflight OPTIONS-запроса
http.route({
  path: "/payment",
  method: "OPTIONS",
  handler: httpAction(async (_, request) => {
    const headers = request.headers;
    if (
      headers.get("Origin") !== null &&
      headers.get("Access-Control-Request-Method") !== null &&
      headers.get("Access-Control-Request-Headers") !== null
    ) {
      return new Response(null, {
        headers: new Headers({
          "Access-Control-Allow-Origin": "https://diplom-liard-three.vercel.app",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Max-Age": "86400",
        }),
      });
    } else {
      return new Response();
    }
  }),
});

export default http;