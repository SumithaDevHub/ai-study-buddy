"use client";

type Props = {
  onAllow: () => void;
  onDeny: () => void;
};

export default function CameraConsentModal({ onAllow, onDeny }: Props) {

  return (

    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">

      <div className="w-[520px] rounded-2xl overflow-hidden shadow-2xl bg-white">

        {/* HEADER */}

        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">

          <h2 className="text-2xl font-bold text-white">
            Camera Permission
          </h2>

          <p className="text-indigo-100 mt-1 text-sm">
            Help AI Study Buddy measure your focus during study sessions
          </p>

        </div>


        {/* BODY */}

        <div className="p-6 space-y-5">

          <p className="text-black">
            AI Study Buddy can optionally use your camera to estimate focus and
            provide better learning feedback.
          </p>


          {/* TRUST BOX */}

          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-4 space-y-2">

            <p className="font-semibold text-black">
              Your privacy is protected:
            </p>

            <ul className="space-y-1 text-black">

              <li>✔ No video is recorded</li>
              <li>✔ No images are stored</li>
              <li>✔ Frames are processed temporarily for focus estimation</li>
              <li>✔ Camera helps unlock full XP rewards</li>

            </ul>

          </div>


          {/* NOTE */}

          <p className="text-black text-sm">
            You can continue without enabling the camera. However, focus tracking
            will be limited and some XP rewards may be reduced.
          </p>


          {/* ACTION BUTTONS */}

          <div className="flex justify-end gap-3 pt-2">

            <button
              onClick={onDeny}
              className="px-5 py-2 border border-gray-300 rounded-lg text-black hover:bg-gray-100 transition"
            >
              Continue without Camera
            </button>

            <button
              onClick={onAllow}
              className="px-5 py-2 rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 shadow"
            >
              Enable Camera
            </button>

          </div>

        </div>

      </div>

    </div>

  );

}