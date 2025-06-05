import { httpRouter } from "convex/server";
import { callbackAuth, payment } from "./yoomoney";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

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
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const accessToken = url.searchParams.get("access_token");
    const response = await fetch("https://yoomoney.ru/api/account-info", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
    });
    const user = await response.json();
    const userData = await ctx.runQuery(api.user.getUserByAccessToken, { accessToken: accessToken as string });
    if (userData?._id) {
      return new Response(JSON.stringify({
        ...user,
        ...userData,
      }), { status: 200, headers: new Headers({ "Content-Type": "application/json", "Access-Control-Allow-Origin": "https://diplom-liard-three.vercel.app", "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type, Authorization" }) });
    }
    return new Response(JSON.stringify({ error: "User not found" }), { status: 404, headers: new Headers({ "Content-Type": "application/json", "Access-Control-Allow-Origin": "https://diplom-liard-three.vercel.app", "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type, Authorization" }) });
  }),
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