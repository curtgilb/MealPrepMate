import { ComponentPropsWithRef, useState } from "react";

import { ProgramticModalDrawer } from "@/components/ModalDrawerProgramatic";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EditNutrientTarget } from "@/features/nutrition/components/target/EditNutrientTarget";
import { NutritionTargetContext } from "@/features/nutrition/components/target/NutrientTargetContext";
import { NutrientTableSection } from "@/features/nutrition/components/target/NutritionTargetTable";
import {
  NutrientWithChildren,
  NutritionDisplayMode,
  useNutrients,
} from "@/hooks/use-nutrients";

interface NutritionConfigurationProps extends ComponentPropsWithRef<"div"> {}

export function NutritionTargets(props: NutritionConfigurationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingNutrient, setEditingNutrient] =
    useState<NutrientWithChildren | null>(null);
  const [advanced, setAdvanced] = useState<boolean>(false);
  const nutrients = useNutrients(
    advanced ? NutritionDisplayMode.All : NutritionDisplayMode.Basic
  );

  return (
    <div {...props}>
      <NutritionTargetContext.Provider
        value={{ setIsOpen, setEditingNutrient }}
      >
        <div className="flex items-center space-x-2">
          <Switch
            id="advanced"
            checked={advanced}
            onCheckedChange={setAdvanced}
          />
          <Label htmlFor="advanced">Advanced View</Label>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="hover:!bg-transparent">
              <TableHead>Name</TableHead>
              <TableHead>DRI</TableHead>
              <TableHead>Upper Limit</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Target Margin</TableHead>
              <TableHead>Custom Target</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {nutrients &&
              Object.entries(nutrients).map(([category, nutrients]) => {
                return (
                  <NutrientTableSection
                    key={category}
                    category={category}
                    nutrients={nutrients}
                  />
                );
              })}
          </TableBody>
        </Table>

        <ProgramticModalDrawer
          open={isOpen}
          setOpen={setIsOpen}
          title={`Edit ${editingNutrient?.name ?? ""}`}
          description="Set a custom target for this nutrient"
          content={
            editingNutrient ? (
              <EditNutrientTarget
                nutrient={editingNutrient}
                setOpen={setIsOpen}
              />
            ) : null
          }
        />
      </NutritionTargetContext.Provider>
    </div>
  );
}
