export default function Head({ score, bestScore,newGame }) {
  return (
    <div className="head">
      <div className="score">
        <h1 className="title">2048</h1>
        <div className="scores-container">
          <div className="score-container">{score}</div>
          <div className="best-container">{bestScore}</div>
        </div>
      </div>
      <div className="text">
        <p>Use the keyboard W,A,S,D or arrow keys on the computer side</p>
        <p>
          On your cell phone, swipe on the numbers. Merge the numbers to reach
          2048 squares!
        </p>
      </div>
      <div className="newGameButton" onClick={newGame}>
        New Game
      </div>
    </div>
  );
}
