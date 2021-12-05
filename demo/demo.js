let TetrisAPI = require("../tetrisAPI");
let tetris = new TetrisAPI.Tetris(20, 40, {left: "ArrowLeft", right: "ArrowRight", rotateRight: "ArrowUp", hard: " "});
tetris.summonPiece(
	new TetrisAPI.PieceNotation(
		[
			[1, 1],
			[1, 1],
		],
		new TetrisAPI.Position(0, 36),
		"o",
		tetris
	)
);
// console.log(tetris.flatten());
tetris.appendControls(document);