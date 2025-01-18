import { useState } from "react";
import Board from "./Board";

export default function Home() {
  const [players, setPlayers] = useState(0);

  const clicked = (x) => {
    setPlayers(x);
  };

  return (
    <>
      {players == 0 && (
        <div className="h-screen w-screen flex flex-col space-y-4 items-center justify-center text-white">
          <div className="font-medieval text-3xl">
            Round-2 Snake & Ladder Game
          </div>
          <div className="flex flex-row space-x-8">
            <button
              className="bg-[#4f9d9d] hover:bg-[#388f8f] border-zinc-900 p-4 rounded-2xl text-xl font-medieval w-48"
              onClick={() => clicked(2)}
            >
              2 Players
            </button>
            <button
              className="bg-[#4f9d9d] hover:bg-[#388f8f] border-zinc-900 p-4 rounded-2xl text-xl font-medieval w-48"
              onClick={() => clicked(4)}
            >
              4 Players
            </button>
          </div>
        </div>
      )}
      {players !== 0 && <Board players={players} />}
    </>
  );
}
