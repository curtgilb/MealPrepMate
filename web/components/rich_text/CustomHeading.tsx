// https://github.com/ueberdosis/tiptap/issues/1514

import BaseHeading from "@tiptap/extension-heading";
import { mergeAttributes } from "@tiptap/core";

type Levels = 3 | 4 | 5;

const classes: Record<Levels, string> = {
  3: "text-xl font-bold font-serif",
  4: "text-lg font-semibold font-serif",
  5: "text-base font-medium font-serif",
};

export const CustomHeading = BaseHeading.configure({
  levels: [3, 4, 5],
}).extend({
  renderHTML({ node, HTMLAttributes }) {
    const hasLevel = this.options.levels.includes(node.attrs.level);
    const level: Levels = hasLevel ? node.attrs.level : this.options.levels[0];

    return [
      `h${level}`,
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: `${classes[level]}`,
      }),
      0,
    ];
  },
});
