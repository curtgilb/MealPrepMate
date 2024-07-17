import React from "react";

export default function SingleColumnCentered({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex p-8 justify-center w-full overflow-y-scroll">
      <div className="max-w-screen-2xl w-full">{children}</div>
    </div>
  );
}
