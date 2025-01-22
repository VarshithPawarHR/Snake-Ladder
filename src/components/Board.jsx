import { useState, useEffect } from "react";

export default function Board({ players }) {
  const [number, setNumber] = useState(null);
  const [rolling, setRolling] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [turn, setTurn] = useState(1);
  const [positions, setPositions] = useState(Array(players).fill(0));
  const [previousPositions, setPreviousPositions] = useState(Array(players).fill(0));
  const [eventMessage, setEventMessage] = useState("");
  const [taskPlayers, setTaskPlayers] = useState({});
  const [winner, setWinner] = useState(null);
  const [stayPlayers, setStayPlayers] = useState([]);

  const playerColors = [
    "bg-gradient-to-r from-blue-500 to-blue-600",
    "bg-gradient-to-r from-green-500 to-green-600",
    "bg-gradient-to-r from-orange-500 to-orange-600",
    "bg-gradient-to-r from-purple-500 to-purple-600"
  ];

  const ladders = {
    10: 38,
    8: 31,
    15: 26,
    21: 42,
    28: 84,
    36: 44,
    51: 67,
    71: 91,
    80: 100,
  };

  const snakes = {
    16: 6,
    49: 30,
    56: 53,
    64: 60,
    87: 24,
    95: 75,
    98: 90,
  };

  const tasks = [
    3, 7, 9, 5, 12, 19, 24, 30, 34, 40, 44, 50, 59, 53, 67, 76, 73, 81, 84, 89,
    93, 96, 99,
  ];

  const rollDice = () => {
    if (rolling || showButtons) return;

    if (stayPlayers.includes(turn)) {
      setEventMessage("You Miss Your Turn!");
      setTimeout(() => {
        setEventMessage("");
        setTurn((prevTurn) => (prevTurn === players ? 1 : prevTurn + 1));
      }, 1500);
      return;
    }
    
    setRolling(true);
    setShowButtons(false);
    setTimeout(() => {
      const randomNumber = Math.floor(Math.random() * 6) + 1;
      setNumber(randomNumber);
      setRolling(false);
      setShowButtons(true);
    }, 700);
    setEventMessage("");
  };

  const handleMove = () => {
    if (stayPlayers.includes(turn)) {
      setStayPlayers((prevStayPlayers) =>
        prevStayPlayers.filter((player) => player !== turn),
      );

      setShowButtons(false);
      setTurn((prevTurn) => (prevTurn === players ? 1 : prevTurn + 1));
      return;
    }
    setPositions((prevPositions) => {
      const newPositions = [...prevPositions];
      const currentPos = newPositions[turn - 1];
      const potentialNewPosition = currentPos + number;
      let event = "";
      if (potentialNewPosition <= 100) {
        let finalPosition = potentialNewPosition;
        if (ladders[finalPosition]) {
          finalPosition = ladders[finalPosition];
          event = "LADDER!";
        } else if (snakes[finalPosition]) {
          finalPosition = snakes[finalPosition];
          event = "SNAKE!";
        }
        if (!tasks.includes(finalPosition)) {
          setTaskPlayers((prev) => {
            const updated = { ...prev };
            delete updated[turn];
            return updated;
          });
        }
        newPositions[turn - 1] = finalPosition;
        if (finalPosition === 100) {
          setWinner(turn);
        }
        if (tasks.includes(finalPosition)) {
          setTaskPlayers((prev) => {
            const updated = { ...prev };
            updated[turn] = true;
            return updated;
          });
        }
      }
      setEventMessage(event);
      return newPositions;
    });
    setPreviousPositions((prev) => {
      const newPrevPositions = [...prev];
      newPrevPositions[turn - 1] = positions[turn - 1];
      return newPrevPositions;
    });
    setShowButtons(false);
    setTurn((prevTurn) => (prevTurn === players ? 1 : prevTurn + 1));
  };

  const handleStay = () => {
    setStayPlayers((prevStayPlayers) => [...prevStayPlayers, turn]);
    setTaskPlayers((prev) => {
      const updated = { ...prev };
      delete updated[turn];
      return updated;
    });
    setShowButtons(false);
    setTurn((prevTurn) => (prevTurn === players ? 1 : prevTurn + 1));
  };

  const changeTurnWhenMissed = () => {
    setStayPlayers((prevStayPlayers) =>
      prevStayPlayers.filter((player) => player !== turn),
    );
    setTurn((prevTurn) => (prevTurn === players ? 1 : prevTurn + 1));
  }

  useEffect(() => {
    if (eventMessage) {
      const timer = setTimeout(() => {
        setEventMessage("");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [eventMessage]);

  const grid = [];
  for (let row = 9; row >= 0; row--) {
    const rowSquares = [];
    for (let col = 0; col < 10; col++) {
      const index = row % 2 === 0 ? 10 * row + col : 10 * (row + 1) - col - 1;
      const currentValue = index + 1;
      const ladderStart = ladders[currentValue];
      const snakeStart = snakes[currentValue];
      rowSquares.push({
        number: currentValue,
        ladderStart,
        snakeStart,
      });
    }
    grid.push(rowSquares);
  }

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[2fr,1fr] bg-[#0a192f] bg-fixed">
      <div className="p-4 md:p-8 flex items-center justify-center bg-black/40">
        <div className="game-card p-3 md:p-6 overflow-auto bg-[#112240]/80 border border-[#233554] rounded-2xl shadow-2xl">
          <div className="grid grid-cols-10 gap-1 md:gap-1.5">
            {grid.flat().map((cell, index) => {
              const playersOnSquare = positions
                .map((position, i) => (position === cell.number ? i : -1))
                .filter((i) => i !== -1);

              let cellStyle = "bg-[#233554]/50";
              let numberColor = "text-[#64ffda]";
              
              if (tasks.includes(cell.number)) {
                cellStyle = "bg-purple-900/50 border-purple-500";
                numberColor = "text-purple-200 font-bold";
              } else if (cell.ladderStart) {
                cellStyle = "bg-[#64ffda]/10 border-[#64ffda]";
              } else if (cell.snakeStart) {
                cellStyle = "bg-red-500/10 border-red-500";
              }

              return (
                <div key={index} className={`relative flex flex-col justify-between w-[35px] h-[35px] sm:w-[45px] sm:h-[45px] md:w-[55px] md:h-[55px] lg:w-[60px] lg:h-[60px] ${cellStyle} border border-[#233554] rounded-lg backdrop-blur-sm transition-all duration-300 hover:bg-opacity-40`}>
                  <span className={`absolute top-0.5 left-0.5 md:top-1 md:left-1 text-[10px] sm:text-xs md:text-sm font-mono ${numberColor}`}>
                    {cell.number}
                  </span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    {cell.ladderStart && <span className="text-base sm:text-xl md:text-2xl">🪜</span>}
                    {cell.snakeStart && <span className="text-base sm:text-xl md:text-2xl">🐍</span>}
                  </div>
                  <div className="absolute bottom-0.5 right-0.5 md:bottom-1 md:right-1 flex flex-wrap gap-0.5">
                    {playersOnSquare.map((player) => (
                      <div key={player} className={`w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 rounded-full border border-[#64ffda]/30 flex items-center justify-center text-[8px] sm:text-[10px] md:text-xs font-bold shadow-lg transform transition-all duration-300 ${playerColors[player]} hover:scale-110`}>
                        {player + 1}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-[#112240]/90 p-4 md:p-8 flex flex-col justify-center space-y-4 md:space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#64ffda] mb-2">FINITE<span className="text-white">LOOP</span></h1>
          <p className="text-sm text-gray-400">Snake & Ladder Championship</p>
        </div>

        {!winner ? (
          <>
            {taskPlayers[turn] && (
              <div className="game-card text-center bg-[#233554]/50 border border-[#64ffda] shadow-lg shadow-[#64ffda]/10">
                <p className="text-lg md:text-xl font-mono text-[#64ffda] animate-pulse">
                  You have a task to perform!
                </p>
              </div>
            )}

            <div className="game-card text-center bg-[#233554]/50 border border-[#233554]">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Team {turn}'s Turn
              </h2>
              <div className={`w-6 h-6 md:w-8 md:h-8 ${playerColors[turn-1]} rounded-full mx-auto shadow-lg`} />
            </div>

            {eventMessage && (
              <div className={`game-card text-center text-xl md:text-2xl font-bold ${eventMessage === "SNAKE!" ? "text-red-500" : "text-[#64ffda]"} animate-bounce-slow bg-[#233554]/50 border border-[#233554]`}>
                {eventMessage}
              </div>
            )}

            <div className="game-card space-y-4 md:space-y-6 bg-[#233554]/50 border border-[#233554]">
              {stayPlayers.includes(turn) ? (
                <div className="text-lg md:text-xl font-mono text-red-500 text-center cursor-pointer hover:text-opacity-80" onClick={() => changeTurnWhenMissed()}>
                  You Miss Your Turn!
                </div>
              ) : (
                <div className="text-center">
                  <div className={`dice w-12 h-12 md:w-16 md:h-16 text-xl md:text-2xl mx-auto mb-4 md:mb-6 bg-[#233554] text-[#64ffda] ${rolling ? "animate-bounce-slow" : ""} ${!showButtons && !rolling ? "hover:scale-110 cursor-pointer hover:bg-[#64ffda] hover:text-[#112240]" : "opacity-80 cursor-not-allowed"}`} onClick={rollDice}>
                    {number || "?"}
                  </div>

                  {showButtons && (
                    <div className="space-y-3 md:space-y-4">
                      <button onClick={handleMove} className="w-full px-6 py-2 text-sm md:text-base font-semibold text-[#112240] bg-[#64ffda] rounded-lg transition-all hover:bg-[#64ffda]/90">
                        Move
                      </button>
                      {taskPlayers[turn] && (
                        <button onClick={handleStay} className="w-full px-6 py-2 text-sm md:text-base font-semibold text-[#64ffda] border border-[#64ffda] rounded-lg transition-all hover:bg-[#64ffda]/10">
                          Stay
                        </button>
                      )}
                    </div>
                  )}

                  <p className="text-xs md:text-sm text-gray-400 mt-3 md:mt-4">
                    {showButtons ? "Make your move or wait for next turn" : rolling ? "Rolling..." : "Click the dice to roll"}
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="game-card text-center p-6 md:p-8 bg-[#233554]/50 border border-[#64ffda]">
            <h2 className="text-3xl md:text-4xl font-bold text-[#64ffda] mb-3 md:mb-4">
              🎉 Victory! 🎉
            </h2>
            <p className="text-xl md:text-2xl text-white">
              Team {winner} Wins!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
