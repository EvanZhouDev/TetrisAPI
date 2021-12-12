const _ = require("lodash");
const Array2D = require("array2d");
const wallKick = require("./wallkick.json");
let config;

config = {
	lockDelay: 500,
	color: {
		i: ["#20FFF2", "#9CFFF9"], // i shape
		ml: ["#4E5FFF", "#A5ADFF"], // ml shape
		l: ["#FCBF24", "#FECE54"], // l shape
		o: ["#F0FE53", "#EAEDC6"], // o shape
		s: ["#4EFF75", "#98FEAF"], // s shape
		t: ["#9C4EFF", "#C99EFF"], // t shape
		z: ["#FF4E4E", "#FFA8A8"], // z shape
	},
	blockWidth: 16,
};

const defaults = {
	speedUnit: {
		1: 0.01667,
		2: 0.021017,
		3: 0.026977,
		4: 0.035256,
		5: 0.04693,
		6: 0.06361,
		7: 0.0879,
		8: 0.1236,
		9: 0.1775,
		10: 0.2598,
		11: 0.388,
		12: 0.59,
		13: 0.92,
		14: 1.46,
		15: 2.36,
	},
	shapes: {
		i: [
			[0, 0, 0, 0],
			[1, 1, 1, 1],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
		],
		ml: [
			[2, 0, 0],
			[2, 2, 2],
			[0, 0, 0],
		],
		l: [
			[0, 0, 3],
			[3, 3, 3],
			[0, 0, 0],
		],
		o: [
			[4, 4],
			[4, 4],
		],
		s: [
			[0, 5, 5],
			[5, 5, 0],
			[0, 0, 0],
		],
		t: [
			[0, 6, 0],
			[6, 6, 6],
			[0, 0, 0],
		],
		z: [
			[7, 7, 0],
			[0, 7, 7],
			[0, 0, 0],
		],
	},
	spawnLocations: {
		i: { x: 3, y: 16 },
		ml: { x: 2, y: 16 },
		l: { x: 2, y: 16 },
		o: { x: 4, y: 16 },
		s: { x: 2, y: 16 },
		t: { x: 2, y: 16 },
		z: { x: 2, y: 16 },
	},
	controls: {
		left: "ArrowLeft",
		right: "ArrowRight",
		rotateRight: "ArrowUp",
		hard: " ",
	},
};

class Tetris {
	constructor(
		width = 10,
		height = 40,
		standard = true,
		controls = defaults.controls,
		hideTop = undefined
	) {
		this.standard = standard;
		this.pieceBag = ["i", "ml", "l", "o", "s", "t", "z"];
		this.piece = null;
		this.stationary = Array2D.build(width, height, 0);
		this.controls = controls;
		this.refresh = true;
		this.hideTop = hideTop;
		this.activeDelay = null;
		if (this.hideTop == undefined) {
			if (height >= 40) {
				this.hideTop = true;
			}
		}
		this.activeListeners = {};
	}

	addEventListener(type, callback) {
		let validListeners = ["FailedRotation"];
		if (validListeners.includes(type)) {
			this.activeListeners.type = callback;
		}
	}

	clone() {
		return _.cloneDeep(this);
	}

	summonPiece(summon = undefined) {
		if (summon !== undefined) {
			if (Array2D.check(summon.shape)) {
				this.piece = summon;
			} else {
				console.error("Make sure that 'piece.shape' has 2D array!");
			}
		}
		if (this.standard) {
			if (summon == undefined) {
				let index = Math.floor(Math.random() * this.pieceBag.length);
				let name = this.pieceBag[index];
				let item = defaults.shapes[name];
				console.log(item);
				this.pieceBag.splice(index, 1);
				if (this.pieceBag.length == 0) {
					console.log("refilled");
					this.pieceBag = ["i", "ml", "l", "o", "s", "t", "z"];
				}
				console.log(defaults.spawnLocations);
				console.log(new PieceNotation(
					item,
					_.cloneDeep(defaults.spawnLocations[name]),
					name,
					this
				));
				this.piece = new PieceNotation(
					item,
					_.cloneDeep(defaults.spawnLocations[name]),
					name,
					this
				);
			}
		}
		return this;
	}

	destroyPiece() {
		this.piece = null;
	}

