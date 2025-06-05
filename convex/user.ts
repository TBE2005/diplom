import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
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
        access_token: v.string(),
        name: v.string(),
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


export const getUserByTargetId = query({
    args: {
        targetId: v.id("targets"),
    },
    handler: async (ctx, args) => {
        const target = await ctx.db.get(args.targetId);
        return await ctx.db.get(target?.userId as Id<"users">);
    },
});


export const getUserByAccessToken = query({
    args: {
        accessToken: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.query("users").filter(q => q.eq(q.field("access_token"), args.accessToken)).first();
    },
});