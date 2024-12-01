import { v } from "convex/values";
import { mutation, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";

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

export const createOrGet = mutation({
  args: { memberId: v.id("members"), workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) throw new Error("You are not authorized");

    const currentMember = await getMember(ctx, args.workspaceId, userId);

    const secondMember = await ctx.db.get(args.memberId);

    if (!currentMember || !secondMember) throw new Error("Cannot find member");

    const existingConversation = await ctx.db
      .query("conversations")
      .filter((q) => q.eq(q.field("workspaceId"), args.workspaceId))
      .filter((q) =>
        q.or(
          q.and(
            q.eq(q.field("firstMemberId"), currentMember._id),
            q.eq(q.field("secondMemberId"), secondMember._id)
          ),
          q.and(
            q.eq(q.field("secondMemberId"), secondMember._id),
            q.eq(q.field("firstMemberId"), currentMember._id)
          )
        )
      )
      .unique();

    if (existingConversation) return existingConversation._id;

    const conversationId = await ctx.db.insert("conversations", {
      workspaceId: args.workspaceId,
      firstMemberId: currentMember._id,
      secondMemberId: secondMember._id,
    });

    return conversationId;
  },
});
