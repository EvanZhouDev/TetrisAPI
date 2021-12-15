import _ from "lodash";
import { Tetris } from "../tetrisAPI";
function getEveryPossiblePos(board, piece) {
    let output = [];
    const testBoard = new Tetris(board[0].length, board.length);
    testBoard.summon(piece);
    testBoard.piece.move("very left");
    let before = null;
    let moves = [];
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
function getFirstNonEmptyRow(board) {
    // Go top-down to the first non-empty row
    for (let row = 1; row++; row < board.length) {
        if (board[row].some(_.identity)) {
            return board[row];
        }
    }
}
export function ai(board, piece) {
    let output = new Map();
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
