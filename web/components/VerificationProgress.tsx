import { Progress } from "@/components/ui/progress";

interface VerificationProgressProps {
  totalSteps: number;
  stepsCompleted: number;
}

export function VerificationProgress({
  totalSteps,
  stepsCompleted,
}: VerificationProgressProps) {
  return (
    <div>
      <Progress className="h-2" value={(stepsCompleted / totalSteps) * 100} />
      <p className="text-xs font-light text-right">
        Verified {stepsCompleted ?? 0} of {totalSteps ?? 0}
      </p>
    </div>
  );
}
