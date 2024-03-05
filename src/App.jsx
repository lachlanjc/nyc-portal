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
        style={{ backgroundColor: "#4a6789" }}
      >
        🚀
      </button>
      <button
        onClick={() => {
          useHaptic("cat");
        }}
        style={{ backgroundColor: "#ffc752" }}
      >
        🐈
      </button>
      <button
        onClick={() => {
          useHaptic("alarm");
        }}
        style={{ backgroundColor: "#ddeedc" }}
      >
        ⏰
      </button>
      <button
        onClick={() => {
          useHaptic("fairy");
        }}
        style={{ backgroundColor: "#ff899b" }}
      >
        🧚
      </button>
    </>
  );
}
