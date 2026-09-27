import { useState, type FormEvent } from "react";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

type FormState = {
  name: string;
  email: string;
  message: string;
};

type Status = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const [form, setForm] = useState<FormState>({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Partial<FormState>>({});

  const validate = (): boolean => {
    const e: Partial<FormState> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email address";
    if (!form.message.trim()) e.message = "Message is required";
    else if (form.message.trim().length < 10) e.message = "Message must be at least 10 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 5000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  const fieldClass = (field: keyof FormState) =>
    `w-full px-4 py-3 rounded-xl bg-white/60 dark:bg-white/5 border ${
      errors[field]
        ? "border-error-500"
        : "border-gray-200/80 dark:border-white/10"
    } focus:border-primary-500 dark:focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <input
            type="text"
            placeholder="Your name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={fieldClass("name")}
          />
          {errors.name && (
            <p className="mt-1.5 text-sm text-error-500 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.name}
            </p>
          )}
        </div>
        <div>
          <input
            type="email"
            placeholder="your@email.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={fieldClass("email")}
          />
          {errors.email && (
            <p className="mt-1.5 text-sm text-error-500 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.email}
            </p>
          )}
        </div>
      </div>
      <div>
        <textarea
          placeholder="Tell me about your project or just say hi..."
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          rows={5}
          className={`${fieldClass("message")} resize-none`}
        />
        {errors.message && (
          <p className="mt-1.5 text-sm text-error-500 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> {errors.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "loading" ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : status === "success" ? (
          <CheckCircle2 className="w-5 h-5" />
        ) : (
          <Send className="w-5 h-5" />
        )}
        {status === "loading" ? "Sending..." : status === "success" ? "Sent!" : "Send Message"}
      </button>

      {status === "success" && (
        <p className="text-sm text-success-600 flex items-center gap-1.5 animate-fade-in">
          <CheckCircle2 className="w-4 h-4" />
          Thanks for reaching out! I'll get back to you soon.
        </p>
      )}
      {status === "error" && (
        <p className="text-sm text-error-500 flex items-center gap-1.5 animate-fade-in">
          <AlertCircle className="w-4 h-4" />
          Something went wrong. Please try again or email me directly.
        </p>
      )}
    </form>
  );
}
