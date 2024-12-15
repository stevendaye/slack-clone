import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";

/* Get members of a channel */
const populateUser = (ctx: QueryCtx, id: Id<"users">) => {
  return ctx.db.get(id);
};

/* Get member in a specfic workspace to check belonging */
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

export const getById = query({
  args: { id: v.id("members") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) return null;

    const member = await ctx.db.get(args.id);

    if (!member) return null;

    const currentMember = await getMember(ctx, member.workspaceId, userId);

    if (!currentMember) return null;

    const user = await populateUser(ctx, member.userId);

    if (!user) return null;

    return {
      ...member,
      user,
    };
  },
});

/* Get current member in an active workspace */
export const current = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) return null;

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!member) return null;

    return member;
  },
});

/* Get members of an active workspace */
export const get = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) return [];

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!member) return [];

    const data = await ctx.db
      .query("members")
      .withIndex("by_workspace_id", (q) =>
        q.eq("workspaceId", args.workspaceId)
      )
      .collect();

    const members = [];

    for (const member of data) {
      const user = await populateUser(ctx, member.userId);

      if (user) {
        members.push({
          ...member,
          user,
        });
      }
    }

    return members;
  },
});

/* Update the role of a member in an active workspace */
export const update = mutation({
  args: {
    id: v.id("members"),
    role: v.union(v.literal("admin"), v.literal("member")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) throw new Error("You are not authorized");

    /* Wherever you see this logic, it means we are checking if the member
     * exists and belongs to any workspace. We are probably going to use the
     * worskspace he belongs to check with the incoming worksapce if he
     * has the right to perform the action he is about to.
     */
    const member = await ctx.db.get(args.id);

    if (!member) throw new Error("Member not found");

    const currenMember = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", member.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!currenMember || currenMember.role !== "admin")
      throw new Error("You are not authorized");

    await ctx.db.patch(args.id, {
      role: args.role,
    });

    return args.id;
  },
});

/* Remove member from a workspace (Not applicable for admins) */
export const remove = mutation({
  args: {
    id: v.id("members"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) throw new Error("You are not authorized");

    const member = await ctx.db.get(args.id);

    if (!member) throw new Error("Member not found");

    const currenMember = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", member.workspaceId).eq("userId", userId)
      )
      .unique();

    /* In case where the person to be removed is already an admin */
    if (member.role === "admin") throw new Error("Admin cannot be removed");

    /* In case the admin want to remove themeselves */
    if (currenMember?._id === args.id && currenMember?.role === "admin")
      throw new Error("An admin cannot remove itself");

    const [messages, reactions, conversations] = await Promise.all([
      ctx.db
        .query("messages")
        .withIndex("by_member_id", (q) => q.eq("memberId", member._id))
        .collect(),
      ctx.db
        .query("reactions")
        .withIndex("by_member_id", (q) => q.eq("memberId", member._id))
        .collect(),
      ctx.db
        .query("conversations")
        .filter((q) =>
          q.or(
            q.eq(q.field("firstMemberId"), member._id),
            q.eq(q.field("secondMemberId"), member._id)
          )
        )
        .collect(),
    ]);

    for (const message of messages) {
      await ctx.db.delete(message._id);
    }

    for (const reaction of reactions) {
      await ctx.db.delete(reaction._id);
    }

    for (const conversation of conversations) {
      await ctx.db.delete(conversation._id);
    }

    await ctx.db.delete(args.id);

    return args.id;
  },
});
