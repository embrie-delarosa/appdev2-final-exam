import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  todos: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
    userId: v.id("users")
  }),
  users: defineTable({
    fullName: v.string(),
    email: v.string(),
    password: v.string(),
  }).index("by_email", ["email"])
});
