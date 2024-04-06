import Image from "next/image";
export default function RecipeCard({
  name,
  servings,
  calories,
}: {
  name: string;
  servings: number;
  calories: number;
}) {
  return (
    <div className="border rounded overflow-hidden">
      <Image
        src="/pancakes.jpg"
        style={{
          width: "100%",
          objectFit: "fill",
        }}
        alt="recipe image"
        width={200}
        height={200}
      />
      <div className="p-4">
        <p className="text-lg font-semibold mb-4 leading-tight min-h-12">
          {name}
        </p>
        <p className="font-light">{servings} servings</p>
        <p className="font-thin text-sm">{calories} calories per serving</p>
      </div>
    </div>
  );
}
