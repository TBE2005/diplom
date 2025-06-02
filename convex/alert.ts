import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const get = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("alerts").collect();
    },
});

export const create = mutation({
    args: {
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("alerts", {
            name: "Новое оповещение",
            backgroundColor: "#000000",
            textColor: "#000000",
            userId: args.userId,
        });
    },
});

export const update = mutation({
    args: {
        id: v.id("alerts"),
        name: v.string(),
        backgroundColor: v.string(),
        textColor: v.string(),
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, {
            name: args.name,
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