	flatten(type = "full") {
		if (this.piece !== null) {
			let returnBoard = _.cloneDeep(this.stationary); // Creates a new array to work with
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
						returnBoard[pos.y + i1][pos.x + i2] = this.piece.id; // Append a shape onto the board
					}
				});
			});
			// Return the new appened board
			if (this.hideTop) {
				if (type == "standard") {
					return _.cloneDeep(returnBoard.slice(19, 40));
				} else if (type == "full") {
					return _.cloneDeep(returnBoard);
				} else if (type !== "full") {
					console.error(
						'Please enter either "standard" or "full" for flatten type.'
					);
				}
			} else {
				return _.cloneDeep(returnBoard);
			}
		} else {
			if (this.hideTop) {
				if (type == "standard") {
					return _.cloneDeep(this.stationary.slice(19, 40));
				} else if (type == "full") {
					return _.cloneDeep(this.stationary);
				} else if (type !== "full") {
					console.error(
						'Please enter either "standard" or "full" for flatten type.'
					);
				}
			} else {
				return _.cloneDeep(returnBoard);
			}
		}
	}

	gravity(piece = undefined, check = false, useLockDelay = true) {
		if (
			this.activeDelay == null &&
			cellCollider(
				this.stationary,
				["overlap", "bottom"],
				this.piece.pos.x,
				this.piece.pos.y,
				this.piece.shape,
				true
			) == false
		) {
			clearTimeout(this.activeDelay);
		}
		if (!check) {
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
				console.log(this.stationary);
				this.refresh = false;
				if (useLockDelay) {
					this.activeDelay = setTimeout(() => {
						if (
							cellCollider(
								this.stationary,
								["overlap", "bottom"],
								this.piece.pos.x,
								this.piece.pos.y,
								this.piece.shape,
								true
							) == false
						) {
							this.refresh = true;
							return;
						}
						this.piece.y = this.piece.maxY();
						this.stationary = this.flatten();
						if (piece == undefined) {
							this.summonPiece();
						} else {
							this.summonPiece(piece);
						}

						this.refresh = true;
					}, config.lockDelay);
				} else {
					console.log("lockdelay gone");
					this.piece.y = this.piece.maxY();
					this.stationary = this.flatten();
					if (piece == undefined) {
						this.summonPiece();
					} else {
						this.summonPiece(piece);
					}
				}
			}
		}
	}

	appendControls(element) {
		element.addEventListener("keydown", (e) => {
			// console.log("hi")
			if (e.key === this.controls.left) {
				console.log("left");
				this.piece.movePiece(
					new Position(-1, 0),
					true,
					cellCollider(
						this.stationary,
						["left"],
						this.piece.pos.x,
						this.piece.pos.y,
						this.piece.shape,
						true
					)
				);
			} else if (e.key === this.controls.right) {
				console.log(
					cellCollider(
						this.stationary,
						["right"],
						this.piece.pos.x,
						this.piece.pos.y,
						this.piece.shape,
						true
					)
				);
				this.piece.movePiece(
					new Position(1, 0),
					true,
					cellCollider(
						this.stationary,
						["right"],
						this.piece.pos.x,
						this.piece.pos.y,
						this.piece.shape,
						true
					)
				);
				console.log(this.piece);
			} else if (e.key === this.controls.rotateLeft) {
				this.piece.rotate(false);
			} else if (e.key === this.controls.rotateRight) {
				this.piece.rotate(true);
			} else if (e.key === this.controls.hard) {
				console.log("hi");
				console.log(this.piece.maxY());
				this.piece.pos.y = this.piece.maxY();
				this.gravity(undefined, false, false);
			}

			this.gravity(undefined, true);
		});
	}
}

class Tick {
	constructor(tickUpdate, frameUpdate, tickSpeed = defaults.speedUnit[1]) {
		this.timeExists = 0;
		this.timeSimulated = 0;
		this.active = true;
		this.tickUpdate = tickUpdate;
		this.frameUpdate = frameUpdate;
		this.tickSpeed = tickSpeed;
	}

	start() {
		this.frameUpdate();
		this.timeExists += 1;
		while (this.timeExists > this.timeSimulated) {
			this.tickUpdate();
			this.timeSimulated += 1 / this.tickSpeed;
		}
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
					if (
						Array.isArray(main[boardY]) &&
						0 <= boardX &&
						boardX < main[0].length &&
						0 <= boardY &&
						boardY < main.length
					) {
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

	maxY = () => {
		// Finds lowest place piece can go from current y
		let maxY = this.pos.y;
		while (
			!cellCollider(
				this.tetris.stationary,
				["overlap", "bottom"],
				this.pos.x,
				maxY,
				this.shape,
				true
			)
		) {
			console.log("hi");
			maxY++;
		}
		return maxY;
	};

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

class TetrisRenderer {
	constructor(ctx, settings = undefined, tetris) {
		this.settings = settings;
		this.ctx = ctx;
		this.tetris = tetris;
	}

	render() {
		let board = this.tetris.flatten("standard");
		Array2D.eachCell(board, (v, i, j) => {
			// console.log(v, i, j);
			// beginPath to be able to switch colors
			this.ctx.beginPath();

			// Always draw a background of this color:
			this.ctx.fillStyle = "white";
			this.ctx.rect(
				j * config.blockWidth,
				i * config.blockWidth,
				config.blockWidth,
				config.blockWidth
			);
			this.ctx.fill();

			// If the value of the cell isn't 0:
			if (v !== 0) {
				this.ctx.lineWidth = config.blockWidth / 6;

				// If value is more than 7 (ghost cell), then set the color to value-7
				if (v > 7) {
					// Sets color
					this.ctx.fillStyle = config.color[v - 7][0];
					this.ctx.strokeStyle = config.color[v - 7][1] + "7D";
				} else {
					// Sets color
					this.ctx.fillStyle = config.color[v][0];
					this.ctx.strokeStyle = config.color[v][1];
				}

				// Draws the roundedRect of corresponding color
				this.ctx.rect(
					j * config.blockWidth,
					i * config.blockWidth,
					config.blockWidth,
					config.blockWidth
				);

				// Strokes and fills with clip and restore in order to have inner border
				this.ctx.save();
				this.ctx.clip();
				this.ctx.lineWidth *= 2;
				// if (v <= 7) {
				this.ctx.fill();
				// }
				this.ctx.stroke();
				this.ctx.restore();
			}
		});
	}
}

module.exports = {
	Tetris: Tetris,
	Tick: Tick,
	Position: Position,
	PieceNotation: PieceNotation,
	TetrisRenderer: TetrisRenderer,
	defaults: defaults,
	config: config,
};
