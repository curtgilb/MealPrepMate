import { Bold, Italic, List, ListOrdered, Underline } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Editor } from "@tiptap/react";

export function RichTextEditorMenuBar({ editor }: { editor: Editor }) {
  function getCurrentHeadingValue(): string {
    if (editor.isActive("heading", { level: 3 })) return "1";
    if (editor.isActive("heading", { level: 4 })) return "2";
    if (editor.isActive("heading", { level: 5 })) return "3";
    return "text";
  }

  function handleHeadingChange(newValue: String) {
    switch (newValue) {
      case "1":
        editor.chain().focus().toggleHeading({ level: 3 }).run();
        break;
      case "2":
        editor.chain().focus().toggleHeading({ level: 4 }).run();
        break;
      case "3":
        editor.chain().focus().toggleHeading({ level: 5 }).run();
        break;
      default:
        editor.chain().focus().setParagraph().run();
    }
  }

  return (
    <div className="flex gap-8 px-3 py-1.5 border-b items-center">
      <Select
        value={getCurrentHeadingValue()}
        onValueChange={handleHeadingChange}
      >
        <SelectTrigger className="h-8 w-[140px]  m-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="text">Text</SelectItem>
          <SelectItem value="1">Heading 1</SelectItem>
          <SelectItem value="2">Heading 2</SelectItem>
          <SelectItem value="3">Heading 3</SelectItem>
        </SelectContent>
      </Select>

      <div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive("bold")}
                onPressedChange={() =>
                  editor.chain().focus().toggleBold().run()
                }
              >
                <Bold className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Bold</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive("italic")}
                onPressedChange={() =>
                  editor.chain().focus().toggleItalic().run()
                }
              >
                <Italic className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Italic</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive("underline")}
                onPressedChange={() =>
                  editor.chain().focus().toggleUnderline().run()
                }
              >
                <Underline className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Underline</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                onPressedChange={() => {
                  editor.chain().focus().toggleOrderedList().run();
                }}
                pressed={editor.isActive("orderedList")}
              >
                <ListOrdered className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Numbers</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                onPressedChange={() =>
                  editor.chain().focus().toggleBulletList().run()
                }
                pressed={editor.isActive("bulletList")}
              >
                <List className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Bullets</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
