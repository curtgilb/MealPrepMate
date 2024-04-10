import React from "react";

export default function SingleColumnCentered({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex p-8 justify-center w-full">{children}</div>;
}
