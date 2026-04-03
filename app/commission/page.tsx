import { google } from "googleapis";

const STATUS_MAP: Record<string, string> = {
  open:       "O",
  closed:     "✕",
  negotiable: "△",
};

type ScheduleRow = { month: string; status: string };

async function getSchedule(): Promise<ScheduleRow[]> {
  const email      = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const sheetId    = process.env.GOOGLE_SHEETS_ID;

  // Fallback if env vars not set
  if (!email || !privateKey || !sheetId) {
    return [
      { month: "Jan", status: "closed" },
      { month: "Feb", status: "closed" },
      { month: "Mar", status: "closed" },
      { month: "Apr", status: "open" },
      { month: "May", status: "open" },
      { month: "Jun", status: "negotiable" },
      { month: "Jul", status: "negotiable" },
      { month: "Aug", status: "closed" },
      { month: "Sep", status: "closed" },
      { month: "Oct", status: "open" },
      { month: "Nov", status: "open" },
      { month: "Dec", status: "negotiable" },
    ];
  }

  const auth = new google.auth.JWT({
    email,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: "Schedule!A2:B13",
  });

  const rows = res.data.values ?? [];

  return rows.map(([month, status]) => ({
    month: month ?? "",
    status: (status ?? "closed").toLowerCase(),
  }));
}

function StatusSymbol({ status }: { status: string }) {
  const symbol = STATUS_MAP[status] ?? "?";
  return <span className="text-lg font-light">{symbol}</span>;
}

export default async function Commission() {
  const schedule = await getSchedule();

  return (
    <div className="max-w-2xl mx-auto px-8 py-16 space-y-12">

      <h1 className="text-2xl font-semibold">Commissions</h1>

      {/* Schedule */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400">
          Schedule 2025
        </h2>
        <div className="grid grid-cols-6 border border-gray-200">
          {schedule.map((item, i) => (
            <div
              key={item.month}
              className={`flex flex-col items-center py-4 gap-2 border-gray-200
                ${i % 6 !== 5 ? "border-r" : ""}
                ${i < 6 ? "border-b" : ""}
              `}
            >
              <span className="text-xs text-gray-400">{item.month}</span>
              <StatusSymbol status={item.status} />
            </div>
          ))}
        </div>
        <div className="flex gap-6 text-xs text-gray-500">
          <span>O — Available</span>
          <span>△ — Contact first</span>
          <span>✕ — Closed</span>
        </div>
      </div>

      {/* Offering */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400">
          What I offer
        </h2>
        <table className="w-full text-sm">
          <tbody className="divide-y divide-gray-100">
            <tr>
              <td className="py-2 text-gray-700">Illustration</td>
              <td className="py-2 text-right text-gray-500">from $XX</td>
            </tr>
            <tr>
              <td className="py-2 text-gray-700">Character design</td>
              <td className="py-2 text-right text-gray-500">from $XX</td>
            </tr>
            <tr>
              <td className="py-2 text-gray-700">Commercial use</td>
              <td className="py-2 text-right text-gray-500">please inquire</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Process */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400">
          Process
        </h2>
        <ol className="space-y-2 text-sm text-gray-700">
          <li className="flex gap-3">
            <span className="text-gray-300 select-none">01</span>
            Send an inquiry via the contact form
          </li>
          <li className="flex gap-3">
            <span className="text-gray-300 select-none">02</span>
            Receive a quote within 3 business days
          </li>
          <li className="flex gap-3">
            <span className="text-gray-300 select-none">03</span>
            50% upfront payment to begin
          </li>
          <li className="flex gap-3">
            <span className="text-gray-300 select-none">04</span>
            Sketch → Revision → Final delivery
          </li>
        </ol>
      </div>

    </div>
  );
}
