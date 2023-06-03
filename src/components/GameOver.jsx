export default function GameOver({isShow,newGame}){

    return(
        <div className="gameOver" style={{ display: isShow ? "block" : "none" }}>
        <p>GameOver</p>
        <button onClick={newGame}>Play Again</button>
      </div>
    )
}