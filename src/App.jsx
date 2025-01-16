import React, { useState } from "react";
import "./App.css";

const snakes = { 16: 6, 47: 26, 49: 11, 56: 53, 62: 19, 87: 24 };
const ladders = { 3: 22, 15: 44, 18: 39, 36: 54, 63: 81, 77: 97 };

const Board = ({ cells, players }) => (
  <div className="board">
    {cells.map((cell, index) => (
      <div
        key={index}
        className={`cell ${
          snakes[index] ? "snake" : ladders[index] ? "ladder" : ""
        }`}
      >
        {players
          .filter((player) => player.position === index)
          .map((player, idx) => (
            <div
              key={idx}
              className={`pawn player-${player.id}`}
              style={{
                left: `${idx * 10}px`,
              }}
            >
              {player.id + 1}
            </div>
          ))}
        {index}
      </div>
    ))}
  </div>
);

const App = () => {
  const [players, setPlayers] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [diceRoll, setDiceRoll] = useState(null);
  const [cells] = useState(Array.from({ length: 100 }, (_, i) => i));
  const [winner, setWinner] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);

  const startGame = (playerCount) => {
    const initialPlayers = Array.from({ length: playerCount }, (_, i) => ({
      id: i,
      position: 0,
    }));
    setPlayers(initialPlayers);
    setGameStarted(true);
  };

  const rollDice = () => {
    if (winner) return; // Stop rolling if there's a winner
    const roll = Math.floor(Math.random() * 6) + 1;
    setDiceRoll(roll);
  };

  const movePawn = () => {
    if (diceRoll === null || winner) return;

    const newPosition = Math.min(
      players[currentPlayer].position + diceRoll,
      99
    );
    const finalPosition =
      snakes[newPosition] || ladders[newPosition] || newPosition;

    const updatedPlayers = players.map((player, idx) =>
      idx === currentPlayer ? { ...player, position: finalPosition } : player
    );

    setPlayers(updatedPlayers);

    // Check for winner
    if (finalPosition === 99) {
      setWinner(`Player ${currentPlayer + 1}`);
    } else {
      setCurrentPlayer((prev) => (prev + 1) % players.length);
    }

    setDiceRoll(null);
  };

  const discardMove = () => {
    if (winner) return;
    setDiceRoll(null);
    setCurrentPlayer((prev) => (prev + 1) % players.length);
  };

  return (
    <div className="game-container">
      <h1>Snakes & Ladders</h1>
      {!gameStarted ? (
        <div className="start-menu">
          <h2>Select Number of Players</h2>
          <button onClick={() => startGame(2)}>2 Players</button>
          <button onClick={() => startGame(4)}>4 Players</button>
        </div>
      ) : (
        <>
          {winner ? (
            <h2 className="winner-message">{winner} Wins! 🎉</h2>
          ) : (
            <div className="controls">
              <button onClick={rollDice}>Roll Dice</button>
              {diceRoll !== null && (
                <>
                  <button onClick={movePawn}>Move {diceRoll} Steps</button>
                  <button onClick={discardMove}>Discard Move</button>
                </>
              )}
            </div>
          )}
          <div>Current Dice Roll: {diceRoll || "-"}</div>
          <Board cells={cells} players={players} />
        </>
      )}
    </div>
  );
};

export default App;
