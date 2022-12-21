import { Field, UInt32, isReady, shutdown } from 'snarkyjs';
import { tic, toc } from './tictoc.js';
import { GameState, RpsGame } from './Rps.js';

await isReady;

let gameScore = new GameState({
  scoreP1: Field(0),
  scoreP2: Field(0),
  winner: Field(-1),
  p1moveHash: UInt32.from(3),
  p2moveHash: UInt32.from(3),
});

tic('compiling');
await RpsGame.compile();
toc();

tic('proving (init)');
await RpsGame.init(gameScore);
toc();

await shutdown();
