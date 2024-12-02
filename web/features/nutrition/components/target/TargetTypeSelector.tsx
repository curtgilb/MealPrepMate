import { TargetPreference } from "@/gql/graphql";
import { Dispatch, SetStateAction } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TargetTypeSelectorProps {
  value: TargetPreference;
  onChange: Dispatch<SetStateAction<TargetPreference>>;
}

export function TargetTypeSelector({
  value,
  onChange,
}: TargetTypeSelectorProps) {
  return (

  );
}
