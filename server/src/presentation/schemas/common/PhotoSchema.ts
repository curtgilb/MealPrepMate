import { z } from 'zod';

import { uploadPhoto } from '@/application/services/PhotoService.js';
import { db } from '@/infrastructure/repository/db.js';
import { builder } from '@/presentation/builder.js';

// ============================================ Types ===================================
builder.prismaNode("Photo", {
  id: { field: "id" },
  name: "Photo",
  fields: (t) => ({
    url: t.exposeString("path"),
    blurData: t.exposeString("blurData", { nullable: true }),
    isPrimary: t.exposeBoolean("isPrimary"),
  }),
});

// ============================================ Mutations ===============================
builder.mutationFields((t) => ({
  uploadPhoto: t.prismaField({
    type: "Photo",
    args: {
      photo: t.arg({ type: "File", required: true }),
      isPrimary: t.arg.boolean({ required: true }),
    },
    resolve: async (query, root, args) => {
      const buffer = Buffer.from(await args.photo.arrayBuffer());
      return await uploadPhoto(buffer, query);
    },
  }),
  addPhotoToRecipe: t.prismaField({
    type: "Recipe",
    args: {
      recipeId: t.arg.string({ required: true }),
      photoId: t.arg.stringList({ required: true }),
    },
    resolve: async (query, root, args) => {
      return await db.recipe.update({
        where: { id: args.recipeId },
        data: {
          photos: {
            connect: args.photoId.map((id) => ({ id })),
          },
        },
        ...query,
      });
    },
  }),
  removePhotoFromRecipe: t.prismaField({
    type: "Recipe",
    args: {
      recipeId: t.arg.string({ required: true }),
      photoIds: t.arg.stringList({ required: true }),
    },
    resolve: async (query, root, args) => {
      return await db.recipe.update({
        where: { id: args.recipeId },
        data: {
          photos: {
            disconnect: args.photoIds.map((id) => ({ id })),
          },
        },
        ...query,
      });
    },
  }),
}));
