import { useState } from "react";

export default function Board({ players }) {
  const [number, setNumber] = useState(null);
  const [rolling, setRolling] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [turn, setTurn] = useState(1);
  const [positions, setPositions] = useState(Array(players).fill(0));
  const [previousPositions, setPreviousPositions] = useState(
    Array(players).fill(0),
  );
  const [eventMessage, setEventMessage] = useState("");
  const [winner, setWinner] = useState(null);

  const playerColors = [
    "bg-stone-300",
    "bg-yellow-400",
    "bg-pink-500",
    "bg-purple-600",
  ];

  const ladders = {
    2: 38,
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
    5, 12, 19, 24, 30, 34, 40, 44, 50, 59, 53, 67, 76, 73, 81, 84, 89, 93, 96,
    99,
  ];

  const rollDice = () => {
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
        } else if (tasks.includes(finalPosition)) {
          event = "You have a task to perform!";
        }

        newPositions[turn - 1] = finalPosition;

        if (finalPosition === 100) {
          setWinner(turn);
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
    setTurn((prevTurn) =>
      prevTurn === players || winner
        ? winner === prevTurn
          ? prevTurn
          : prevTurn === players
            ? 1
            : prevTurn + 1
        : prevTurn === players
          ? 1
          : prevTurn + 1,
    );
  };

  const handleStay = () => {
    setShowButtons(false);
    setTurn((prevTurn) =>
      prevTurn === players || winner
        ? winner === prevTurn
          ? prevTurn
          : prevTurn === players
            ? 1
            : prevTurn + 1
        : prevTurn === players
          ? 1
          : prevTurn + 1,
    );
  };

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
    <div className="h-screen w-screen grid grid-cols-[7fr_3fr]">
      {/* Left Half */}
      <div className="flex items-center justify-center bg-gray-700">
        <div className="grid grid-cols-10 gap-1">
          {grid.flat().map((cell, index) => {
            const playersOnSquare = positions
              .map((position, i) => (position === cell.number ? i : -1))
              .filter((i) => i !== -1);
            let cellBgColor = "bg-gray-800";
            if (tasks.includes(cell.number)) {
              cellBgColor = "bg-blue-500";
            } else if (cell.ladderStart) {
              cellBgColor = "bg-green-500";
            } else if (cell.snakeStart) {
              cellBgColor = "bg-red-500";
            }
            return (
              <div
                key={index}
                className={`flex flex-col justify-center items-center w-[52px] h-[52px] ${cellBgColor} border-2 border-black rounded`}
              >
                <span className="text-md text-white font-extrabold">
                  {cell.number}
                </span>
                {cell.ladderStart && <span className="text-xl">🚪</span>}
                {cell.snakeStart && <span className="text-xl">🐍</span>}
                <div className="relative w-full h-full flex items-center justify-center">
                  {playersOnSquare.map((player, index) => (
                    <div
                      key={player}
                      className={`absolute flex justify-center items-center w-8 h-8 rounded-full border-2 border-white text-sm font-bold text-black ${playerColors[player]}`}
                      style={{
                        transform: `translate(${index}px, ${index}px)`,
                        zIndex: playersOnSquare.length - index,
                      }}
                    >
                      {player + 1}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Right Half */}
      <div className="flex flex-col items-center justify-center space-y-12 bg-gray-800 text-white px-6">
        <div className="font-medieval text-2xl">Turn: Player {turn}</div>
        {eventMessage && (
          <div
            className={`text-xl font-bold ${
              eventMessage === "SNAKE!"
                ? "text-red-500"
                : eventMessage === "LADDER!"
                  ? "text-green-500"
                  : "text-blue-500"
            }`}
          >
            {eventMessage}
          </div>
        )}
        {winner && (
          <div className="text-xl font-bold text-yellow-500">
            Winner!!! Player {winner}
          </div>
        )}
        <div className="flex flex-row space-x-8">
          <div
            className={`cursor-pointer font-medieval w-20 h-20 flex justify-center items-center bg-[#4f9d9d] hover:bg-[#388f8f] rounded-md transition-all duration-1000 ${rolling ? "dice-roll" : ""}`}
            onClick={rollDice}
            disabled={winner}
          >
            <div className="text-4xl font-bold">{number || "?"}</div>
          </div>
          {showButtons && !winner && (
            <div className="flex flex-col space-y-4 items-center justify-center">
              {tasks.includes(positions[turn - 1]) ? (
                <>
                  <button
                    onClick={handleMove}
                    className="bg-[#4f9d9d] hover:bg-[#388f8f] border-zinc-900 px-6 py-2 rounded-2xl text-lg font-medieval text-white text-center"
                  >
                    Move
                  </button>
                  <button
                    onClick={handleStay}
                    className="bg-[#4f9d9d] hover:bg-[#388f8f] border-zinc-900 px-6 py-2 rounded-2xl text-lg font-medieval text-white text-center"
                  >
                    Stay
                  </button>
                </>
              ) : (
                <button
                  onClick={handleMove}
                  className="bg-[#4f9d9d] hover:bg-[#388f8f] border-zinc-900 px-6 py-2 rounded-2xl text-lg font-medieval text-white text-center"
                >
                  Move
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
