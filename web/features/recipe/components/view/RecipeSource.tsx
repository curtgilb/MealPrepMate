import Link from "next/link";

interface RecipeSourceProps {
  source: string | null | undefined;
}

function extractDomain(url: string) {
  // Remove protocol (http, https, ftp, etc.) and www if present
  let domain = url.replace(/^(https?:\/\/)?(www\.)?/, "");

  // Remove path, query parameters, and hash
  domain = domain.split("/")[0];

  // Remove port number if present
  domain = domain.split(":")[0];

  return domain;
}

export function RecipeSourceProps({ source }: RecipeSourceProps) {
  if (!source) return null;
  const isHyperlink = source.startsWith("http");
  const displayText = isHyperlink ? extractDomain(source) : source;

  if (isHyperlink) {
    return <Link href={source}>{displayText}</Link>;
  } else {
    return source;
  }
}
