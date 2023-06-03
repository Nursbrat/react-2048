import { useEffect, useState } from "react";
import "./App.css";
import Board from "./components/Board";
import Head from "./components/head";
import move from "./utilits/move";
import GameOver from "./components/GameOver";

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
  const resultNumberIndex = [];
  const [mergeNumberIndex, setMergeNumberIndex] = useState(resultNumberIndex);
  const initNumberIndex = [];
  const [newNumberIndex, setNewNumberIndex] = useState(initNumberIndex);
  const [isShow, setIsShow] = useState(false);

  let startTime = "";
  let startDistanceX = "";
  let startDistanceY = "";
  let endTime = "";
  let endDistanceX = "";
  let endDistanceY = "";
  let moveTime = "";
  let moveDistanceX = "";
  let moveDistanceY = "";

  function startXY(e) {
    startTime = new Date().getTime();
    startDistanceX = e.touches[0].screenX;
    startDistanceY = e.touches[0].screenY;
  }

  function endXY(e) {
    endTime = new Date().getTime();
    endDistanceX = e.changedTouches[0].screenX;
    endDistanceY = e.changedTouches[0].screenY;
    moveTime = endTime - startTime;
    moveDistanceX = startDistanceX - endDistanceX;
    moveDistanceY = startDistanceY - endDistanceY;

    if (Math.abs(moveDistanceX) > 40 || Math.abs(moveDistanceY) > 40) {
      if (moveTime < 500) {
        let moveDirection;
        if (Math.abs(moveDistanceX) > Math.abs(moveDistanceY)) {
          moveDirection = moveDistanceX > 0 ? "left" : "right";
        } else {
          moveDirection = moveDistanceY > 0 ? "up" : "down";
        }

        const {
          reScore,
          reBestScore,
          reNewNumberIndex,
          reIsShow,
          reMatrix,
          reMergeNumberIndex,
        } = move(matrix, moveDirection, score, bestScore, newNumberIndex);

        respond(reScore, reBestScore, reNewNumberIndex, reIsShow, reMatrix, reMergeNumberIndex);
      }
    }
  }

  function respond(reScore, reBestScore, reNewNumberIndex, reIsShow, reMatrix, reMergeNumberIndex) {
    setScore(reScore);
    setBestScore(reBestScore);
    setMatrix(reMatrix);
    setNewNumberIndex(reNewNumberIndex);
    setIsShow(reIsShow);
    setMergeNumberIndex(reMergeNumberIndex);
  }

  function getDistance(item) {
    let box = document.querySelector(item);
    box.addEventListener("touchstart", startXY);
    box.addEventListener("touchend", endXY);
  }

  function removeGetDistance(item) {
    let box = document.querySelector(item);
    box.removeEventListener("touchstart", startXY);
    box.removeEventListener("touchend", endXY);
  }

  useEffect(() => {
    let flag = 0;
    const os = (() => {
      const ua = navigator.userAgent,
        isWindowsPhone = /(?:Windows Phone)/.test(ua),
        isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
        isAndroid = /(?:Android)/.test(ua),
        isFireFox = /(?:Firefox)/.test(ua),
        isChrome = /(?:Chrome|CriOS)/.test(ua),
        isTablet =
          /(?:iPad|PlayBook)/.test(ua) ||
          (isAndroid && !/(?:Mobile)/.test(ua)) ||
          (isFireFox && /(?:Tablet)/.test(ua)),
        isPhone = /(?:iPhone)/.test(ua) && !isTablet,
        isPc = !isPhone && !isAndroid && !isSymbian;
      return {
        isTablet: isTablet,
        isPhone: isPhone,
        isAndroid: isAndroid,
        isPc: isPc,
      };
    })();
    if (os.isPc) {
      document.addEventListener("keydown", handleKeyDown);
    } else {
      flag = 1;
      getDistance(".main");
    }
    return function cleanUp() {
      if (!flag) {
        document.removeEventListener("keydown", handleKeyDown);
      } else {
        removeGetDistance(".main");
      }
    };
  });

  function handleKeyDown(e) {
    let moveDirection;

    if (e.keyCode === 37 || e.keyCode === 65) {
      moveDirection = "left";
    } else if (e.keyCode === 38 || e.keyCode === 87) {
      moveDirection = "up";
    } else if (e.keyCode === 39 || e.keyCode === 68) {
      moveDirection = "right";
    } else if (e.keyCode === 40 || e.keyCode === 83) {
      moveDirection = "down";
    } else {
      return;
    }

    const {
      reScore,
      reBestScore,
      reNewNumberIndex,
      reIsShow,
      reMatrix,
      reMergeNumberIndex,
    } = move(matrix, moveDirection, score, bestScore, newNumberIndex);

    respond(reScore, reBestScore, reNewNumberIndex, reIsShow, reMatrix, reMergeNumberIndex);
  }

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

  function newGame() {
    const game = [];
    const gameIndex = [];

    for (let i = 0; i < matrix.length; i++) {
      game.push([]);
      for (let j = 0; j < matrix.length; j++) {
        game[i].push(0);
      }
    }

    _randomNewNumber(game);
    function _randomNewNumber(game) {
      let i = 0;
      while (i < 2) {
        const row = Math.floor(Math.random() * 4);
        const column = Math.floor(Math.random() * 4);

        if (game[row][column] === 0) {
          game[row][column] = 2;
          gameIndex.push([row, column]);
        } else {
          _randomNewNumber();
        }
        i++;
      }
    }

    setMatrix([...game]);
    setNewNumberIndex([...gameIndex]);
    setIsShow(false);
    setScore(0);
  }
  
  return (
    <div className="main" onKeyDown={(e) => handleKeyDown(e)}>
      <Head score={score} bestScore={bestScore} newGame={newGame} />
      <div className="game_interface">
        <div>
          {matrix.map((row, index) => {
            return (
              <div className="game_col" key={index}>
                {row.map((_, index) => {
                  return <div className="game_box_item" key={index}></div>;
                })}
              </div>
            );
          })}
        </div>
        <div className="tile-container">
          {matrix.map((row, row_index) => {
            return (
              <div className="row" key={row_index}>
                {row.map((col, col_index) => {
                  if (col !== 0) {
                    return (
                      <div
                        className={`tile  ${getPosition(
                          row_index + 1,
                          col_index + 1
                        )} `}
                      >
                        <div
                          className={`${newTile(
                            row_index,
                            col_index,
                            newNumberIndex
                          )} ${getValColor(col)} ${mergeTile(
                            row_index,
                            col_index,
                            mergeNumberIndex
                          )}`}
                        >
                          {col}
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
            );
          })}
      < GameOver isShow={isShow} newGame={newGame}/>
        </div>
      </div>
    </div>
  );
}

export default App;
