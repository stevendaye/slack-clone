import { mutation, QueryCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

/* Get member in a specfic workspace */
const getMember = (
  ctx: QueryCtx,
  workspaceId: Id<"workspaces">,
  userId: Id<"users">
) =>
  ctx.db
    .query("members")
    .withIndex("by_workspace_id_user_id", (q) =>
      q.eq("workspaceId", workspaceId).eq("userId", userId)
    )
    .unique();

export const toggle = mutation({
  args: { messageId: v.id("messages"), value: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) throw new Error("You are not authorized");

    const message = await ctx.db.get(args.messageId);

    if (!message) {
      throw new Error("Message not found");
    }

    const member = await getMember(ctx, message.workspaceId, userId);

    if (!member) {
      throw new Error("You are not authorized");
    }

    const userMessageReactionExists = await ctx.db
      .query("reactions")
      .filter((q) =>
        q.and(
          q.eq(q.field("messageId"), args.messageId),
          q.eq(q.field("memberId"), member._id),
          q.eq(q.field("value"), args.value)
        )
      )
      .first();

    if (userMessageReactionExists) {
      await ctx.db.delete(userMessageReactionExists._id);
      return userMessageReactionExists._id;
    }

    const reactionId = await ctx.db.insert("reactions", {
      value: args.value,
      messageId: args.messageId,
      memberId: member._id,
      workspaceId: message.workspaceId,
    });

    return reactionId;
  },
});
