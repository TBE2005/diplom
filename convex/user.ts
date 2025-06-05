import { v } from "convex/values";
import { httpAction, mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const create = mutation({
    args: {
        access_token: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db.insert("users", {
            name: "user",
            access_token: args.access_token,
        });
        return user;
    },
});

export const update = mutation({
    args: {
        id: v.id("users"),
        access_token: v.optional(v.string()),
        name: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { access_token: args.access_token, name: args.name });
    },
});

export const getAll = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("users").collect();
    },
});

export const getInfoByAccessToken = httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const accessToken = url.searchParams.get("access_token");
    const response = await fetch("https://yoomoney.ru/api/account-info", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
        },
    });
    const user = await response.json();
    if (user?._id) {
        return new Response(JSON.stringify(user), { status: 200, headers: { "Content-Type": "application/json" } });
    }
    return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
});

export const getUserByTargetId = query({
    args: {
        targetId: v.id("targets"),
    },
    handler: async (ctx, args) => {
        const target = await ctx.db.get(args.targetId);
        return await ctx.db.get(target?.userId as Id<"users">);
    },
});
