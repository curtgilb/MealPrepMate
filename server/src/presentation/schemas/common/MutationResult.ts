import { builder } from '@/presentation/builder.js';

export const DeleteResult = builder
  .objectRef<{
    success: boolean;
    id: string;
    message?: string | undefined | null;
  }>("DeleteResult")
  .implement({
    fields: (t) => ({
      id: t.id({ resolve: (parent) => parent.id }),
      success: t.boolean({ resolve: (parent) => parent.success }),
      message: t.string({
        nullable: true,
        resolve: (parent) => parent.message,
      }),
    }),
  });
