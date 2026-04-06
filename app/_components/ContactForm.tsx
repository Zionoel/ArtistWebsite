"use client";

import { useState, useEffect, useRef } from "react";
import Script from "next/script";

type Translations = Record<string, string>;

declare global {
  interface Window {
    turnstile?: {
      render:  (container: HTMLElement, options: { sitekey: string; theme?: string }) => string;
      remove:  (widgetId: string) => void;
      reset:   (widgetId?: string) => void;
    };
  }
}

const inputClass =
  "w-full border border-white/20 bg-transparent px-3 py-2 text-sm rounded focus:outline-none focus:border-white transition-colors placeholder:text-white/30";

export default function ContactForm({ t, siteKey }: { t: Translations; siteKey: string }) {
  const [subject, setSubject] = useState("");
  const [displayRights, setDisplayRights] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef  = useRef<string | null>(null);

  const showBudget = subject === "commission" || subject === "commercial";

  // Render the Turnstile widget explicitly.
  // On first page-load the Script onLoad callback handles it.
  // On SPA navigation the script is already present, so useEffect handles it.
  useEffect(() => {
    if (!siteKey) return;

    const render = () => {
      if (containerRef.current && window.turnstile && !widgetIdRef.current) {
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme:   "dark",
        });
      }
    };

    if (window.turnstile) render();

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [siteKey]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const data = {
      name:           (form.elements.namedItem("name") as HTMLInputElement).value,
      companyName:    (form.elements.namedItem("companyName") as HTMLInputElement).value,
      email:          (form.elements.namedItem("email") as HTMLInputElement).value,
      phone:          (form.elements.namedItem("phone") as HTMLInputElement).value,
      subject,
      budget:         showBudget ? (form.elements.namedItem("budget") as HTMLInputElement).value : "",
      dueDate:        (form.elements.namedItem("dueDate") as HTMLInputElement).value,
      displayRights,
      message:        (form.elements.namedItem("message") as HTMLTextAreaElement).value,
      turnstileToken: (form.elements.namedItem("cf-turnstile-response") as HTMLInputElement)?.value ?? "",
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
        if (widgetIdRef.current) window.turnstile?.reset(widgetIdRef.current);
      }
    } catch {
      setStatus("error");
      if (widgetIdRef.current) window.turnstile?.reset(widgetIdRef.current);
    }
  }

  if (status === "success") {
    return (
      <p className="text-sm text-white/70 py-8">{t.successMessage}</p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Name */}
      <div>
        <label className="block text-sm mb-1">{t.name}</label>
        <input required name="name" type="text" className={inputClass} placeholder={t.namePlaceholder} />
      </div>

      {/* Company */}
      <div>
        <label className="block text-sm mb-1">
          {t.companyName}
          <span className="text-white/30 text-xs ml-2">({t.optional})</span>
        </label>
        <input name="companyName" type="text" className={inputClass} placeholder={t.companyNamePlaceholder} />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm mb-1">{t.email}</label>
        <input required name="email" type="email" className={inputClass} placeholder={t.emailPlaceholder} />
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm mb-1">{t.phone}</label>
        <input name="phone" type="tel" className={inputClass} placeholder={t.phonePlaceholder} />
        {t.phoneHint && (
          <p className="text-xs text-white/30 mt-1">{t.phoneHint}</p>
        )}
      </div>

      {/* Subject */}
      <div>
        <label className="block text-sm mb-1">{t.subject}</label>
        <select
          required
          name="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className={`${inputClass} bg-black [&>option]:bg-black`}
        >
          <option value="">{t.subjectDefault}</option>
          <option value="commission">{t.subjectCommission}</option>
          <option value="commercial">{t.subjectCommercial}</option>
          <option value="other">{t.subjectOther}</option>
        </select>
      </div>

      {/* Budget — only for commission or commercial */}
      {showBudget && (
        <div>
          <label className="block text-sm mb-1">
            {t.budget}
            <span className="text-white/30 text-xs ml-2">({t.optional})</span>
          </label>
          <input name="budget" type="text" className={inputClass} placeholder={t.budgetPlaceholder} />
        </div>
      )}

      {/* Due Date */}
      <div>
        <label className="block text-sm mb-1">{t.dueDate}</label>
        <input name="dueDate" type="date" className={`${inputClass} color-scheme-dark`} />
      </div>

      {/* Display Rights */}
      <div className="flex items-start gap-3 py-1">
        <input
          id="displayRights"
          type="checkbox"
          checked={displayRights}
          onChange={(e) => setDisplayRights(e.target.checked)}
          className="mt-0.5 accent-white"
        />
        <label htmlFor="displayRights" className="text-sm text-white/70 leading-snug cursor-pointer">
          <span className="text-white font-medium">{t.displayRights} — </span>
          {t.displayRightsLabel}
        </label>
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm mb-1">{t.message}</label>
        <textarea required name="message" rows={5} className={inputClass} placeholder={t.messagePlaceholder} />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-400">{t.errorMessage}</p>
      )}

      {/* Turnstile widget — explicit rendering via useEffect / onLoad */}
      <div ref={containerRef} />
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={() => {
          if (containerRef.current && window.turnstile && !widgetIdRef.current) {
            widgetIdRef.current = window.turnstile.render(containerRef.current, {
              sitekey: siteKey,
              theme:   "dark",
            });
          }
        }}
      />

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full bg-white text-black py-2 text-sm rounded hover:bg-white/90 transition-colors disabled:opacity-50"
      >
        {status === "sending" ? t.sending : t.send}
      </button>

    </form>
  );
}
