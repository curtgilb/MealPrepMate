const vulgarFractions: { [key: string]: string } = {
  "&frac14;": "0.25",
  "&frac12;": "0.5",
  "&frac34;": "0.75",
  "&frac13;": "0.333",
  "&frac23;": "0.667",
  "&frac15;": "0.2",
  "&frac25;": "0.4",
  "&frac35;": "0.6",
  "&frac45;": "0.8",
  "&frac16;": "0.167",
  "&frac56;": "0.833",
  "&frac18;": "0.125",
  "&frac38;": "0.375",
  "&frac58;": "0.625",
  "&frac78;": "0.875",
};

export function replaceVulgarFractions(text: string) {
  const regex = /(?<integer>\d+)?\s*(?<decimal>&frac\d+;)/g;
  const matches = text.matchAll(regex);

  if (matches) {
    for (const match of matches) {
      const wholeNumber = match.groups?.integer
        ? parseInt(match.groups.integer)
        : 0;
      const decimal = match.groups?.decimal
        ? parseFloat(vulgarFractions[match.groups.decimal])
        : 0;
      const total = (wholeNumber + decimal).toString();
      const originalMatch = match[0].trim();

      text = text.replace(originalMatch, total);
    }
  }

  return text;
}

// Replace all digits/fractions into a html vulgar fraction
