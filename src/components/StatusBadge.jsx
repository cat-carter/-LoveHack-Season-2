const colorMap = {
  Reviewed: "bg-teal-100 text-teal-800",
  Pending: "bg-amber-100 text-amber-800",
  Completed: "bg-teal-100 text-teal-800",
  None: "bg-slate-100 text-slate-600",
  "Not Recordable": "bg-slate-100 text-slate-500",
  Open: "bg-blue-100 text-blue-800",
  Closed: "bg-slate-100 text-slate-600",
  "At Work": "bg-teal-100 text-teal-800",
  "On Leave": "bg-rose-100 text-rose-800",
};

export default function StatusBadge({ status }) {
  const color = colorMap[status] || "bg-slate-100 text-slate-600";
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {status}
    </span>
  );
}
