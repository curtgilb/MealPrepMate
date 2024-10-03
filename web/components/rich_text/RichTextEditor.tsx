"use client";

import { RichTextEditorMenuBar } from "@/components/rich_text/RichTextEditorMenuBar";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { CustomHeading } from "@/components/rich_text/CustomHeading";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Document from "@tiptap/extension-document";
import OrderedList from "@tiptap/extension-ordered-list";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";

interface RichTextEditorProps {
  value: string | undefined;
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
        class: "focus-visible:outline-none text-sm",
      },
    },
    editable,
    extensions: [
      Bold,
      Italic.configure({
        HTMLAttributes: {
          class: "my-custom-class",
        },
      }),
      CustomHeading,
      BulletList.configure({
        HTMLAttributes: {
          class: "list-disc pl-4",
        },
      }),
      ListItem,
      Paragraph,
      OrderedList.configure({
        HTMLAttributes: {
          class: "list-decimal pl-4",
        },
      }),
      Text,
      Document,
      Underline.configure({
        HTMLAttributes: {
          class: "underline",
        },
      }),
    ],
    immediatelyRender: false,
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (editable) {
    return (
      editor && (
        <div className="border rounded-md focus-within:ring-2 ring-offset-2 ring-ring min-h-[30rem]">
          <RichTextEditorMenuBar editor={editor} />
          <EditorContent className="px-4 py-3" editor={editor} />
        </div>
      )
    );
  } else {
    return <EditorContent className="px-4 py-3" editor={editor} />;
  }
}
