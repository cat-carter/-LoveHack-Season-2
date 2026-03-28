import { Children, cloneElement, isValidElement } from "react";

export const inputCls = "w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white";
export const selectCls = inputCls;
export const textareaCls = `${inputCls} resize-none`;

export function StepIndicator({ current, total, steps }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors
            ${i < current ? "bg-teal-600 text-white" : i === current ? "bg-teal-600 text-white ring-4 ring-teal-100" : "bg-slate-100 text-slate-400"}`}>
            {i < current ? "✓" : i + 1}
          </div>
          {i < total - 1 && <div className={`flex-1 h-0.5 w-8 ${i < current ? "bg-teal-600" : "bg-slate-200"}`} />}
        </div>
      ))}
      {steps && <span className="ml-2 text-xs text-slate-500 font-medium">{steps[current]}</span>}
    </div>
  );
}

export function FormField({ label, required, children, hint }) {
  const childWithAria = required
    ? Children.map(children, (child) =>
        isValidElement(child) ? cloneElement(child, { "aria-required": "true" }) : child
      )
    : children;
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label} {required && <span className="text-rose-400" aria-hidden="true">*</span>}
        {required && <span className="sr-only">(required)</span>}
      </label>
      {childWithAria}
      {hint && <p className="text-xs text-slate-500 mt-1">{hint}</p>}
    </div>
  );
}
