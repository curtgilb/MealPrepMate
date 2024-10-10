import { builder } from "@/graphql/builder.js";

export const DeleteResult = builder
  .objectRef<{
    success: boolean;
    message?: string | undefined | null;
  }>("DeleteResult")
  .implement({
    fields: (t) => ({
      success: t.boolean({ resolve: (parent) => parent.success }),
      message: t.string({
        nullable: true,
        resolve: (parent) => parent.message,
      }),
    }),
  });
