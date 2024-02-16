import z from "zod";

export const VALIDATION_SCHEMA_TOPICS = z.object({
  name: z
    .string({ required_error: "Topic name must be provided!" })
    .min(3, "Topic name too short!")
    .max(32, "Topic name too long!")
    .regex(/^[A-Za-z0-9 ]*$/gi, { message: "No special characters allowed!" }),
});

export const VALIDATION_SCHEMA_TOPICS_BULK_DELETE = z.object({
  ids: z.number().array().min(1, "No topics selected!"),
});
