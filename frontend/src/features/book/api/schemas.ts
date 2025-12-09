import { z } from "zod";

export const createBookFormSchema = z.object({
  language_id: z.int().positive("A language must be selected"),
  title: z
    .string()
    .min(1, "Title must be at least 1 character long")
    .max(255, "Title cannot be longer than 255 characters"),
  text: z.string().min(1, "Text content must be at least 1 character long"),
  importurl: z.url().or(z.literal("")),
  text_file: z
    .file()
    .mime(
      [
        "application/pdf",
        "text/plain",
        "application/epub+zip",
        "application/x-subrip",
        "text/vtt",
      ],
      "Valid file formats are: txt, epub, pdf, srt, vtt"
    )
    .nullable(),
  audio_file: z
    .file()
    .mime(
      [
        "audio/mpeg",
        "audio/mp4",
        "audio/wav",
        "audio/ogg",
        "audio/opus",
        "audio/aac",
        "audio/flac",
        "audio/webm",
      ],
      "Valid file formats are: mp3, m4a, wav, ogg, opus, aac, flac, webm"
    )
    .nullable(),
  threshold_page_tokens: z
    .number()
    .min(1, "There has to be at least 1 word per page")
    .max(1500, "Can't add more than 1500 words per page"),
  split_by: z.enum(["paragraphs", "sentences"]),
  source_uri: z.url().max(1000).or(z.literal("")),
  book_tags: z.array(z.string()),
});
