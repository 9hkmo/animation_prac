import React, { useRef, useState } from "react";

const EyeBlinkRecorder = () => {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [result, setResult] = useState("");
  const chunksRef = useRef([]);

  // 웹캠 시작
  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
    videoRef.current.play();
  };

  // 녹화 시작
  const startRecording = async () => {
    await startCamera(); // 웹캠 켜기

    const stream = videoRef.current.srcObject;
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: "video/webm",
    });

    chunksRef.current = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      const formData = new FormData();
      formData.append("video", blob, "eye_blink_record.webm");

      try {
        const res = await fetch("http://localhost:8000/analyze", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        setResult(data.message);
      } catch (err) {
        setResult("서버와의 통신 중 오류가 발생했습니다.");
      }
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setRecording(true);

    // 1분 후 자동 종료
    setTimeout(() => {
      mediaRecorder.stop();
      setRecording(false);
    }, 60 * 1000);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">눈 깜빡임 기록기</h2>
      <video ref={videoRef} autoPlay muted className="w-full max-w-lg border rounded" />
      <div className="mt-4">
        <button
          onClick={startRecording}
          disabled={recording}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {recording ? "녹화 중..." : "1분간 녹화 시작"}
        </button>
      </div>
      {result && (
        <div className="mt-4 p-3 border rounded bg-gray-100">
          <strong>결과:</strong> {result}
        </div>
      )}
    </div>
  );
};

export default EyeBlinkRecorder;
