import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
    args: {
        amount: v.number(),
        message: v.string(),
        targetId: v.id("targets"),
        fromUserId: v.id("users"),
        toUserId: v.id("users"),
        name: v.string(),
    },
    handler: async (ctx, args) => {

        await ctx.db.insert("donations", {
            amount: args.amount,
            message: args.message,
            targetId: args.targetId,
            fromUserId: args.fromUserId,
            toUserId: args.toUserId,
            name: args.name,
        });

        // update target amount
        const target = await ctx.db.get(args.targetId);
        if (target) await ctx.db.patch(args.targetId, { collected: target.collected + args.amount });
    },
});

export const getMyDonations = query({
    args: {
        fromUserId: v.id("users"),
    },
    handler: async (ctx, args) => {
        // donations with target
        const donations = await ctx.db.query("donations").filter(q => q.eq(q.field("fromUserId"), args.fromUserId)).collect();
        const targets = await ctx.db.query("targets").filter(q => q.eq(q.field("userId"), args.fromUserId)).collect();
        return donations.map(donation => ({
            ...donation,
            target: targets.find(target => target._id === donation.targetId),
        }));
    },
});

export const getMyDonationsTo = query({
    args: {
        toUserId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const donations = await ctx.db.query("donations").filter(q => q.eq(q.field("toUserId"), args.toUserId)).collect();
        const targets = await ctx.db.query("targets").filter(q => q.eq(q.field("userId"), args.toUserId)).collect();
        return donations.map(donation => ({
            ...donation,
            target: targets.find(target => target._id === donation.targetId),
        }));
    },
});