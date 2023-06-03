import { useState } from "react";
import "./App.css";
import Board from "./components/Board";
import Head from "./components/head";


function App() {
  const initialMatrix = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [2, 0, 0, 0],
    [0, 0, 0, 2],
  ];

  const [matrix, setMatrix] = useState(initialMatrix);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  const [isShow,setIsShow]=useState(false)

  function getPosition(row_index, col_index) {
    return `title-position-${row_index}-${col_index} `;
  }
  function getValColor(val) {
    return `tile-${val}`;
  }
  function newTile(row, col, newNumberIndex) {
    if (row === newNumberIndex[0] && col === newNumberIndex[1]) {
      return "new-tile";
    } else {
      return "";
    }
  }

  function mergeTile(row, col, mergeIndex) {
    let len = mergeIndex.length;
    let flag = false;
    if (len === 0) {
      return "";
    }
    for (let i = 0; i < len; i++) {
      if (mergeIndex[i][0] === row && mergeIndex[i][1] === col) {
        flag = true;
      }
    }
    if (flag) {
      return "merge-tile";
    }
  }
  return (
    <div className="main" onKeyDown={(e) => handleKeyDown(e)}>
      <Head score={score} bestScore={bestScore} />
      <Board
        matrix={matrix}
        getPosition={getPosition}
        getValColor={getValColor}
        newTile={newTile}
        mergeTile={mergeTile}
      />
    </div>
  );
}

export default App;
