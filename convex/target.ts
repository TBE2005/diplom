import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { v } from "convex/values";

export const get = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("targets").collect();
    },
});

export const getSumTargets = query({
    args: {
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const targets = await ctx.db.query("targets").filter(q => q.eq(q.field("userId"), args.userId)).collect();
        const sum = targets.reduce((acc, target) => acc + target.total, 0);
        return sum;
    },
});

export const getById = query({
    args: {
        id: v.id("targets"),
    },
    handler: async (ctx, args) => {
        const target = await ctx.db.get(args.id);
        const userTarget = await ctx.db.query("users").filter(q => q.eq(q.field("_id"), target?.userId)).first();
        return { ...target, user: userTarget };
    },
});

export const create = mutation({
    args: {
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("targets", {
            name: "Новая цель",
            collected: 10,
            total: 100,
            userId: args.userId,
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
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, {
            name: args.name,
            collected: args.collected,
            total: args.total,
            goalId: args.goalId,
            alertId: args.alertId,
            userId: args.userId,
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

export const byUserId = query({
    args: {
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        return await ctx.db.query("targets").filter(q => q.eq(q.field("userId"), args.userId)).collect();
    },
});

