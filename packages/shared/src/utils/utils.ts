import { z, ZodError } from "zod";

export const prettifyError = (error: ZodError) => z.prettifyError(error);
