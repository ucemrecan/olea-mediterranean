import { Button } from "@/components/Button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-5 py-32 text-center">
      <p className="text-5xl">🫒</p>
      <h1 className="mt-6 text-4xl text-ink">This table isn&apos;t set</h1>
      <p className="mt-4 leading-relaxed text-ink-soft">
        The page you were looking for doesn&apos;t exist — but the kitchen is
        still open.
      </p>
      <div className="mt-8 flex gap-3">
        <Button href="/">Back home</Button>
        <Button href="/menu" variant="outline">
          See the menu
        </Button>
      </div>
    </div>
  );
}
