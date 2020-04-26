var szyfrant = require('./szyfrant');

function testGame() {
    game = szyfrant.newGame();
    szyfrant.printGame(game);
    game = szyfrant.startRound(game);
    szyfrant.printGame(game);
    game = szyfrant.startRound(game);
    game = szyfrant.startRound(game);
    game = szyfrant.startRound(game);
    game = szyfrant.startRound(game);
    szyfrant.printGame(game);
}

testGame();
