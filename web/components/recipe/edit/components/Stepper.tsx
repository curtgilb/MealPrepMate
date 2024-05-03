import { Button } from "@/components/ui/button";

interface StepperProps {
  onNext: () => void;
  onPrev: () => void;
  max: number;
  curr: number;
}

export function Stepper({ onNext, onPrev, max, curr }: StepperProps) {
  return (
    <div className="flex gap-4">
      <Button variant="outline" onClick={onPrev} disabled={curr === 0}>
        Back
      </Button>
      <Button onClick={onNext}>
        {curr === max - 1 ? "Finish" : "Save and continue"}
      </Button>
    </div>
  );
}
