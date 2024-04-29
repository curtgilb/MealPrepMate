import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

export function SmallCard({
  imageUrl,
  loading,
}: {
  imageUrl: string;
  loading: boolean;
}) {
  return (
    <div className="border rounded flex">
      <div className="w-[4.5rem]">
        {loading ? (
          <Skeleton className="h-full w-full" />
        ) : (
          <Image
            src="/placeholder.jpg"
            alt="placeholder"
            style={{
              width: "100%",
              height: "auto",
            }}
            width={72}
            height={72}
          ></Image>
        )}
      </div>

      <div className="py-4 px-4">
        {loading ? (
          <>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-4 w-16" />
          </>
        ) : (
          <p>Chicken Gyro</p>
        )}
      </div>
    </div>
  );
}
