import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().trim().min(1, "Name is Required"),
  image: z
    .union([z.instanceof(File), z.string(), z.null()])
    .optional()
    .nullable()
    .refine(
      (value) =>
        value === null ||
        value === undefined ||
        value instanceof File ||
        typeof value === "string",
      {
        message: "Image must be a File or link"
      }
    ),
  workspaceId: z.string()
});

export const updateProjectSchema = z.object({
  name: z.string().trim().min(1, "Name required").optional(),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value))
    ])
    .optional()
   
});
