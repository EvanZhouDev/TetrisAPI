import _ from "lodash";
import { Tetris, PieceNotation as Piece, Position } from "../tetrisAPI";
/**
 * A 2D-array representing a concrete state of a Tetris board
 */
export type Board = Array<Array<any>>;

/**
 * An enumeration of directions
 */
export type Direction =
  | "up"
  | "down"
  | "left"
  | "right"
  | "very left"
  | "very right"
  | "very down";
/**
 * An object representing a coordinate
 */
export interface Position {
  x: number;
  y: number;
}
/**
 * Represents a piece
 */
export interface PieceInterface {
  position: Position; // The position of the piece (e.g. {x: 0, y: 0})
  /* The shape of the piece. Example:
   *     [
   *         ["", "", "", ""],
   *         ["", "X", "X", ""],
   *         ["", "X", "X", ""],
   *         ["", "", "", ""],
   *     ]
   * for square.
   */
  shape: [[string]];
  /**
   * Returns a PieceInterface representing the piece rotated clockwise
   * @param {number} times - The number of times to rotate
   * @return {PieceInterface} The rotated piece
   */
  rotated(times: number): PieceInterface;
}
/**
 * A logic-only Tetris board
 */
export interface TetrisInterface {
  /**
   * Summon a piece onto the board
   * @return {TetrisInterface} This board. So we can chain methods
   */
  summon(piece: PieceInterface): TetrisInterface;
  /**
   * Move the last summoned piece
   * @return {TetrisInterface} This board. So we can chain methods
   */
  move(direction: Direction): TetrisInterface;
  /**
   * Shorthand for `this.move('very down').tick()`
   * @return {TetrisInterface} This board. So we can chain methods
   */
  hyperGravity(): TetrisInterface;
  /**
   * Refresh the animation. Should move a piece that is
   *     still hanging in the air down one unit.
   * @return {TetrisInterface} This board. So we can chain methods
   */
  tick(): TetrisInterface;
  /**
   * Convert this to a concrete representation.
   * @return {Board} A 2D-array version of the current state of this
   */
  flatten(): Board;

  /**
   * Clones the board
   * @return {TetrisInterface} The cloned board.
   *     If the clone is mutated, the original MUST stay the same
   */
  clone(): TetrisInterface;
}

function getEveryPossiblePos(
  board: Board,
  piece: Piece
): Array<[Board, Array<string>]> {
  let output: Array<[Board, Array<string>]> = [];
  const testBoard = new Tetris(board[0].length, board.length);
  testBoard.summon(piece);
  testBoard.piece.move("very left");

  let before = null;
  let moves: Array<string> = [];
  output.push([
    testBoard
      .clone()
      .hyperGravity()
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
        .hyperGravity()
        .flatten(),
      moves
    ]);
  }
  return output;
}
function getFirstNonEmptyRow(board: Board): Array<string> {
  // Go top-down to the first non-empty row
  for (let row = 1; row++; row < board.length) {
    if (board[row].some(_.identity)) {
      return board[row];
    }
  }
}
export function ai(board: Board, piece: Piece) {
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
