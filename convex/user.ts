import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
    args: {
        account: v.string(),
        balance: v.number(),
        access_token: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db.insert("users", {
            account: args.account,
            balance: args.balance,
            access_token: args.access_token,
        });
        return user;
    },
});

export const getByAccessToken = query({
    args: {
        access_token: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db.query("users").filter(q => q.eq(q.field("access_token"), args.access_token)).first();
        return user;
    },
});

export const getByAccount = query({
    args: {
        account: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db.query("users").filter(q => q.eq(q.field("account"), args.account)).first();
        return user;
    },
});

export const getAll = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("users").collect();
    },
});
