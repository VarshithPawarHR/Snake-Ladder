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
  const playerColors = [
    "bg-lime-500",
    "bg-blue-500",
    "bg-indigo-500",
    "bg-purple-500",
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
    49: 11,
    56: 53,
    64: 60,
    87: 24,
    95: 75,
    98: 90,
  };

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

      let event = ""; // Variable to hold the event message

      if (potentialNewPosition <= 100) {
        let finalPosition = potentialNewPosition;

        if (ladders[finalPosition]) {
          finalPosition = ladders[finalPosition];
          event = "LADDER!"; // Set the event message to "LADDER!"
        } else if (snakes[finalPosition]) {
          finalPosition = snakes[finalPosition];
          event = "SNAKE!"; // Set the event message to "SNAKE!"
        }

        newPositions[turn - 1] = finalPosition;
      }

      // Update the event message state
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
    setShowButtons(false);
    setTurn((prevTurn) => (prevTurn === players ? 1 : prevTurn + 1));
  };

  const grid = [];
  for (let row = 9; row >= 0; row--) {
    const rowSquares = [];
    for (let col = 0; col < 10; col++) {
      const index = row % 2 === 0 ? 10 * row + col : 10 * (row + 1) - col - 1;
      const currentValue = index + 1;

      const ladderStart = ladders[currentValue];
      const snakeStart = snakes[currentValue];

      const ladderEnd = ladderStart ? ladders[ladderStart] : null;
      const snakeEnd = snakeStart ? snakes[snakeStart] : null;

      rowSquares.push({
        number: currentValue,
        ladderStart,
        ladderEnd,
        snakeStart,
        snakeEnd,
      });
    }
    grid.push(rowSquares);
  }

  const leaderboard = positions
    .map((position, index) => ({
      player: index + 1,
      position,
      prevPosition: previousPositions[index],
    }))
    .sort((a, b) => b.position - a.position);

  return (
    <div className="h-screen w-screen grid grid-cols-2">
      {/* Left Half */}
      <div className="flex flex-col items-center justify-center space-y-12 bg-gray-800 text-white px-6">
        <div className="font-medieval text-2xl">
          Turn: Player {turn}
        </div>
        {/* Display Snake or Ladder message */}
        {eventMessage && (
          <div
            className={`text-xl font-bold ${
              eventMessage === "SNAKE!" ? "text-red-500" : "text-green-500"
            }`}
          >
            {eventMessage}
          </div>
        )}

        {/* Create a flex container to make the dice and buttons stay in a row */}
        <div className="flex flex-row space-x-8">
          <div
            className={`font-medieval w-20 h-20 flex justify-center items-center bg-[#4f9d9d] hover:bg-[#388f8f] rounded-md transition-all duration-1000 ${rolling ? "dice-roll" : ""}`}
            onClick={rollDice}
          >
            <div className="text-4xl font-bold">{number || "?"}</div>
          </div>

          {/* Buttons next to the dice */}
          {showButtons && (
            <div className="flex flex-col space-y-4">
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
            </div>
          )}
        </div>

        {/* Leaderboard */}
        <div className="w-full overflow-auto max-h-60 bg-gray-700 rounded-lg p-2">
          <h3 className="text-center text-lg font-bold text-white">
            Leaderboard
          </h3>
          <table className="w-full mt-4 text-sm text-white">
            <thead>
              <tr>
                <th className="px-4 py-2">Player</th>
                <th className="px-4 py-2">Position</th>
                <th className="px-4 py-2">Change</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, idx) => {
                const positionChange = entry.position - entry.prevPosition;
                const changeColor =
                  positionChange > 0 ? "text-green-500" : "text-red-500";
                return (
                  <tr key={idx} className="text-center">
                    <td className="px-4 py-2">{entry.player}</td>
                    <td className="px-4 py-2">{entry.position}</td>
                    <td className={`px-4 py-2 ${changeColor}`}>
                      {positionChange !== 0 &&
                        (positionChange > 0
                          ? `+${positionChange}`
                          : positionChange)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Half */}
      <div className="flex items-center justify-center bg-gray-700">
        <div className="grid grid-cols-10 gap-1">
          {grid.flat().map((cell, index) => {
            const playersOnSquare = positions
              .map((position, i) => (position === cell.number ? i : -1))
              .filter((i) => i !== -1);

            let cellBgColor = "bg-gray-800";

            if (cell.ladderStart) {
              cellBgColor = "bg-green-500";
              if (cell.ladderEnd) {
                ladderOrSnakeEndColor = "bg-green-300";
              }
            }
            if (cell.snakeStart) {
              cellBgColor = "bg-red-500";
              if (cell.snakeEnd) {
                ladderOrSnakeEndColor = "bg-red-300"; 
              }
            }

            return (
              <div
                key={index}
                className={`flex flex-col justify-center items-center w-12 h-12 ${cellBgColor} border-2 border-black rounded`}
              >
                <span className="text-sm text-white">{cell.number}</span>
                {cell.ladderStart && (
                  <>
                    <span className="text-xl">🚪</span>
                  </>
                )}
                {cell.snakeStart && (
                  <>
                    <span className="text-xl">🐍</span>
                  </>
                )}                
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
    </div>
  );
}
