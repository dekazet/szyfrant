var szyfrant = require('./szyfrant');

function testGame() {
    game = szyfrant.newGame();
    szyfrant.printGame(game);
    game = szyfrant.submitCoded(game, 0, ['raz', 'dwa', 'trzy']);
    szyfrant.printGame(game);
    game = szyfrant.submitCoded(game, 1, ['szesc', 'dwa', 'piec']);
    szyfrant.printGame(game);
    game = szyfrant.submitDecoded(game, 0, 324);
    szyfrant.printGame(game);
    game = szyfrant.submitDecoded(game, 1, 124);
    szyfrant.printGame(game);
    game = szyfrant.startRound(game);
    game = szyfrant.submitCoded(game, 0, ['raz1', 'dwa2', 'trzy']);
    szyfrant.printGame(game);
    game = szyfrant.submitCoded(game, 1, ['xszesc', '3dwa', 'piec']);
    szyfrant.printGame(game);
    game = szyfrant.submitDecoded(game, 0, 214);
    szyfrant.printGame(game);
    game = szyfrant.submitDecoded(game, 1, 134);
    szyfrant.printGame(game);
}

testGame();
