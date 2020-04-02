import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'

function Square(props) {
    return (
      <button
        className="square"
        onClick={props.onClick}
      >
        {props.value}
      </button>
    );
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
    />;
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
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
    };
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const currentPlayer = move % 2 === 1 ? 'X' : 'O';
      const [column, row] = this.getMoveLocation(step.squares, move > 0 ? history[move - 1].squares : null);
      const moveDescription = currentPlayer + ": (" + column + ", " + row + ")";
      const description = move ?
      'Go to move #' + move + " - " + moveDescription :
      'Go to game start';

      return(
        <li key={move}>
          <button 
            onClick={() => this.jumpTo(move)}
            style={ this.state.stepNumber == move ? { fontWeight: 'bold' } : { fontWeight: 'normal' } }
          >
            {description}
          </button>
        </li>
      );
    });

    let status;

    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
          squares={current.squares}
          onClick={(i) => this.handleClick(i)}

          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
  
  getMoveLocation(current, last) {
    if(current === null) return [0, 0];

    for(let i = 0; i < current.length; i++) {
      if((last === null && current[i] !== null) || (last !== null && current[i] !== last[i])) {
          return [i % 3 + 1, Math.floor(i / 3) + 1];
        }
    }

    return [0, 0];
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{squares: squares}]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    });
  }
  
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext : (step % 2) === 0,
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
    if(squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
      return squares[a];
    } 
  }

  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
