"use client";

type Props = {
  minutes: number;
  seconds: number;
};

export default function StudyTimer({ minutes, seconds }: Props) {
  return (
    <div className="border p-2  rounded-lg shadow text-center">
      <div className="text-4xl font-bold">
        {minutes}:{seconds.toString().padStart(2, "0")}
      </div>

      <p className="text-white mt-1">
        Study Timer
      </p>
    </div>
  );
}