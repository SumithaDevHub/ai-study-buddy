"use client";

import { useEffect, useRef, useState } from "react";
import {
  FaceLandmarker,
  FilesetResolver
} from "@mediapipe/tasks-vision";

type Props = {
  onSignal: (signal: any) => void;
};

export default function FocusCamera({ onSignal }: Props) {

  const videoRef = useRef<HTMLVideoElement>(null);
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);

  const blinkCountRef = useRef(0);
  const lastEyesClosedRef = useRef(false);

  const [cameraActive, setCameraActive] = useState(false);

  useEffect(() => {
    startCamera();
  }, []);

  /* ---------------- CAMERA ---------------- */

  const startCamera = async () => {

    try {

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setCameraActive(true);

      await loadModel();

      detectLoop();

    } catch (err) {

      console.log("Camera permission denied");
      setCameraActive(false);

    }

  };

  /* ---------------- LOAD MEDIAPIPE MODEL ---------------- */

  const loadModel = async () => {

    const fileset = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );

    faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(
      fileset,
      {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-assets/face_landmarker.task"
        },
        runningMode: "VIDEO",
        numFaces: 1
      }
    );

  };

  /* ---------------- EYE ASPECT RATIO ---------------- */

  function calculateEAR(eye: any[]) {

    const vertical1 = Math.hypot(
      eye[1].x - eye[5].x,
      eye[1].y - eye[5].y
    );

    const vertical2 = Math.hypot(
      eye[2].x - eye[4].x,
      eye[2].y - eye[4].y
    );

    const horizontal = Math.hypot(
      eye[0].x - eye[3].x,
      eye[0].y - eye[3].y
    );

    return (vertical1 + vertical2) / (2 * horizontal);
  }

  /* ---------------- DETECTION LOOP ---------------- */

  const detectLoop = () => {

    setInterval(() => {

      if (!videoRef.current || !faceLandmarkerRef.current) return;

      const now = performance.now();

      const result = faceLandmarkerRef.current.detectForVideo(
        videoRef.current,
        now
      );

      let face_present = result.faceLandmarks.length > 0;
      let eyes_closed = false;
      let head_down = false;

      if (face_present) {

        const landmarks = result.faceLandmarks[0];

        const leftEye = [
          landmarks[33],
          landmarks[160],
          landmarks[158],
          landmarks[133],
          landmarks[153],
          landmarks[144]
        ];

        const rightEye = [
          landmarks[362],
          landmarks[385],
          landmarks[387],
          landmarks[263],
          landmarks[373],
          landmarks[380]
        ];

        const leftEAR = calculateEAR(leftEye);
        const rightEAR = calculateEAR(rightEye);

        const ear = (leftEAR + rightEAR) / 2;

        eyes_closed = ear < 0.18;

        if (eyes_closed && !lastEyesClosedRef.current) {
          blinkCountRef.current += 1;
        }

        lastEyesClosedRef.current = eyes_closed;

        const nose = landmarks[1];
        const leftEyeTop = landmarks[159];
        const rightEyeTop = landmarks[386];

        const eyeLevel = (leftEyeTop.y + rightEyeTop.y) / 2;

        if (nose.y > eyeLevel + 0.04) {
          head_down = true;
        }

      }

      const signal = {
        face_present,
        eyes_closed,
        blink_rate: blinkCountRef.current,
        head_down,
        idle_seconds: 0
      };

      onSignal(signal);

    }, 5000);

  };

  /* ---------------- UI ---------------- */

  return (

    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-4 shadow-sm">

      {/* HEADER */}

      <div className="flex justify-between items-center mb-3">

       
        <div className={`px-2 py-1 text-xs rounded-full font-medium
          ${cameraActive
            ? "bg-green-100 text-black"
            : "bg-red-100 text-black"
          }`}
        >
          {cameraActive ? "Camera Active" : "Camera Off"}
        </div>

      </div>

      {/* VIDEO */}

      <div className="rounded-lg overflow-hidden border border-gray-200">

        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-auto"
        />

      </div>


    </div>

  );

}