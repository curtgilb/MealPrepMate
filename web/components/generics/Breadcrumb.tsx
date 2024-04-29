import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbProps {
  path: { name: string; link: string }[];
}

export function BreadcrumbPath({ path }: BreadcrumbProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {path.map((param, index) => {
          const isLast = path.length === index + 1;
          return (
            <div key={param.name}>
              <BreadcrumbItem>
                {!isLast ? (
                  <BreadcrumbLink href={param.link}>
                    {param.name}
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{param.name}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
