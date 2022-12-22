import { Field, Int64, UInt32, isReady, shutdown } from 'snarkyjs';
import { tic, toc } from './tictoc.js';
import { GameState, RpsGame } from './Rps.js';

await isReady;

const rock = UInt32.from(0);
const paper = UInt32.from(1);
// const scissors = UInt32.from(2)

tic('compiling');
await RpsGame.compile();
toc();

tic('proving (init)');
let gameScore0 = new GameState({
  scoreP1: Field(0),
  scoreP2: Field(0),
  winner: Int64.from(-1),
  p1moveHash: UInt32.from(3),
  p2moveHash: UInt32.from(3),
});
const proofInit = await RpsGame.init(gameScore0);
toc();

tic('proving (setP1Move)');
let gameScoreP1 = new GameState({
  scoreP1: proofInit.publicInput.scoreP1,
  scoreP2: proofInit.publicInput.scoreP2,
  winner: proofInit.publicInput.winner,
  p1moveHash: rock,
  p2moveHash: proofInit.publicInput.p2moveHash,
});
const proofP1move = await RpsGame.setP1Move(gameScoreP1, rock, proofInit);
toc();

tic('proving (setP2Move)');
let gameScoreP2 = new GameState({
  scoreP1: proofP1move.publicInput.scoreP1,
  scoreP2: proofP1move.publicInput.scoreP2,
  winner: proofP1move.publicInput.winner,
  p1moveHash: proofP1move.publicInput.p1moveHash,
  p2moveHash: paper,
});
const proofP2move = await RpsGame.setP2Move(gameScoreP2, paper, proofInit);
toc();

tic('proving (compareMoves)');
let gameScoreP1P2 = new GameState({
  scoreP1: proofP2move.publicInput.scoreP1,
  scoreP2: proofP2move.publicInput.scoreP2,
  winner: Int64.from(2),
  p1moveHash: proofP2move.publicInput.p1moveHash,
  p2moveHash: proofP2move.publicInput.p2moveHash,
});
// const proofP1P2move =
await RpsGame.compareMoves(gameScoreP1P2, proofP2move);
toc();

// tic('compiling');
// await RpsGame.compile();
// toc();

// tic('proving (init)');
// const proofInit = await RpsGame.init(gameScore);
// toc();

// tic('proving (setP1Move)');
// const proofP1move = await RpsGame.setP1Move(gameScore, rock, proofInit);
// toc();

// tic('proving (setP2Move)');
// const proofP2move = await RpsGame.setP1Move(gameScore, paper, proofInit);
// toc();

// tic('proving (compareMoves)');
// const proofCompare = await RpsGame.compareMoves(gameScore, proofP1move, proofP2move);
// toc();

// console.log('Winner should be P2 (2): ' + gameScore.winner.toString())

await shutdown();
