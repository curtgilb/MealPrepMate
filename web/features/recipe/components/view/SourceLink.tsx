import Link from "next/link";

interface SourceLinkProps {
  source: string | undefined | null;
}

export function SourceLink({ source }: SourceLinkProps) {
  try {
    const url = new URL(source ?? "");

    if ((url.protocol === "http:" || url.protocol === "https:") && source) {
      return (
        <Link className="hover:underline" href={source}>
          {url.hostname}
        </Link>
      );
    }
  } catch (error) {}
  return <p>{source}</p>;
}
