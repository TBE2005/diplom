import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const get = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("goals").collect();
    },
});

export const create = mutation({
    args: {
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("goals", {
            name: "Новая цель",
            backgroundColor: "#000000",
            indicatorColor: "#000000",
            textColor: "#000000",
            userId: args.userId,
        });
    },
});

export const update = mutation({
    args: {
        id: v.id("goals"),
        name: v.string(),
        backgroundColor: v.string(),
        indicatorColor: v.string(),
        textColor: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, {
            name: args.name,
            backgroundColor: args.backgroundColor,
            indicatorColor: args.indicatorColor,
            textColor: args.textColor,
        });
    },
});

export const remove = mutation({
    args: {
        id: v.id("goals"),
    },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});
