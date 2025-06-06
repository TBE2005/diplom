import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
    args: {
        amount: v.number(),
        message: v.string(),
        targetId: v.id("targets"),
        fromUserId: v.id("users"),
        toUserId: v.id("users"),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("donations", {
            amount: args.amount,
            message: args.message,
            targetId: args.targetId,
            fromUserId: args.fromUserId,
            toUserId: args.toUserId,
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
        const targets = await ctx.db.query("targets").collect();
        const users = await ctx.db.query("users").collect();
        return donations.map(donation => ({
            ...donation,
            toUser: users.find(user => user._id === donation.toUserId),
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
        const users = await ctx.db.query("users").collect();
        return donations.map(donation => ({
            ...donation,
            fromUser: users.find(user => user._id === donation.fromUserId),
            target: targets.find(target => target._id === donation.targetId),
        }));
    },
});


export const getDonationToLastWithAlert = query({
    args: {
        targetId: v.id("targets"),
    },
    handler: async (ctx, args) => {
        const donations = await ctx.db.query("donations").filter(q => q.eq(q.field("targetId"), args.targetId)).collect();
        if (donations.length === 0) return null;
        const targets = await ctx.db.query("targets").filter(q => q.eq(q.field("_id"), args.targetId)).first();
        const alerts = await ctx.db.query("alerts").filter(q => q.eq(q.field("_id"), targets?.alertId)).first();
        const users = await ctx.db.query("users").collect();
        return {
            ...donations[donations.length - 1],
            fromUser: users.find(user => user._id === donations[donations.length - 1].fromUserId),
            alert: alerts,
        };
    },
});

