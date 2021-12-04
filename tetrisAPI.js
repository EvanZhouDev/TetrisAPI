const _ = require("lodash");
const Array2D = require("array2d");
const wallKick = require("./wallkick.json");

let settings = {
	lockDelay: 500,
};

class Tetris {
	constructor(width, height) {
		this.piece = null;
		this.stationary = Array2D.build(width, height, null);
	}

	clone() {
		return _.cloneDeep(this);
	}

	summonPiece(piece) {
		if (Array2D.check(piece.shape)) {
			this.piece = piece;
		} else {
			console.error("Make sure that 'piece.shape' has 2D array!");
		}
		return this;
	}

	destroyPiece() {
		this.piece = null;
	}

	flatten() {
		if (this.piece !== null) {
			let returnBoard = Array2D.clone(this.stationary); // Creates a new array to work with
			// Renames some variables
			let shape = this.piece.shape;
			let pos = this.piece.pos;

			// For each cell of array
			shape.forEach((v1, i1) => {
				v1.forEach((_v2, i2) => {
					if (
						pos.y + i1 < returnBoard.length &&
						pos.y + i1 >= 0 && // If valid y location
						pos.x + i2 < returnBoard[0].length && // If valid x location
						shape[i1][i2] !== 0 // If the current space of the board is able to be replaced
					) {
						returnBoard[pos.y + i1][pos.x + i2] = shape[i1][i2]; // Append a shape onto the board
					}
				});
			});
			// Return the new appened board
			return returnBoard;
		} else {
			return this.stationary;
		}
	}

	gravity() {
		if (
			this.piece.movePiece(
				{ x: 0, y: 1 },
				true,
				cellCollider(
					this.stationary,
					["overlap", "bottom"],
					this.piece.pos.x,
					this.piece.pos.y,
					this.piece.shape,
					true
				)
			) == false
		) {
			console.log("new piece!");
		}
	}
}

class Tick {
	constructor(tickUpdate, frameUpdate, tickSpeed) {
		this.active = true;
		this.tickUpdate = tickUpdate;
		this.frameUpdate = frameUpdate;
		this.tickSpeed = tickSpeed;
	}

	start() {
		console.log("hi");
		if (this.active) {
			requestAnimationFrame(() => this.start());
		}
	}

	setActive(bool) {
		this.active = bool;
		if (bool) {
			this.start();
		}
	}
}

// CellCollider
let cellCollider = (
	main,
	check = ["overlap", "sides"],
	x,
	y,
	arr,
	returnBool = false
) => {
	check.forEach((x) => {
		if (!["overlap", "sides", "left", "right", "bottom", "top"].includes(x)) {
			console.error(
				"'" +
					x +
					'\' is not a valid parameter. Valid checks are: ["overlap", "sides", "left", "right", "bottom", "top"]'
			);
		}
	});
	// Status, returned at end
	let status = {};

	// Checks if the array is overlapping with main array
	for (let [i, v] of arr.entries()) {
		for (let [j, v2] of v.entries()) {
			if (check.includes("overlap")) {
				if (arr[i][j] !== 0) {
					let boardX = x + j;
					let boardY = y + i;

					// Checks left border overlap
					if (boardX < 0) {
						status.overlap = true;
					}

					// Checks right border overlap
					if (boardX + 1 > main[0].length) {
						status.overlap = true;
					}

					// Checks top border overlap
					if (boardY < 0) {
						status.overlap = true;
					}

					// Checks bottom border overlap
					if (boardY + 1 > main.length) {
						status.overlap = true;
					}

					// Checks cell overlap if position is not illegal
					if (Array.isArray(main[boardY]) && 0 <= boardX <= main[0].length) {
						if (main[boardY][boardX] !== 0) {
							status.overlap = true;
						}
					}
				}
			}

			if (v2 !== 0) {
				// Finds the position of the cell
				let boardX = x + j;
				let boardY = y + i;
				// Checks left border overlap
				if (
					boardX - 1 < 0 &&
					(check.includes("left") || check.includes("side"))
				) {
					status.left = true;
				}

				// Checks right border overlap
				if (
					boardX + 1 > main[0].length - 1 &&
					(check.includes("right") || check.includes("side"))
				) {
					status.right = true;
				}

				// Checks top border overlap
				if (
					boardY - 1 < 0 &&
					(check.includes("top") || check.includes("side"))
				) {
					status.top = true;
				}

				// Checks bottom border overlap
				if (
					boardY + 1 > main.length - 1 &&
					(check.includes("bottom") || check.includes("side"))
				) {
					status.bottom = true;
				}

				// Only do the following checks if position is valid
				// Checks left collision
				if (
					!(boardX - 1 < 0) &&
					(check.includes("left") || check.includes("side"))
				) {
					if (main[boardY][boardX - 1] !== 0) {
						status.left = true;
					}
				}

				// Checks right collision
				if (
					!(boardX + 1 > main[0].length - 1) &&
					(check.includes("right") || check.includes("side"))
				) {
					if (main[boardY][boardX + 1] !== 0) {
						status.right = true;
					}
				}

				// Checks top collision
				if (
					Array.isArray(main[boardY - 1]) &&
					(check.includes("top") || check.includes("side"))
				) {
					if (main[boardY - 1][boardX] !== 0) {
						status.top = true;
					}
				}

				// Checks bottom collision
				if (
					Array.isArray(main[boardY + 1]) &&
					(check.includes("bottom") || check.includes("side"))
				) {
					if (main[boardY + 1][boardX] !== 0) {
						status.bottom = true;
					}
				}
			}
		}
	}

	// If returns only a boolean
	if (returnBool == true) {
		return Object.keys(status).length !== 0;
	} else {
		// otherwise return entire status
		return status;
	}
};

