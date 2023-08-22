import { Button } from "@/components/ui/button";
import { InputWithLabel } from "@/components/InputWithLabel";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <InputWithLabel />
      <Button>Click me</Button>
    </main>
  );
}
