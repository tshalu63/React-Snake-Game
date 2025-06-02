import React, { useState, useEffect } from "react";
import "./App.css";

const getRandomCoordinates = () => {
  const min = 1;
  const max = 98;
  const x = Math.floor((Math.random() * (max - min) + min) / 2) * 2;
  const y = Math.floor((Math.random() * (max - min) + min) / 2) * 2;
  return [x, y];
};

function App() {
  const [snakeDots, setSnakeDots] = useState([[0, 0], [2, 0]]);
  const [food, setFood] = useState(getRandomCoordinates());
  const [direction, setDirection] = useState("RIGHT");
  const [speed, setSpeed] = useState(null);
  const [score, setScore] = useState(0);
  const [isGameRunning, setIsGameRunning] = useState(false);

  useEffect(() => {
    if (!isGameRunning) return;

    const handleKeyDown = (e) => {
      switch (e.keyCode) {
        case 38: setDirection("UP"); break;
        case 40: setDirection("DOWN"); break;
        case 37: setDirection("LEFT"); break;
        case 39: setDirection("RIGHT"); break;
        default: break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isGameRunning]);

  useEffect(() => {
    if (!isGameRunning) return;

    const move = () => {
      let dots = [...snakeDots];
      let head = dots[dots.length - 1];

      switch (direction) {
        case "RIGHT": head = [head[0] + 2, head[1]]; break;
        case "LEFT": head = [head[0] - 2, head[1]]; break;
        case "DOWN": head = [head[0], head[1] + 2]; break;
        case "UP": head = [head[0], head[1] - 2]; break;
        default: break;
      }

      dots.push(head);
      dots.shift();
      setSnakeDots(dots);
      checkCollision(head);
      checkIfEaten(head);
    };

    const interval = setInterval(move, speed);
    return () => clearInterval(interval);
  }, [snakeDots, direction, food, isGameRunning]);

  const checkCollision = (head) => {
    if (
      head[0] >= 100 || head[1] >= 100 ||
      head[0] < 0 || head[1] < 0 ||
      snakeDots.slice(0, -1).some(dot => dot[0] === head[0] && dot[1] === head[1])
    ) {
      setIsGameRunning(false);
      alert(`Game Over! Your Score: ${score}`);
      resetGame();
    }
  };

  const checkIfEaten = (head) => {
    if (head[0] === food[0] && head[1] === food[1]) {
      setFood(getRandomCoordinates());
      setSnakeDots(prev => [[...prev[0]], ...prev]);
      setScore(score + 1);
      if (speed > 50) setSpeed(speed - 10);
    }
  };

  const resetGame = () => {
    setSnakeDots([[0, 0], [2, 0]]);
    setFood(getRandomCoordinates());
    setDirection("RIGHT");
    setSpeed(null);
    setScore(0);
  };

  const startGame = () => {
    resetGame();
    setSpeed(150);
    setIsGameRunning(true);
  };

  return (
    <div className="wrapper">
      <h1>🐍 Snake Game</h1>
      <div className="controls">
        <button onClick={startGame}>
          {isGameRunning ? "Restart" : "Start Game"}
        </button>
        <div className="score">Score: {score}</div>
      </div>
      <div className="game-area">
        {snakeDots.map((dot, i) => (
          <div key={i} className="snake-dot" style={{
            left: `${dot[0]}%`,
            top: `${dot[1]}%`,
          }} />
        ))}
        <div className="snake-food" style={{
          left: `${food[0]}%`,
          top: `${food[1]}%`,
        }} />
      </div>
    </div>
  );
}

export default App;