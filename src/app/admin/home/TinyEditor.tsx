"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Editor = dynamic(
  () => import("@tinymce/tinymce-react").then((mod) => mod.Editor),
  {
    ssr: false,
  },
);

type TinyEditorProps = {
  editorRef: any;
  data?: string;
};

export default function TinyEditor({ editorRef, data }: TinyEditorProps) {
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
  }, []);

  return (
    <Editor
      apiKey={"uz9hicuo2wtpqyj182f5q7c0g2kb7c2eaq3zcxai7g7n8xja"}
      onInit={(_evt, editor) => (editorRef.current = editor)}
      initialValue={
        data
          ? data
          : "<h1>Heading 1</h1><h2>Heading 2</h2><h3>Subheading 1</h3><h4>Subheading 2</h4><p>Standard paragraph...</p><p>List of things:</p><ul><li>Thing 1</li><li>Thing 2</li>"
      }
      init={{
        skin: isDark ? "oxide-dark" : "oxide",
        content_css: isDark ? "dark" : "",
        height: 500,
        menubar: false,
        plugins: [
          "advlist",
          "autolink",
          "lists",
          "link",
          "image",
          "charmap",
          "preview",
          "anchor",
          "searchreplace",
          "visualblocks",
          "code",
          "fullscreen",
          "insertdatetime",
          "media",
          "table",
          "code",
          "help",
          "wordcount",
        ],
        toolbar:
          "undo redo | blocks | " +
          "bold italic forecolor | alignleft aligncenter " +
          "alignright alignjustify | bullist numlist outdent indent | " +
          "removeformat | help",
        content_style:
          "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
      }}
    />
  );
}
