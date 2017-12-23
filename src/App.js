import React, { Component } from "react";
import "./App.css";

import { createBoard, neighbourMineCount, expose } from "./Minesweeper";

const findTuple = (row, col) => t => t[0] === row && t[1] === col;

class App extends Component {
  state = {
    board: [],
    exposed: [],
    flagged: []
  };

  componentDidMount() {
    this.newGame();
  }

  newGame = () =>
    this.setState({
      board: createBoard(10, 20, 20),
      exposed: [],
      flagged: []
    });

  isExposed = (row, col) =>
    this.state.exposed.find(findTuple(row, col)) != null;

  isFlagged = (row, col) =>
    this.state.flagged.find(findTuple(row, col)) != null;

  display = (exposed, isBomb, isFlagged, mineCount) => {
    if (!exposed) {
      if (isFlagged) {
        return "🚩";
      } else {
        return "";
      }
    } else if (isBomb) {
      return "💣";
    } else if (mineCount > 0) {
      return mineCount;
    } else {
      return "";
    }
  };

  expose = (row, col) =>
    this.setState(state => ({
      exposed: expose(state.board, state.exposed, row, col)
    }));

  flag = (row, col) => {
    this.setState(old => {
      if (old.flagged.find(t => t[0] === row && t[1] === col)) {
        return {
          flagged: old.flagged.filter(t => !(t[0] === row && t[1] === col))
        };
      } else {
        return {
          flagged: [...old.flagged, [row, col]]
        };
      }
    });
  };

  isLost = () =>
    this.state.exposed.map(x => this.state.board[x[0]][x[1]]).find(x => x) !=
    null;

  handleClick = (ev, row, col) => {
    ev.preventDefault();
    if (this.isLost()) {
      return;
    }
    if (ev.type === "click") {
      this.expose(row, col);
    } else if (ev.type === "contextmenu") {
      this.flag(row, col);
    }
  };

  render() {
    const { board = [] } = this.state;
    return (
      <div>
        <h1>Functional Minesweeper</h1>
        {this.isLost() && <h2>You lose!</h2>}
        <div className="board">
          {board.map((x, row) => (
            <div key={row} className="row">
              {x.map((isBomb, col) => (
                <div
                  key={col}
                  className={`col ${this.isExposed(row, col) ? "exposed" : ""}`}
                  onClick={ev => this.handleClick(ev, row, col)}
                  onContextMenu={ev => this.handleClick(ev, row, col)}
                >
                  {this.display(
                    this.isExposed(row, col),
                    isBomb,
                    this.isFlagged(row, col),
                    neighbourMineCount(board, row, col)
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
        <button onClick={() => this.newGame()}>Reset</button>
      </div>
    );
  }
}

export default App;
