import { z } from "zod";

const OffsetPaginationValidation = z.object({
  offset: z.number().nonnegative(),
  take: z.number().nonnegative(),
});

export { OffsetPaginationValidation };
