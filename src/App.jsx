// src/App.jsx
import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const BUTTONS = [
  ["7", "8", "9", "÷", "(", ")"],
  ["4", "5", "6", "×", "x²", "x³"],
  ["1", "2", "3", "-", "√", "^"],
  ["0", ".", "π", "+", "=", "AC"],
  ["sin", "cos", "tan", "sec", "csc", "cot"],
];

function App() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [solutions, setSolutions] = useState([]);
  const [dark, setDark] = useState(() =>
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  const preprocess = (text) =>
    text
      .replace(/÷/g, "/")
      .replace(/×/g, "*")
      .replace(/π/g, "pi")
      .replace(/√/g, "√")
      .replace(/x²/g, "x²")
      .replace(/x³/g, "x³");

  function handleButton(val) {
    if (val === "AC") {
      setInput("");
      setResult("");
      setSolutions([]);
    } else if (val === "=") {
      sendToBackend(input);
    } else {
      setInput((prev) => prev + val);
    }
  }
  function sendToBackend(text) {
    axios
      .post("/calculate", { expression: preprocess(text) })
      .then((res) => {
        setResult(res.data.result || "");
        setSolutions(res.data.solutions || []);
        if (res.data.error) setResult("Error: " + res.data.error);
      })
      .catch((e) => setResult("Error: " + e.toString()));
  }

  function handleSolveForX() {
    sendToBackend(input.includes("=") ? input : input + "=0");
  }

  function handleDarkMode() {
    setDark((d) => !d);
  }
  React.useEffect(() => {
    document.body.className = dark ? "dark" : "light";
  }, [dark]);

  return (
    <div className={`calculator-wrap ${dark ? "dark" : "light"}`}>
      <div className="top-row">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter expression or equation"
          className="main-input"
          spellCheck={false}
        />
        <button className="dark-switch" onClick={handleDarkMode}>
          {dark ? "🌞 Light" : "🌚 Dark"}
        </button>
      </div>
      <div className="result-box">
        {result && <pre className="result">{result}</pre>}
        {solutions.length > 0 && (
          <div className="solutions">
            {solutions.map((s, i) => (
              <pre key={i}>x{i + 1} = {s}</pre>
            ))}
          </div>
        )}
      </div>
      <div className="buttons-grid">
        {BUTTONS.flatMap((row, r) =>
          row.map((b, c) => (
            <button
              key={b + "" + r + c}
              className={
                b === "="
                  ? "btn green"
                  : b === "AC"
                  ? "btn red"
                  : "btn"
              }
              onClick={() => handleButton(b)}
            >
              {b}
            </button>
          ))
        )}
      </div>
      <button className="solve-x-btn" onClick={handleSolveForX}>
        Solve for x
      </button>
      <footer style={{ textAlign: "center", fontSize: 12, opacity: 0.7, marginTop: 6 }}>
        Powered by Flask + React + SymPy - Modern Calculator
      </footer>
    </div>
  );
}

export default App;
