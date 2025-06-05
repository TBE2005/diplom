import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
    args: {
        amount: v.number(),
        message: v.string(),
        targetId: v.id("targets"),
        userId: v.id("users"),
        name: v.string(),
    },
    handler: async (ctx, args) => {
        
        await ctx.db.insert("donations", {
            amount: args.amount,
            message: args.message,
            targetId: args.targetId,
            userId: args.userId,
            name: args.name,
        });

        // update target amount
        const target = await ctx.db.get(args.targetId);
        if (target) await ctx.db.patch(args.targetId, { collected: target.collected + args.amount });
    },
});

export const getByUserId = query({
    args: {
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        // donations with target
        const donations = await ctx.db.query("donations").filter(q => q.eq(q.field("userId"), args.userId)).collect();
        const targets = await ctx.db.query("targets").filter(q => q.eq(q.field("userId"), args.userId)).collect();
        return donations.map(donation => ({
            ...donation,
            target: targets.find(target => target._id === donation.targetId),
        }));
    },
});