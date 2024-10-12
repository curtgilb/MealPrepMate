import { Prisma, Course, Cuisine, Category } from "@prisma/client";
import { toTitleCase } from "@/application/util/utils.js";
import { cleanedStringSchema } from "@/validations/utilValidations.js";

type CourseQuery = {
  include?: Prisma.CourseInclude | undefined;
  select?: Prisma.CourseSelect | undefined;
};

type CuisineQuery = {
  include?: Prisma.CuisineInclude | undefined;
  select?: Prisma.CuisineSelect | undefined;
};

type CategoryQuery = {
  include?: Prisma.CategoryInclude | undefined;
  select?: Prisma.CategorySelect | undefined;
};

export const RecipeMetaExtension = Prisma.defineExtension((client) => {
  return client.$extends({
    model: {
      course: {
        async findOrCreate(name: string, query?: CourseQuery): Promise<Course> {
          const cleanedName = cleanedStringSchema(25, toTitleCase).parse(name);

          try {
            return await client.course.findUniqueOrThrow({
              where: { name },
            });
          } catch (error) {
            if (
              error instanceof Prisma.PrismaClientKnownRequestError &&
              error.name === "NotFoundError"
            ) {
              return await client.course.create({
                // @ts-ignore
                data: {
                  name: cleanedName,
                },
                ...query,
              });
            }
            throw error;
          }
        },
      },
      cuisine: {
        async findOrCreate(
          name: string,
          query?: CuisineQuery
        ): Promise<Cuisine> {
          const cleanedName = cleanedStringSchema(25, toTitleCase).parse(name);
          try {
            return await client.cuisine.findUniqueOrThrow({
              where: { name },
            });
          } catch (error) {
            if (
              error instanceof Prisma.PrismaClientKnownRequestError &&
              error.name === "NotFoundError"
            ) {
              return await client.cuisine.create({
                data: {
                  name: cleanedName,
                },
                ...query,
              });
            }
            throw error;
          }
        },
      },
      category: {
        async findOrCreate(
          name: string,
          query?: CategoryQuery
        ): Promise<Category> {
          const cleanedName = cleanedStringSchema(25, toTitleCase).parse(name);

          try {
            return await client.category.findUniqueOrThrow({
              where: { name },
            });
          } catch (error) {
            if (
              error instanceof Prisma.PrismaClientKnownRequestError &&
              error.name === "NotFoundError"
            ) {
              return await client.category.create({
                data: {
                  name: cleanedName,
                },
                ...query,
              });
            }
            throw error;
          }
        },
      },
    },
  });
});
