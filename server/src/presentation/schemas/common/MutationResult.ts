import { builder } from "@/presentation/builder.js";

export const DeleteResult = builder
  .objectRef<{
    success: boolean;
    id: string;
    message?: string | undefined | null;
  }>("DeleteResult")
  .implement({
    fields: (t) => ({
      id: t.globalID({ resolve: (parent) => parent.message }),
      success: t.boolean({ resolve: (parent) => parent.success }),
      message: t.string({
        nullable: true,
        resolve: (parent) => parent.message,
      }),
    }),
  });
