import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

// Component for dispaying a cell
function Square({ value, handleClick }) {
  return (
    <button className="square" onClick={handleClick}>
      {value}
    </button>
  );
}

// Component for the main playing field 
function Board({ squares, handleClick }) {
  function renderSquare(i) {
    return <Square value={squares[i]} handleClick={() => handleClick(i)} />;
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
}

// Main logic of game
function Game() {
  // State for save an array of cells
  const [squares, setSquares] = useState(Array(9).fill(null));
  // State to save an array of clicked cells for history
  const [history, setHistory] = useState([{ squares }]);
  // State to determine the next X or O
  const [xIsNext, setXIsNext] = useState(true);
  // State for return to certain move
  const [stepNumber, setStepNumber] = useState(0);

  function handleClick(i) {
    const newHistory = history.slice(0, stepNumber + 1);
    const current = newHistory[newHistory.length - 1];
    const newSquares = current.squares.slice();

    // Determining the end of the game
    if (calculateWinner(newSquares) || newSquares[i]) {
      return;
    }

    newSquares[i] = xIsNext ? "X" : "O";

    // Records of updated data to states
    setHistory(newHistory.concat([{ squares: newSquares }]));
    setSquares(newSquares);
    setStepNumber(newHistory.length);
    setXIsNext(!xIsNext);
  }

  // Returning to a certain move of history
  function jumpTo(step) {
    setStepNumber(step), setXIsNext(step % 2 === 0);
  }

  const current = history[stepNumber];
  const winner = calculateWinner(current.squares);

  const moves = history.map((step, move) => {
    const desc = move ? "Go to move #" + move : "Go to game start";
    
    // Show list of doing moves
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{desc}</button>
      </li>
    );
  });

  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <div className="game">
      <div className="game-board">
        <div>{status}</div>
        <Board squares={current.squares} handleClick={(i) => handleClick(i)} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

// Determinig of winner
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
