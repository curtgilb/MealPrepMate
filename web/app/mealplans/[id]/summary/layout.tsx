import SingleColumnCentered from "@/components/layouts/single-column-centered";

export default function NutritionSummary({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SingleColumnCentered>{children}</SingleColumnCentered>;
}
