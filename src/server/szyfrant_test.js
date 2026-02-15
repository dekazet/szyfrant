var szyfrant = require('./szyfrant');

var passed = 0;
var failed = 0;

function assert(condition, message) {
    if (condition) {
        passed++;
    } else {
        failed++;
        console.error('FAIL: ' + message);
    }
}

function assertEqual(actual, expected, message) {
    assert(actual === expected, message + ' (expected ' + expected + ', got ' + actual + ')');
}

function testCreateNewGame() {
    var game = szyfrant.newGame();
    assert(game.words, 'newGame has words');
    assertEqual(game.words.length, 2, 'newGame has 2 word sets');
    assertEqual(game.words[0].length, 4, 'team A has 4 words');
    assertEqual(game.words[1].length, 4, 'team B has 4 words');
    assertEqual(game.rounds.length, 1, 'newGame starts with 1 round');
    assertEqual(game.rounds[0].teams.length, 2, 'round has 2 teams');
}

function testDrawnNumbers() {
    var validNumbers = [123, 124, 132, 134, 142, 143, 213, 214, 231, 234, 241, 243, 312, 314, 321, 324, 341, 342, 412, 413, 421, 423, 431, 432];
    var validSet = {};
    validNumbers.forEach(function(n) { validSet[n] = true; });

    var game = szyfrant.newGame();
    var numA = game.rounds[0].teams[0].drawn_number;
    var numB = game.rounds[0].teams[1].drawn_number;
    assert(validSet[numA], 'team A drawn_number is valid: ' + numA);
    assert(validSet[numB], 'team B drawn_number is valid: ' + numB);
}

function testStartRound() {
    var game = szyfrant.newGame();
    assertEqual(game.rounds.length, 1, 'starts with 1 round');

    game = szyfrant.startRound(game);
    assertEqual(game.rounds.length, 2, 'after startRound has 2 rounds');

    // Fill up to 8 rounds
    for (var i = 2; i < 8; i++) {
        game = szyfrant.startRound(game);
    }
    assertEqual(game.rounds.length, 8, 'can reach 8 rounds');

    // 9th round should be rejected
    var game8 = szyfrant.startRound(game);
    assertEqual(game8.rounds.length, 8, 'cannot exceed 8 rounds');
}

function testSubmitCoded() {
    var game = szyfrant.newGame();
    var clues = ['kot', 'pies', 'ryba'];
    game = szyfrant.submitCoded(game, 0, clues);

    var team0 = game.rounds[0].teams[0];
    assertEqual(team0.encoded_number[0], 'kot', 'clue 0 set correctly');
    assertEqual(team0.encoded_number[1], 'pies', 'clue 1 set correctly');
    assertEqual(team0.encoded_number[2], 'ryba', 'clue 2 set correctly');
    assert(team0.encoded_number_tick > 0, 'encoded_number_tick is set');
}

function testSubmitCodedValidation() {
    var game = szyfrant.newGame();

    // Invalid: not 3 strings
    var before = game.rounds[0].teams[0].encoded_number_tick;
    game = szyfrant.submitCoded(game, 0, ['one', 'two']);
    assertEqual(game.rounds[0].teams[0].encoded_number_tick, before, 'rejects array of 2');

    game = szyfrant.submitCoded(game, 0, ['one', '', 'three']);
    assertEqual(game.rounds[0].teams[0].encoded_number_tick, before, 'rejects empty string clue');

    game = szyfrant.submitCoded(game, 0, 'not-an-array');
    assertEqual(game.rounds[0].teams[0].encoded_number_tick, before, 'rejects non-array');

    // Invalid team
    game = szyfrant.submitCoded(game, 5, ['a', 'b', 'c']);
    assertEqual(game.rounds[0].teams[0].encoded_number_tick, before, 'rejects invalid team');
}

function testSubmitCodedDoubleSubmit() {
    var game = szyfrant.newGame();
    game = szyfrant.submitCoded(game, 0, ['a', 'b', 'c']);
    var tick = game.rounds[0].teams[0].encoded_number_tick;

    game = szyfrant.submitCoded(game, 0, ['x', 'y', 'z']);
    assertEqual(game.rounds[0].teams[0].encoded_number[0], 'a', 'double submit is rejected');
    assertEqual(game.rounds[0].teams[0].encoded_number_tick, tick, 'tick unchanged on double submit');
}

