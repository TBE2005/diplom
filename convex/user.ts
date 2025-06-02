import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
    args: {
        account: v.string(),
        balance: v.number(),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db.insert("users", {
            account: args.account,
            balance: args.balance,
        });
        return user;
    },
});

export const getById = query({
    args: {
        id: v.id("users"),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.id);
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
