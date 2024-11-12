import { v } from "convex/values";
import { mutation, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";

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

export const create = mutation({
  args: {
    body: v.string(),
    image: v.optional(v.id("_storage")),
    workspaceId: v.id("workspaces"),
    channelId: v.optional(v.id("channels")),
    conversationId: v.optional(v.id("conversations")),
    parentMessageId: v.optional(v.id("messages")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) throw new Error("You are not authorized!");

    const member = await getMember(ctx, args.workspaceId, userId);

    if (!member) throw new Error("You are not authorized");

    let _conversationId = args.conversationId;

    /* Assign conversation id only when replying
     *  in a threads of a 1 on 1 conversation
     */
    if (!args.channelId && !args.conversationId && args.parentMessageId) {
      const parentMessage = await ctx.db.get(args.parentMessageId);

      if (!parentMessage) throw new Error("Parent message does not exist");

      _conversationId = parentMessage.conversationId;
    }

    const messageId = ctx.db.insert("messages", {
      body: args.body,
      image: args.image,
      workspaceId: args.workspaceId,
      channelId: args.channelId,
      conversationId: _conversationId,
      parentMessageId: args.parentMessageId,
      memberId: member._id,
      updatedAt: Date.now(),
    });

    return messageId;
  },
});
