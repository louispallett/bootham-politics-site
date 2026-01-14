import { z } from "zod";

export const MAX_FILE_SIZE = 15 * 1024 * 1024;

export const ALLOWED_BANNER_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/tif",
  "image/png",
  "image/webp",
  "image/gif",
];

export const ALLOWED_FORMATS = [
  "jpeg",
  "jpg",
  "tif",
  "tiff",
  "png",
  "webp",
  "gif",
];

export const PostValidationSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "Title: Required" })
    .max(200, { message: "Title: Max length 200 characters" }),
  synopsis: z
    .string()
    .trim()
    .min(1, { message: "Synopsis: Required" })
    .max(1000, { message: "Synopsis: Max characters 1000" }),
  content: z
    .string()
    .min(7, { message: "Content: Required" })
    .max(100000, { message: "Content: Max 100000 characters" }),
  tags: z
    .array(z.string().regex(/^[a-f\d]{24}$/i, "Invalid tag ID"))
    .optional(),
  banner: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: "Banner must be smaller than 15MB",
    })
    .refine((file) => ALLOWED_BANNER_MIME_TYPES.includes(file.type), {
      message: "Invalid banner image type",
    })
    .optional(),
  bannerCaption: z
    .string()
    .max(1000, { message: "Banner Caption: Max 1000 characters" })
    .optional(),
});
