interface FieldsetProps {
  name: string;
  children: React.ReactNode;
}
export function Fieldset({ name, children }: FieldsetProps) {
  return (
    <fieldset className="grid gap-6 rounded-lg border p-4 bg-card">
      <legend className="-ml-1 px-1 font-bold uppercase">{name}</legend>
      {children}
    </fieldset>
  );
}
