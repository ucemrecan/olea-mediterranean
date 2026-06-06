"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { cn } from "@/lib/cn";

type Status = "idle" | "submitting" | "success";

/**
 * Mock reservation form. It validates and simulates a request so the flow can
 * be demonstrated end to end; wiring it to the real API is a one-function swap.
 */
export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({
    name: "",
    email: "",
    guests: "2 guests",
    message: "",
  });

  function update(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("submitting");
    // Simulate a network round-trip against the future reservations endpoint.
    await new Promise((resolve) => setTimeout(resolve, 700));
    setStatus("success");
  }

  if (status === "success") {
    return (
      <div className="rounded-card bg-olive/10 p-8 text-center ring-1 ring-olive/20">
        <p className="text-2xl">🫒</p>
        <h3 className="mt-3 text-xl text-ink">Thanks, {form.name || "friend"}!</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Your request for {form.guests} reached our team. We&apos;ll confirm by
          email shortly. (This is a demo — no message was actually sent.)
        </p>
        <div className="mt-6">
          <Button
            variant="outline"
            onClick={() => {
              setStatus("idle");
              setForm({ name: "", email: "", guests: "2 guests", message: "" });
            }}
          >
            Send another
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name">
          <input
            required
            type="text"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className={inputClass}
            placeholder="Your name"
          />
        </Field>
        <Field label="Email">
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className={inputClass}
            placeholder="you@example.com"
          />
        </Field>
      </div>

      <Field label="Guests">
        <select
          value={form.guests}
          onChange={(e) => update("guests", e.target.value)}
          className={cn(inputClass, "cursor-pointer")}
        >
          {["1", "2", "3", "4", "5", "6", "7+"].map((n) => (
            <option key={n} value={`${n} ${n === "1" ? "guest" : "guests"}`}>
              {n} {n === "1" ? "guest" : "guests"}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Anything we should know?">
        <textarea
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          rows={4}
          className={cn(inputClass, "resize-none")}
          placeholder="Date, time, allergies, a special occasion…"
        />
      </Field>

      <Button type="submit" className="w-full sm:w-auto">
        {status === "submitting" ? "Sending…" : "Request a table"}
      </Button>
    </form>
  );
}

const inputClass =
  "w-full rounded-lg border border-ink/15 bg-white px-4 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/60 focus:border-olive focus:ring-2 focus:ring-olive/20";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      {children}
    </label>
  );
}
