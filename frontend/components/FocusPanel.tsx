"use client";

import FocusCamera from "@/components/FocusCamera";

type Props = {
  sendFocusSignal: (signal: any) => void;
  cameraEnabled: boolean;
};

export default function FocusPanel({ sendFocusSignal, cameraEnabled }: Props) {

  if (!cameraEnabled) {
    return (
      <div className="border p-4 rounded-lg shadow">

        <h2 className="font-semibold mb-3">
          Focus Camera
        </h2>

        <p className="text-sm text-gray-500">
          Camera disabled. Focus tracking unavailable.
        </p>

      </div>
    );
  }

  return (

    <div className="">

      {/* <h2 className="font-semibold mb-3">
        Focus Camera
      </h2> */}

      <FocusCamera onSignal={sendFocusSignal} />

    </div>

  );

}