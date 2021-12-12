let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let t = require("../tetrisAPI");

let tetris = new t.Tetris();
tetris.summonPiece();
tetris.appendControls(document);
let renderer = new t.TetrisRenderer(ctx, undefined, tetris);
let tick = new t.Tick(() => {tetris.gravity()}, () => {renderer.render()});
tick.start();

