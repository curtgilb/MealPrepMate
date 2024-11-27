import { useParams } from "next/navigation";

export function useIdParam() {
  const params = useParams<{ id: string }>();
  return decodeURIComponent(params.id);
}
