import "../App.css";
import GameOver from "./GameOver";

export default function Board({
  matrix,
  getPosition,
  getValColor,
  newTile,
  mergeTile,
  newNumberIndex,
  newGame,
  isShow,
  // score,
  // bestScore
}) {
  return (
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
                    <div className={"title-position-3-2"} key={col_index}>
                      <div className={"tile-16"}>{col}</div>
                    </div>
                  );
                }
              })}
            </div>
          );
        })}
        <GameOver isShow={isShow} newGame={newGame} />
      </div>
    </div>
  );
}
