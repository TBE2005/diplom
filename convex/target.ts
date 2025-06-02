import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { v } from "convex/values";

export const get = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("targets").collect();
    },
});

export const create = mutation({
    handler: async (ctx) => {
        await ctx.db.insert("targets", {
            name: "Новая цель",
            collected: 0,
            total: 0,
            goalId: "1" as Id<"goals">,
            alertId: "1" as Id<"alerts">,
            userId: "1" as Id<"users">,
        });
    },
});

export const update = mutation({
    args: {
        id: v.id("targets"),
        name: v.string(),
        collected: v.number(),
        total: v.number(),
        goalId: v.id("goals"),
        alertId: v.id("alerts"),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, {
            name: args.name,
            collected: args.collected,
            total: args.total,
            goalId: args.goalId,
            alertId: args.alertId,
        });
    },
});

export const remove = mutation({
    args: {
        id: v.id("targets"),
    },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});