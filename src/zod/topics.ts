import z from "zod";

export const VALIDATION_SCHEMA_TOPICS = z.object({
  name: z
    .string({ required_error: "Topic name must be provided!" })
    .min(3, "Topic name too short!")
    .max(32, "Topic name too long!"),
});
