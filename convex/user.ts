import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const create = mutation({
    args: {
        account: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db.insert("users", {
            name: "user",
            account: args.account,
        });
        return user;
    },
});

export const update = mutation({
    args: {
        id: v.id("users"),
        name: v.string(),
        account: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { name: args.name, account: args.account });
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


export const getUserByAccount = query({
    args: {
        account: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.query("users").filter(q => q.eq(q.field("account"), args.account)).first();
    },
});