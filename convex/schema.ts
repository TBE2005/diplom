import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    targets: defineTable({
        name: v.string(),
        collected: v.number(),
        total: v.number(),
        goalId: v.optional(v.id("goals")),
        alertId: v.optional(v.id("alerts")),
        userId: v.id("users"),
    }),
    goals: defineTable({
        backgroundColor: v.string(),
        indicatorColor: v.string(),
        textColor: v.string(),
        userId: v.id("users"),
    }),
    alerts: defineTable({
        backgroundColor: v.string(),
        textColor: v.string(),
        userId: v.id("users"),
    }),
    users: defineTable({
        name: v.string(),
        access_token: v.string(),
        account:v.string(),
    }),
    donations: defineTable({
        amount: v.number(),
        message: v.string(),
        targetId: v.id("targets"),
        fromUserId: v.id("users"),
        toUserId: v.id("users"),
    }),
});

