import { z } from "zod";

const offsetPaginationValidation = z.object({
  offset: z.number().nonnegative(),
  take: z.number().nonnegative(),
});

export { offsetPaginationValidation };
