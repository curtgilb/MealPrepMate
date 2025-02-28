import { cn } from "@/lib/utils";
import DOMPurify from "isomorphic-dompurify";
import { FC, memo } from "react";

interface RichTextContentProps {
  content: string;
  className?: string;
}

export const RichTextContent: FC<RichTextContentProps> = memo(
  ({ content, className = "" }) => {
    // Configure DOMPurify to allow specific HTML elements and attributes
    // that TipTap commonly uses
    const sanitizerConfig = {
      ALLOWED_TAGS: [
        "p",
        "br",
        "strong",
        "em",
        "u",
        "s",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "ul",
        "ol",
        "li",
        "a",
        "blockquote",
        "code",
        "pre",
      ],
      ALLOWED_ATTR: ["href", "target", "rel", "class"],
    };

    // Sanitize the HTML content
    const sanitizedContent = DOMPurify.sanitize(content, sanitizerConfig);

    return (
      <div
        className={cn("[&>p]:mb-4", className)}
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
    );
  }
);

RichTextContent.displayName = "RichTextContent";
