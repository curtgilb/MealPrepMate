import SingleColumnCentered from "@/components/layouts/single-column-centered";

export default function CreateRecipeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SingleColumnCentered>{children}</SingleColumnCentered>;
}
