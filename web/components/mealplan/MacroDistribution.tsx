interface MacroDistributionProps {
  protien: number;
  protienTarget: number;
  carbs: number;
  carbsTarget: number;
  fat: number;
  fatTarget: number;
}

export default function MacroDistribution(props: MacroDistributionProps) {
  return (
    <div>
      <p className="font-semibold">Macros</p>
      <div className="grid grid-cols-3 justify-between">
        <div className="flex flex-col items-start">
          <p className="font-semibold">28%</p>
          <p>Protein</p>
        </div>
        <div className="flex flex-col items-center">
          <p>50%</p>
          <p>Carbs</p>
        </div>
        <div className="flex flex-col items-end">
          <p>12%</p>
          <p>Fat</p>
        </div>
      </div>
    </div>
  );
}
