import SingleColumnCentered from "@/components/layouts/single-column-centered";

export default function RecipeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SingleColumnCentered condensed>{children}</SingleColumnCentered>;
}
