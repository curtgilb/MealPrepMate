"use client";
import { editorExtensions } from "@/components/rich_text/CustomExtensions";
import { RichTextEditorMenuBar } from "@/components/rich_text/RichTextEditorMenuBar";
import { EditorContent, useEditor } from "@tiptap/react";

interface RichTextEditorProps {
  value: string | undefined | null;
  editable: boolean;
  onChange: (value: string) => void;
}

export function RichTextEditor({
  value,
  onChange,
  editable,
}: RichTextEditorProps) {
  const editor = useEditor({
    editorProps: {
      attributes: {
        class: "focus-visible:outline-none",
      },
    },
    editable,
    extensions: editorExtensions,
    immediatelyRender: false,
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (editable) {
    return (
      editor && (
        <div
          className={
            "border rounded-md focus-within:ring-2 ring-offset-2 ring-ring"
          }
        >
          <RichTextEditorMenuBar editor={editor} />
          <EditorContent className="px-4 py-3 min-h-56" editor={editor} />
        </div>
      )
    );
  } else {
    return (
      <EditorContent
        className="text-base leading-relaxed max-w-prose"
        editor={editor}
      />
    );
  }
}
