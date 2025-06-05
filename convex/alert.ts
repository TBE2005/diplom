import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const byUserId = query({
    args: {
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        return await ctx.db.query("alerts").filter(q => q.eq(q.field("userId"), args.userId)).collect();
    },
});

export const create = mutation({
    args: {
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("alerts", {
            backgroundColor: "#000000",
            textColor: "#000000",
            userId: args.userId,
        });
    },
});

export const update = mutation({
    args: {
        id: v.id("alerts"),
        backgroundColor: v.string(),
        textColor: v.string(),
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, {
            backgroundColor: args.backgroundColor,
            textColor: args.textColor,
            userId: args.userId,
        });
    },
});

export const remove = mutation({
    args: {
        id: v.id("alerts"),
    },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

