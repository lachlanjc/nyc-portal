import React, { useCallback } from "react";
import { RoomProvider, useBroadcastEvent } from "./liveblocks.config";
import useSound from "use-sound";

export default function LiveblocksProvider() {
  return (
    <RoomProvider id="web-haptics" initialPresence={{}}>
      <App />
    </RoomProvider>
  );
}

function App() {
  const [playBite] = useSound("/bite.mp3");
  const broadcast = useBroadcastEvent();

  const useHaptic = useCallback(
    (code) => {
      broadcast(code);
      playBite();
    },
    [playBite, broadcast]
  );

  return (
    <>
      <button
        onClick={() => {
          useHaptic("rocket");
        }}
        style={{ backgroundColor: "#4f5865" }}
      >
        🚀
      </button>
      <button
        onClick={() => {
          useHaptic("cat");
        }}
        style={{ backgroundColor: "#fec35d" }}
      >
        🐈
      </button>
      <button
        onClick={() => {
          useHaptic("alarm");
        }}
        style={{ backgroundColor: "#88a5b9" }}
      >
        ⏰
      </button>
      <button
        onClick={() => {
          useHaptic("fairy");
        }}
        style={{ backgroundColor: "#ff89a5" }}
      >
        🧚
      </button>
    </>
  );
}
