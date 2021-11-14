const PieceNotation = require("./tetrisAPI.js");

test("PieceNotation.setRotate works", () => {
    let piece = new PieceNotation(
        [
            ["z", "z", ""],
            ["", "z", "z"],
            ["", "", ""],
        ],
        { x: 0, y: 0 }
    );
    console.log(piece);
    piece.setRotation(1);
    console.log(piece);
    expect(piece.shape).toEqual([
        ["", "", "z"],
        ["", "z", "z"],
        ["", "z", ""],
    ]);
});

test('PieceNotation.setRotation works', () => {
  expect(sum(1, 2)).toBe(3);
});
