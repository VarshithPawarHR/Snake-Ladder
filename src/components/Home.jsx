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
        <div className="min-h-screen w-full bg-[#0a192f] flex flex-col items-center justify-center p-4 md:p-8">
          <div className="w-full max-w-4xl text-center space-y-8 md:space-y-12">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold">
                <span className="text-[#64ffda]">FINITE</span>
                <span className="text-white">LOOP</span>
              </h1>
              <div className="space-y-2">
                <p className="text-xl md:text-2xl text-gray-400 font-mono">
                  Snake & Ladder Championship
                </p>
                <p className="text-sm md:text-base text-gray-500 font-mono">
                  A Non Technical Club Event
                </p>
              </div>
            </div>

            <div className="bg-[#112240]/80 border border-[#233554] rounded-2xl p-8 md:p-12 space-y-8 backdrop-blur-sm shadow-2xl">
              <h2 className="text-2xl md:text-3xl text-[#64ffda] font-mono">
                Select Players
              </h2>
              
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                <button
                  onClick={() => clicked(2)}
                  className="w-full md:w-48 px-8 py-4 text-lg md:text-xl font-mono text-[#112240] bg-[#64ffda] rounded-xl transition-all hover:bg-[#64ffda]/90 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#64ffda]/50"
                >
                  2 Players
                </button>
                <button
                  onClick={() => clicked(4)}
                  className="w-full md:w-48 px-8 py-4 text-lg md:text-xl font-mono text-[#64ffda] border-2 border-[#64ffda] rounded-xl transition-all hover:bg-[#64ffda]/10 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#64ffda]/50"
                >
                  4 Players
                </button>
              </div>
            </div>

            <div className="text-gray-500 font-mono text-sm">
              Powered by FiniteLoop Club
            </div>
          </div>
        </div>
      )}
      {players !== 0 && <Board players={players} />}
    </>
  );
}
