export default function move(
  matrix,
  direction,
  score,
  bestScore,
  newNumberIndex
) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  let mergeIndexList = [];
  let reScore = score;
  let reBestScore = bestScore;
  let reNewNumberIndex = [];
  let reIsShow = false;
  let reMatrix = null;
  let reMergeNumberIndex = [];

  // Helper function to check if a given position is within the matrix bounds
  function _inRange(i, j) {
    return matrix[i] && matrix[i][j] !== undefined;
  }

  // Object with functions to calculate the next position based on direction
  const next = {
    up: (i, j) => [i + 1, j],
    down: (i, j) => [i - 1, j],
    left: (i, j) => [i, j + 1],
    right: (i, j) => [i, j - 1],
  };

  // Recursive function to calculate the values after a move
  function _cal(i, j) {
    if (!_inRange(i, j)) {
      return;
    }

    // Find the next non-zero value in the given direction
    const result = _getNextNotZeroValue(i, j);
    if (!result) {
      return;
    }
    const [nextI, nextJ, nextValue] = result;

    if (matrix[i][j] === 0) {
      // Move the next value to the current position
      matrix[i][j] = nextValue;
      matrix[nextI][nextJ] = 0;
      _cal(i, j);
    } else if (matrix[i][j] === nextValue) {
      // Merge the current value with the next value
      matrix[i][j] += nextValue;

      // Update the scores
      if (matrix[i][j] > score) {
        reScore = matrix[i][j];
      }
      if (matrix[i][j] > bestScore) {
        reBestScore = matrix[i][j];
      }

      matrix[nextI][nextJ] = 0;
      mergeIndexList.push([i, j]);
    }

    // Recursively calculate the next position
    _cal(...next[direction](i, j));
  }

  // Perform the movement based on the specified direction
  if (direction === "up") {
    for (let j = 0; j < cols; j++) {
      _cal(0, j);
    }
  } else if (direction === "down") {
    for (let j = 0; j < cols; j++) {
      _cal(rows - 1, j);
    }
  } else if (direction === "left") {
    for (let i = 0; i < rows; i++) {
      _cal(i, 0);
    }
  } else {
    for (let i = 0; i < rows; i++) {
      _cal(i, rows - 1);
    }
  }

  // Helper function to find the next non-zero value in a given direction
  function _getNextNotZeroValue(i, j) {
    let [nextI, nextJ] = next[direction](i, j);
    while (_inRange(nextI, nextJ)) {
      const nextValue = matrix[nextI][nextJ];
      if (nextValue) {
        return [nextI, nextJ, nextValue];
      } else {
        [nextI, nextJ] = next[direction](nextI, nextJ);
      }
    }
  }

  // Generate a new number and check if the game is over
  function _newNumber(newNumberIndex) {
    if (_isFull(matrix)) {
      // Randomly generate a new number in an empty cell
      const row = Math.floor(Math.random() * rows);
      const col = Math.floor(Math.random() * cols);
      if (matrix[row][col] === 0) {
        matrix[row][col] = 2;
        reNewNumberIndex = [row, col];
      } else {
        _newNumber(newNumberIndex);
      }
    } else {
      isOver();
    }

    // Check if the matrix is full
    function _isFull(matrix) {
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          if (matrix[i][j] === 0) {
            return true;
          }
        }
      }
      return false;
    }

    // Check if the game is over
    function isOver() {
      let time = 0;

      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          if (matrix[i][j] === 0) {
            return;
          } else {
            if (_findAround(i, j)) {
              time++;
            } else {
              return;
            }
          }
        }
      }

      // Check if there are any valid moves left
      function _findAround(i, j) {
        let flag = 4;
        let result = 0;

        if (!_isRange(i, j + 1)) {
          flag--;
        }
        if (!_isRange(i, j - 1)) {
          flag--;
        }
        if (!_isRange(i - 1, j)) {
          flag--;
        }
        if (!_isRange(i + 1, j)) {
          flag--;
        }

        if (_isRange(i, j + 1) && _isSame([i, j], [i, j + 1])) {
          result++;
        }
        if (_isRange(i, j - 1) && _isSame([i, j], [i, j - 1])) {
          result++;
        }
        if (_isRange(i + 1, j) && _isSame([i, j], [i + 1, j])) {
          result++;
        }
        if (_isRange(i - 1, j) && _isSame([i, j], [i - 1, j])) {
          result++;
        }

        return flag === result;
      }

      // Check if the given position is within the matrix bounds
      function _isRange(i, j) {
        return matrix[i] && matrix[i][j] !== undefined;
      }

      // Check if the values at the given positions are the same
      function _isSame(pre, next) {
        if (
          matrix[next[0]][next[1]] !== 0 &&
          matrix[next[0]][next[1]] !== matrix[pre[0]][pre[1]]
        ) {
          return true;
        } else {
          return false;
        }
      }

      if (time === rows * cols) {
        reIsShow = true;
      }
    }
  }

  // Generate a new number and update the result variables
  _newNumber(newNumberIndex);
  reMatrix = [...matrix];
  reMergeNumberIndex = [...mergeIndexList];

  return {
    reScore,
    reBestScore,
    reNewNumberIndex,
    reIsShow,
    reMatrix,
    reMergeNumberIndex,
  };
}
