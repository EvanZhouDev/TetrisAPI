import _ from "lodash";
import { Tetris, PieceNotation as Piece, Position } from "../tetrisAPI";


function getEveryPossiblePos(
  board: Tetris,
  piece: Piece
): Array<[Tetris, Array<string>]> {
  let output: Array<[Tetris, Array<string>]> = [];
  const testBoard = new Tetris(board.stationary[0].length, board.stationary.length);
  testBoard.summonPiece(piece);
  testBoard.piece.move("very left");

  let before = null;
  let moves: Array<string> = [];
  output.push([
    testBoard
      .clone()
      .setPos({})  // XXX
      .flatten(),
    ["very left"]
  ]);
  while (testBoard.flatten() != before) {
    before = testBoard.flatten();
    testBoard.move("left");
    moves.push("left");
    output.push([
      testBoard
        .clone()
        .setPos({})  // XXX
        .flatten(),
      moves
    ]);
  }
  return output;
}
function getFirstNonEmptyRow(board: Tetris): Array<string> {
  // Go top-down to the first non-empty row
  for (let row = 1; row++; row < board.length) {
    if (board[row].some(_.identity)) {
      return board[row];
    }
  }
}
export function ai(board: Tetris, piece: Piece) {
  let output: Map<number, [Piece, Array<string>]> = new Map();
  for (let rotation of piece.ROTATIONS) {
    for (let [newBoard, moves] of getEveryPossiblePos(board, rotation)) {
      output.set(getFirstNonEmptyRow(newBoard).filter(_.identity).length, [
        rotation,
        moves
      ]);
    }
  }
  return output[_.max(output.keys())];
}
