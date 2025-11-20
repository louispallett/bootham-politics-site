export const ALLOWED_MIME_TYPES = [
  // PDF
  "application/pdf",

  // MS Word
  "application/msword", // .doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx

  // MS Excel
  "application/vnd.ms-excel", // .xls
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx

  // MS PowerPoint
  "application/vnd.ms-powerpoint", // .ppt
  "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx

  // OpenDocument (LibreOffice / OpenOffice)
  "application/vnd.oasis.opendocument.text", // .odt
  "application/vnd.oasis.opendocument.spreadsheet", // .ods
  "application/vnd.oasis.opendocument.presentation", // .odp

  // Apple iWork formats
  "application/vnd.apple.pages", // Pages
  "application/vnd.apple.numbers", // Numbers
  "application/vnd.apple.keynote", // Keynote
];

export const MAX_FILE_SIZE_BYTES = 10_000_000; // 10 MB

// --------------------------------------
// ALLOWED FILE EXTENSIONS
// --------------------------------------
export const ALLOWED_EXTENSIONS = [
  "pdf",

  // Word
  "doc",
  "docx",

  // Excel
  "xls",
  "xlsx",

  // PowerPoint
  "ppt",
  "pptx",

  // OpenDocument
  "odt",
  "ods",
  "odp",

  // iWork
  "pages",
  "numbers",
  "key",
];
