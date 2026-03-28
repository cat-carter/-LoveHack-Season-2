import {
  CheckCircle2, Clock, XCircle, AlertCircle, Minus,
  UserCheck, UserX,
} from "lucide-react";

const statusMap = {
  Reviewed:         { color: "bg-teal-100 text-teal-800",  Icon: CheckCircle2 },
  Completed:        { color: "bg-teal-100 text-teal-800",  Icon: CheckCircle2 },
  "At Work":        { color: "bg-teal-100 text-teal-800",  Icon: UserCheck    },
  Pending:          { color: "bg-amber-100 text-amber-800", Icon: Clock        },
  "In Review":      { color: "bg-blue-100 text-blue-800",  Icon: Clock        },
  Open:             { color: "bg-blue-100 text-blue-800",  Icon: AlertCircle  },
  "On Leave":       { color: "bg-rose-100 text-rose-800",  Icon: UserX        },
  Closed:           { color: "bg-slate-100 text-slate-700", Icon: XCircle      },
  None:             { color: "bg-slate-100 text-slate-700", Icon: Minus        },
  "Not Recordable": { color: "bg-slate-100 text-slate-700", Icon: Minus        },
};

export default function StatusBadge({ status }) {
  const { color, Icon } = statusMap[status] || { color: "bg-slate-100 text-slate-700", Icon: Minus };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>
      <Icon size={11} aria-hidden="true" />
      {status}
    </span>
  );
}
