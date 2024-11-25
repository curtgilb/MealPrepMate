"use client";
import { editorExtensions } from "@/components/rich_text/CustomExtensions";
import { RichTextEditorMenuBar } from "@/components/rich_text/RichTextEditorMenuBar";
import { cn } from "@/lib/utils";
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
        class: cn("focus-visible:outline-none min-h-56", {
          "px-4 py-3": editable,
        }),
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
          <EditorContent editor={editor} />
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
