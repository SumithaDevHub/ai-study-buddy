"use client";

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

type Props = {
  tasks: Task[];
  completed: number;
  progress: number;
  openQuiz: (task: Task) => void;
};

export default function TaskList({
  tasks,
  completed,
  progress,
  openQuiz
}: Props) {

  return (

    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6 shadow-sm">

      {/* HEADER */}

      <div className="flex justify-between items-center mb-4">

        <h2 className="text-lg font-bold text-black">
          Study Tasks
        </h2>

        <div className="text-sm font-semibold text-black">
          {completed}/{tasks.length}
        </div>

      </div>


      {/* TASK LIST */}

      <div className="space-y-3">

        {tasks.map((task, index) => (

          <div
            key={task.id}
            className={`flex items-center gap-3 border rounded-lg p-3 transition
              ${task.completed
                ? "bg-green-50 border-green-200"
                : "bg-white hover:bg-indigo-50 cursor-pointer"
              }`}
          >

            {/* CHECKBOX */}

            <input
              type="checkbox"
              checked={task.completed}
              className="w-5 h-5 accent-indigo-600"
              onChange={() => {
                if (!task.completed) openQuiz(task);
              }}
            />

            {/* TASK TITLE */}

            <span
              className={`text-black flex-1
                ${task.completed ? "line-through opacity-60" : ""}
              `}
            >
              {index + 1}. {task.title}
            </span>

            {/* STATUS */}

            {task.completed && (
              <span className="text-xs font-semibold text-green-600">
                Completed
              </span>
            )}

          </div>

        ))}

      </div>


      {/* PROGRESS SECTION */}

      <div className="mt-6">

        <div className="flex justify-between text-sm font-medium text-black mb-1">

          <span>Progress</span>
          <span>{progress}%</span>

        </div>

        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">

          <div
            className="h-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />

        </div>

      </div>

    </div>

  );

}