function testSubmitDecoded() {
    var game = szyfrant.newGame();
    game = szyfrant.submitDecoded(game, 0, 123);
    assertEqual(game.rounds[0].teams[0].decoded_number, 123, 'decoded_number set correctly');
}

function testSubmitDecodedValidation() {
    var game = szyfrant.newGame();

    // Invalid number
    var before = game.rounds[0].teams[0].decoded_number;
    game = szyfrant.submitDecoded(game, 0, 999);
    assertEqual(game.rounds[0].teams[0].decoded_number, before, 'rejects invalid number 999');

    game = szyfrant.submitDecoded(game, 0, 'hello');
    assertEqual(game.rounds[0].teams[0].decoded_number, before, 'rejects string');

    game = szyfrant.submitDecoded(game, 0, 111);
    assertEqual(game.rounds[0].teams[0].decoded_number, before, 'rejects 111 (repeated digits)');
}

function testSubmitDecodedDoubleSubmit() {
    var game = szyfrant.newGame();
    game = szyfrant.submitDecoded(game, 0, 123);
    game = szyfrant.submitDecoded(game, 0, 321);
    assertEqual(game.rounds[0].teams[0].decoded_number, 123, 'double decode is rejected');
}

function testImmutability() {
    var game = szyfrant.newGame();
    var original = game;

    var afterCoded = szyfrant.submitCoded(game, 0, ['a', 'b', 'c']);
    assert(afterCoded !== original, 'submitCoded returns new object');
    assert(!original.rounds[0].teams[0].encoded_number_tick, 'original not mutated by submitCoded');

    var afterDecoded = szyfrant.submitDecoded(afterCoded, 0, 213);
    assert(afterDecoded !== afterCoded, 'submitDecoded returns new object');
    assertEqual(afterCoded.rounds[0].teams[0].decoded_number, 0, 'previous state not mutated by submitDecoded');

    var afterRound = szyfrant.startRound(game);
    assert(afterRound !== original, 'startRound returns new object');
    assertEqual(original.rounds.length, 1, 'original not mutated by startRound');
}

function testFullGame() {
    var game = szyfrant.newGame();
    game = szyfrant.submitCoded(game, 0, ['raz', 'dwa', 'trzy']);
    game = szyfrant.submitCoded(game, 1, ['szesc', 'dwa', 'piec']);
    game = szyfrant.submitDecoded(game, 0, 324);
    game = szyfrant.submitDecoded(game, 1, 124);

    assertEqual(game.rounds[0].teams[0].encoded_number[0], 'raz', 'round 1 team A clue 0');
    assertEqual(game.rounds[0].teams[1].encoded_number[0], 'szesc', 'round 1 team B clue 0');
    assertEqual(game.rounds[0].teams[0].decoded_number, 324, 'round 1 team A decode');
    assertEqual(game.rounds[0].teams[1].decoded_number, 124, 'round 1 team B decode');

    game = szyfrant.startRound(game);
    assertEqual(game.rounds.length, 2, 'round 2 started');

    game = szyfrant.submitCoded(game, 0, ['raz1', 'dwa2', 'trzy3']);
    game = szyfrant.submitCoded(game, 1, ['xszesc', 'ydwa', 'piec']);
    game = szyfrant.submitDecoded(game, 0, 214);
    game = szyfrant.submitDecoded(game, 1, 134);

    assertEqual(game.rounds[1].teams[0].decoded_number, 214, 'round 2 team A decode');
    assertEqual(game.rounds[1].teams[1].decoded_number, 134, 'round 2 team B decode');
    // Round 1 data should still be intact
    assertEqual(game.rounds[0].teams[0].encoded_number[0], 'raz', 'round 1 data preserved');
}

module.exports = () => {
    testCreateNewGame();
    testDrawnNumbers();
    testStartRound();
    testSubmitCoded();
    testSubmitCodedValidation();
    testSubmitCodedDoubleSubmit();
    testSubmitDecoded();
    testSubmitDecodedValidation();
    testSubmitDecodedDoubleSubmit();
    testImmutability();
    testFullGame();

    console.log('\nResults: ' + passed + ' passed, ' + failed + ' failed');
    if (failed > 0) {
        process.exit(1);
    }
};
