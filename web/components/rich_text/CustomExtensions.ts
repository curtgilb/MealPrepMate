import { CustomHeading } from "@/components/rich_text/CustomHeading";
import Bold from "@tiptap/extension-bold";
import BulletList from "@tiptap/extension-bullet-list";
import Document from "@tiptap/extension-document";
import Italic from "@tiptap/extension-italic";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Underline from "@tiptap/extension-underline";

export const editorExtensions = [
  Bold,
  Italic.configure({
    HTMLAttributes: {
      class: "italic",
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
  Text.configure({
    HTMLAttributes: {
      class: "text-base font-light",
    },
  }),
  Document,
  Underline.configure({
    HTMLAttributes: {
      class: "underline",
    },
  }),
];
