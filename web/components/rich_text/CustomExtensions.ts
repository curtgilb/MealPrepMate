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

export const editorExtensions = [
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
];
