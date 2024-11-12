import { mutation } from "./_generated/server";

export const createUploadURL = mutation(async (ctx) =>
  ctx.storage.generateUploadUrl()
);
