import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CreateUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    picture: v.string(),
    uid: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      // Log incoming data
      console.log("[CreateUser] Received args:", args);

      // Check if user exists - using unique email
      const existingUsers = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("email"), args.email))
        .collect();

      if (existingUsers.length > 0) {
        const existingUser = existingUsers[0];

        return existingUser;
      }

      // Insert new user
      const userData = {
        name: args.name,
        email: args.email,
        picture: args.picture,
        uid: args.uid,
      };

      const newUser = await ctx.db.insert("users", userData);

      return newUser;
    } catch (error) {
      console.error("[CreateUser] Error in mutation:", error);
      throw error;
    }
  },
});

export const GetUser = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect();
    return user[0];
  },
});
