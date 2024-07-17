export function toTitleCase(str: string | null | undefined) {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(" ")
    .map(function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

export function isNumeric(str: string) {
  if (typeof str != "string") return false; // we only process strings!
  return (
    !isNaN(str as unknown as number) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
}

export function getImageUrl(path: string) {
  return `http://localhost:9000/${path}`;
}

// type NestedKeyOf<T> = {
//   [K in keyof T & (string | number)]: T[K] extends object
//     ? `${K}` | `${K}.${NestedKeyOf<T[K]>}`
//     : `${K}`;
// }[keyof T & (string | number)];

// function getValueByPath<T>(obj: T, path: string): any {
//   return path.split(".").reduce((acc, part) => acc && (acc as any)[part], obj);
// }

// function groupList<T>(list: T[], groupKey: NestedKeyOf<T>): Map<string, T[]> {
//   return list.reduce((acc, item) => {
//     const key = String(getValueByPath(item, groupKey));
//     if (!acc.has(key)) {
//       acc.set(key, []);
//     }
//     acc.get(key)!.push(item);
//     return acc;
//   }, new Map<string, T[]>());
// }
