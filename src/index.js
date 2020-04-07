import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'

function Square(props) {
  return (
    <button
      className="square"
      onClick={props.onClick}
      style={props.isWinningSquare ? { backgroundColor: 'yellow' } : null}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square
      value={this.props.squares[i]}
      isWinningSquare={this.props.winningSquares && this.props.winningSquares.includes(i)}
      onClick={() => this.props.onClick(i)}
    />;
  }

  render() {
    let squares = [];
    for (let row = 0; row < 3; row++) {
      let currentRow = [];
      for (let column = 0; column < 3; column++) {
        const index = row * 3 + column;
        currentRow.push(this.renderSquare(index));
      }
      squares.push(<div className="board-row" key={row}>{currentRow}</div>);
    }

    return <div>{squares}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      sortAscending: true,
    };
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const calculateWinnerResult = calculateWinner(current.squares);
    const winner = calculateWinnerResult ? calculateWinnerResult.winningSquares : null;
    const winningSquares = calculateWinnerResult ? calculateWinnerResult.winningSquares : null;

    const moves = history.map((step, move) => {
      const currentPlayer = move % 2 === 1 ? 'X' : 'O';
      const [column, row] = this.getMoveLocation(step.squares, move > 0 ? history[move - 1].squares : null);
      const moveDescription = currentPlayer + ": (" + column + ", " + row + ")";
      const description = move ?
        'Go to move #' + move + " - " + moveDescription :
        'Go to game start';

      return (
        <li key={move}>
          <button
            onClick={() => this.jumpTo(move)}
            style={this.state.stepNumber === move ? { fontWeight: 'bold' } : { fontWeight: 'normal' }}
          >
            {description}
          </button>
        </li>
      );
    });

    if (!this.state.sortAscending) {
      moves.reverse();
    }

    let status;

    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    const sortButtonText = 'Sort moves' + (this.state.sortAscending ? '⮝' : '⮟');

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winningSquares={winningSquares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.setState({ sortAscending: !this.state.sortAscending })}>{sortButtonText}</button>
          <ol reversed={!this.state.sortAscending}>{moves}</ol>
        </div>
      </div>
    );
  }

  getMoveLocation(current, last) {
    if (current === null) return [0, 0];

    for (let i = 0; i < current.length; i++) {
      if ((last === null && current[i] !== null) || (last !== null && current[i] !== last[i])) {
        return [i % 3 + 1, Math.floor(i / 3) + 1];
      }
    }

    return [0, 0];
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    const calculateWinnerResult = calculateWinner(squares)
    if ((calculateWinnerResult && calculateWinnerResult.winner) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{ squares: squares }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }
}

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
    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
      return {
        winner: squares[a],
        winningSquares: lines[i]
      };
    }
  }

  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
