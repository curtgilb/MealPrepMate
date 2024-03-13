import { Prisma, Course, Cuisine, Category } from "@prisma/client";
import { toTitleCase } from "../util/utils.js";
import { cleanedStringSchema } from "../validations/graphql/RecipeValidation.js";

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
        async findOrCreate(
          name: string,
          query?: CourseQuery
        ): Promise<Course | undefined> {
          const cleanedName = cleanedStringSchema(25, toTitleCase).parse(name);
          let foundCourse;
          try {
            foundCourse = await client.course.findUniqueOrThrow({
              where: { name },
            });
          } catch (error) {
            if (
              error instanceof Prisma.PrismaClientKnownRequestError &&
              error.name === "NotFoundError"
            ) {
              foundCourse = await client.course.create({
                data: {
                  name: cleanedName,
                },
                ...query,
              });
            }
          }
          return foundCourse;
        },
      },
      cuisine: {
        async findOrCreate(
          name: string,
          query?: CuisineQuery
        ): Promise<Cuisine | undefined> {
          const cleanedName = cleanedStringSchema(25, toTitleCase).parse(name);
          let foundCuisine;
          try {
            foundCuisine = await client.cuisine.findUniqueOrThrow({
              where: { name },
            });
          } catch (error) {
            if (
              error instanceof Prisma.PrismaClientKnownRequestError &&
              error.name === "NotFoundError"
            ) {
              foundCuisine = await client.cuisine.create({
                data: {
                  name: cleanedName,
                },
                ...query,
              });
            }
          }
          return foundCuisine;
        },
      },
      category: {
        async findOrCreate(
          name: string,
          query?: CategoryQuery
        ): Promise<Category | undefined> {
          const cleanedName = cleanedStringSchema(25, toTitleCase).parse(name);
          let foundCategory;
          try {
            foundCategory = await client.category.findUniqueOrThrow({
              where: { name },
            });
          } catch (error) {
            if (
              error instanceof Prisma.PrismaClientKnownRequestError &&
              error.name === "NotFoundError"
            ) {
              foundCategory = await client.category.create({
                data: {
                  name: cleanedName,
                },
                ...query,
              });
            }
          }
          return foundCategory;
        },
      },
    },
  });
});
