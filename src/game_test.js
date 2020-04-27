var szyfrant = require('./szyfrant');

function testGame() {
    game = szyfrant.newGame();
    szyfrant.printGame(game);
    game = szyfrant.submitCoded(game, 0, 'raz dwa trzy');
    game = szyfrant.submitCoded(game, 1, 'dwa trzy cztery');
    szyfrant.printGame(game);
    //game = szyfrant.startRound(game);
}

testGame();