class PieceNotation {
	/**
	 *
	 * @param {[][]} shape The shape of the piece
	 * @param {{x, y}} position Object with x and y
	 * @param {String} id Identifier of the piece
	 * @param {Tetris} tetris The main root of the game
	 */
	constructor(shape, position, id, tetris) {
		this.shape = shape;
		this.pos = position;
		this.id = id;
		this.rotation = 0;
		this.tetris = tetris;
		this.ROTATIONS = [];
		this.createRotations();
	}

	// Creates rotations. Private function, called once on init
	createRotations() {
		let rotatedShape = Array2D.clone(this.shape);
		this.ROTATIONS.push(this.shape);
		for (let i = 0; i < 3; i++) {
			rotatedShape = Array2D.rrotate(rotatedShape);
			this.ROTATIONS.push(rotatedShape);
		}
	}

	rotate(right) {
		// true for right, false for left
		console.log(this.tetris.stationary);
		let prevRotation = this.rotation;
		let rotationIndex;

		// If turning right
		if (right) {
			// Increment rotation index
			rotationIndex = this.rotation + 1;

			// If number is more than 3, then finds i % 4
			if (rotationIndex >= 4) {
				rotationIndex = rotationIndex % 4;
			}
		} else {
			// If turning left
			// Decrement rotation index
			rotationIndex = this.rotation - 1;
			if (rotationIndex == -1) {
				rotationIndex = 3;
			}
		}

		let testRotation = _.clone(this.ROTATIONS[rotationIndex]);

		// If piece is under Tetris guidlines (has a wallkick object)
		if (this.id !== undefined) {
			if (this.id == "o") {
				// There is no wall kick, rotation can be "ignored"
				this.shape = this.ROTATIONS[rotationIndex];
				this.rotation = rotationIndex;
			}
			// See if current position is valid
			if (
				!cellCollider(
					this.tetris.stationary,
					["overlap"],
					this.pos.x,
					this.pos.y,
					testRotation,
					true
				)
			) {
				// Sets shape to the rotation
				this.shape = this.ROTATIONS[rotationIndex];
				this.rotation = rotationIndex;
			} else {
				// Otherwise
				let wallKickObj =
					this.id == "i"
						? wallKick.i["" + prevRotation + "" + rotationIndex]
						: wallKick.general["" + prevRotation + "" + rotationIndex];

				// "i" piece has special wall kick object
				// Repeat for all valid checks, default should be 5
				for (let i = 0; i < Object.keys(wallKickObj).length; i++) {
					if (
						!cellCollider(
							this.tetris.stationary,
							["overlap", "sides"],
							this.pos.x + wallKickObj[i + 1][0],
							this.pos.y + wallKickObj[i + 1][1],
							testRotation,
							true
						)
					) {
						// If the position works, then translate the piece to corresponding coordinates
						this.pos.x += wallKickObj[i + 1][0];
						this.pos.y += wallKickObj[i + 1][1];

						// Actually rotates piece because position is valid
						this.shape = this.ROTATIONS[rotationIndex];

						this.rotation = rotationIndex;

						// If the position works, then there is no need to check further, as checks are designed that way
						break;
					}
				}
			}
		}
	}

	// Moves the piece FROM its original position
	movePiece(
		pos,
		checkValid = true,
		customCollider = cellCollider(
			this.tetris.stationary,
			["overlap", "sides"],
			this.pos.x,
			this.pos.y,
			this.shape,
			true
		)
	) {
		return this.setPos(
			{ x: this.pos.x + pos.x, y: this.pos.y + pos.y },
			checkValid,
			customCollider
		);
	}

	// Moves the piece TO pos
	setPos(
		pos,
		checkValid = true,
		customCollider = cellCollider(
			this.tetris.stationary,
			["overlap", "sides"],
			this.pos.x,
			this.pos.y,
			this.shape,
			true
		)
	) {
		console.log(this.tetris);
		if (checkValid) {
			if (!customCollider) {
				this.pos.x = pos.x;
				this.pos.y = pos.y;
				return this;
			} else {
				return false;
			}
		} else {
			this.pos.x = pos.x;
			this.pos.y = pos.y;
			return this;
		}
	}
}

class Position {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

class TetrisRenderer {}

module.exports = {
	Tetris: Tetris,
	Tick: Tick,
	Position: Position,
	PieceNotation: PieceNotation,
};
