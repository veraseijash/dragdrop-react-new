import { Editor } from "@tinymce/tinymce-react";

export default function EditorInline({ html, onChange, style }) {
  return (
    <Editor
      inline
      value={html}
      tagName="div"
      onEditorChange={onChange}
      init={{
        menubar: false,
        toolbar: false,

        plugins: [
          "link",
          "lists",
          "emoticons",
          "nonbreaking",
          "textcolor",
          "autolink",
        ],

        context_toolbar:
          "bold italic underline strikethrough | forecolor backcolor | superscript subscript | emoticons nonbreaking | removeformat | link unlink | mergetags",

        content_style: `
          body {
            margin: 0;
            padding: 0;
            font-family: inherit;
          }
        `,
      }}
      style={style}
    />
  );
}
