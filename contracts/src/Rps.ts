import {
  Circuit,
  Experimental,
  Field,
  Int64,
  SelfProof,
  Struct,
  UInt32,
} from 'snarkyjs';

//public inputs for recursive proof rps game
export class GameState extends Struct({
  scoreP1: Field,
  scoreP2: Field,
  // show winner: -1: round has not started, 0: tie, 1: P1 wins, 2: P2 wins
  winner: Int64,
  // moves: 0: Rock, 1: Paper, 2: Scissors
  p1moveHash: UInt32,
  p2moveHash: UInt32,
}) {
  // getScoreP1(input: Score){
  //   return input.scoreP1
  // }
  // getScoreP2(input: Score){
  //   return input.scoreP2
  // }
  setP1Move(move: UInt32) {
    this.p1moveHash = move;
  }
  setP2Move(move: UInt32) {
    this.p2moveHash = move;
  }
  setWinner(result: Int64) {
    this.winner = result;
  }
}

export const RpsGame = Experimental.ZkProgram({
  publicInput: GameState,

  methods: {
    init: {
      privateInputs: [],
      method(publicInput: GameState) {
        // publicInput.scoreP1.assertEquals(Field(0));
        // publicInput.scoreP2.assertEquals(Field(0));
        // publicInput.p1moveHash.assertEquals(UInt32.from(3));
        // publicInput.p2moveHash.assertEquals(UInt32.from(3));
        publicInput.winner.assertEquals(Int64.from(-1));
      },
    },

    setP1Move: {
      privateInputs: [UInt32, SelfProof],
      method(
        publicInput: GameState,
        p1Move: UInt32,
        prevProof: SelfProof<GameState>
      ) {
        prevProof.verify();
        // prevProof.publicInput.p1moveHash.assertEquals(UInt32.from(3));
        // prevProof.publicInput.p2moveHash.assertEquals(UInt32.from(3));

        // publicInput.setP1Move(p1Move);
        publicInput.p1moveHash.assertGte(UInt32.from(0));
        publicInput.p1moveHash.assertLte(UInt32.from(2));
      },
    },

    setP2Move: {
      privateInputs: [UInt32, SelfProof],
      method(
        publicInput: GameState,
        p2Move: UInt32,
        prevProof: SelfProof<GameState>
      ) {
        prevProof.verify();
        // prevProof.publicInput.p1moveHash.assertEquals(UInt32.from(3));
        // prevProof.publicInput.p2moveHash.assertEquals(UInt32.from(3));

        // publicInput.setP2Move(p2Move);
        publicInput.p2moveHash.assertGte(UInt32.from(0));
        publicInput.p2moveHash.assertLte(UInt32.from(2));
      },
    },

    compareMoves: {
      privateInputs: [SelfProof],
      method(publicInput: GameState, prevProof: SelfProof<GameState>) {
        prevProof.verify();

        const player1 = prevProof.publicInput.p1moveHash;
        const player2 = prevProof.publicInput.p2moveHash;

        const winner = Circuit.switch(
          [
            // show winner: -1: round has not started, 0: tie, 1: P1 wins, 2: P2 wins
            // moves: 0: Rock, 1: Paper, 2: Scissors
            player1.equals(player2),
            player1.equals(UInt32.from(0)).and(player2.equals(UInt32.from(1))),
            player1.equals(UInt32.from(0)).and(player2.equals(UInt32.from(2))),
            player1.equals(UInt32.from(1)).and(player2.equals(UInt32.from(0))),
            player1.equals(UInt32.from(1)).and(player2.equals(UInt32.from(2))),
            player1.equals(UInt32.from(2)).and(player2.equals(UInt32.from(0))),
            player1.equals(UInt32.from(2)).and(player2.equals(UInt32.from(1))),
          ],
          Int64,
          [
            Int64.from(0),
            Int64.from(2),
            Int64.from(1),
            Int64.from(1),
            Int64.from(2),
            Int64.from(2),
            Int64.from(1),
          ]
        );

        publicInput.winner.assertEquals(winner);
      },
    },
  },
});
