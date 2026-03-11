"use client";

type Props = {
  open: boolean;
  report: any;
  onClose: () => void;
};

export default function SessionReportModal({ open, report, onClose }: Props) {

  if (!open || !report) return null;

  return (

    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <div className="bg-white w-[700px] max-h-[90vh] overflow-y-auto rounded-xl shadow-xl border">

        {/* HEADER */}

        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-t-xl text-center">

          <h2 className="text-white text-2xl font-bold">
            Session Complete 🎉
          </h2>

          <p className="text-indigo-100 text-sm mt-1">
            Here's your study performance summary
          </p>

        </div>


        <div className="p-6 space-y-6">

          {/* STATS */}

          <div className="grid grid-cols-3 gap-4">

            <StatCard
              label="Duration"
              value={`${report.study_duration} min`}
              color="bg-blue-50"
            />

            <StatCard
              label="Focus Score"
              value={`${report.focus_score}%`}
              color="bg-purple-50"
            />

            <StatCard
              label="Quiz Accuracy"
              value={`${report.quiz_accuracy}%`}
              color="bg-green-50"
            />

            <StatCard
              label="XP Earned"
              value={`+${report.xp_earned}`}
              color="bg-yellow-50"
            />

            <StatCard
              label="Tasks Completed"
              value={report.tasks_completed}
              color="bg-indigo-50"
            />

          </div>


          {/* AI REPORT */}

          {report.report && (

            <div className="space-y-5">

              <Section
                title="Summary"
                text={report.report.summary}
                color="bg-indigo-50"
              />

              <Section
                title="Strengths"
                text={report.report.strengths}
                color="bg-green-50"
              />

              <Section
                title="Weak Areas"
                text={report.report.weaknesses}
                color="bg-red-50"
              />

              <Section
                title="Learning Insights"
                text={report.report.learning_insights}
                color="bg-purple-50"
              />

              <Section
                title="Recommendations"
                text={report.report.recommendations}
                color="bg-yellow-50"
              />

            </div>

          )}

          {/* BUTTON */}

          <div className="pt-2 flex justify-center">

            <button
              onClick={onClose}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg shadow hover:opacity-90"
            >
              Back to Dashboard
            </button>

          </div>

        </div>

      </div>

    </div>

  );

}


/* STAT CARD */

function StatCard({
  label,
  value,
  color
}: {
  label: string;
  value: string | number;
  color: string;
}) {

  return (

    <div className={`${color} border rounded-lg p-4 text-center`}>

      <p className="text-sm text-black">
        {label}
      </p>

      <p className="text-lg font-bold text-black">
        {value}
      </p>

    </div>

  );

}


/* REPORT SECTION */

function Section({
  title,
  text,
  color
}: {
  title: string;
  text: string;
  color: string;
}) {

  return (

    <div className={`${color} border rounded-lg p-4`}>

      <h3 className="font-semibold text-black mb-1">
        {title}
      </h3>

      <p className="text-black">
        {text}
      </p>

    </div>

  );

}