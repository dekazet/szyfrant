const words = ['BUDOWA', 'JATKA', 'RURA', 'BERMUDY', 'KRZESŁO', 'GÓRA', 'LONDYN', 'HIMALAJE', 'PALETA', 'GRA', 'KASA', 'SZKŁO', 'OBSADA', 'MODEL', 'LINIA', 'KIWI', 'SIANO', 'DNO', 'KRAKÓW', 'ŁÓDŹ', 'DONICE', 'ORGANY', 'JABŁKO', 'MUSZLA', 'JEDNOROŻEC', 'PAZUR', 'MATERIAŁ', 'DOKTOR', 'GOLF', 'NOWY JORK', 'BERLIN', 'LOCH NESS', 'ZWOJE', 'FUNT', 'GOŁĄB', 'RAK', 'ŚMIERĆ', 'PIERŚCIEŃ', 'KARAWAN', 'DZIĘCIOŁ', 'SŁUP', 'PŁYTA', 'USTA', 'CIAŁO', 'NUREK', 'POKRYWKA', 'DWÓR', 'STRUMIEŃ', 'MIEDŹ', 'SZPIEG', 'MERKURY', 'GUMA', 'PRAWNIK', 'OPERA', 'GNAT', 'POJAZD', 'PRZEWODNIK', 'FLET', 'PLASTIK', 'PUNKT', 'TOALETA', 'LAKIER', 'RÓŻA', 'KOŚCIÓŁ', 'ŚLIMAK', 'SZKOŁA', 'KANGUR', 'CEBULA', 'PIES', 'DYWAN', 'DANIA', 'NAPAD', 'ZMIANA', 'SIŁA', 'NAUKOWIEC', 'STAN', 'MEKSYK', 'MIKROSKOP', 'NOS', 'SZTUKA', 'ZĄB', 'HOLENDER', 'KLATKA', 'GAZ', 'FENIKS', 'WASZYNGTON', 'RUDA', 'KLUCZ', 'POLICJA', 'SUPERBOHATER', 'OLEJ', 'FILM', 'BOMBA', 'MASA', 'TUBA', 'DIAMENT', 'LEW', 'KOŁO', 'SZPILKA', 'DZIURA', 'ŻURAW', 'NOC', 'DZWON', 'SATELITA', 'MAKS', 'TUSZ', 'LODY', 'PŁOT', 'REKIN', 'WSTĘP', 'CZAPA', 'ZNAK', 'STOŁEK', 'DUSZA', 'KONAR', 'PEKIN', 'LINA', 'ANIOŁ', 'SPADOCHRON', 'MUR', 'PLAŻA', 'SATURN', 'TEATR', 'OLIMP', 'DZIEŃ', 'KAMIEŃ', 'REWOLUCJA', 'HAK', 'SMOK', 'CZARODZIEJ', 'BECZKA', 'MAMUT', 'ANTARKTYKA', 'SZCZĘŚCIE', 'RADOM', 'LÓD', 'KRASNAL', 'ATLANTYDA', 'ZMYWACZ', 'OBCY', 'FALA', 'TUSZA', 'CHOCHLIK', 'IGŁA', 'RYBA', 'GUZIK', 'TANIEC', 'PODKOWA', 'ŻUK', 'STÓŁ', 'ZEBRA', 'BUT', 'HOTEL', 'POŁĄCZENIE', 'DUCH', 'ZIELEŃ', 'NIEDŹWIEDŹ', 'STATEK', 'PAPIER', 'OKO', 'OGIEŃ', 'KOSTIUM', 'HUMOR', 'UCHO', 'BAR', 'TRÓJKĄT', 'KOŚĆ', 'PÓŁNOC', 'KOLEC', 'CZASZKA', 'PIRAT', 'NIEBO', 'MAJ', 'ŻELAZO', 'TWARZ', 'OLIWA', 'ŁOŻYSKO', 'RÓG', 'ŚWIERSZCZ', 'PINGWIN', 'WIEŻA', 'ŻUBR', 'GRZYB', 'SERCE', 'PILOT', 'GRZMOT', 'HOLLYWOOD', 'HELIKOPTER', 'KRĘGI', 'AMAZONKA', 'KECZUP', 'GŁOWA', 'SZPITAL', 'WYBUCH', 'WIRUS', 'ŻABKA', 'PRAWO', 'BIEDRONKA', 'KOT', 'POCZTA', 'KRET', 'LASKA', 'SAMOLOT', 'STRZAŁ', 'MILIONER', 'MISTRZ', 'CIEŃ', 'FIGURA', 'DZIOBAK', 'SZKOCJA', 'TABLICA', 'TOKIO', 'JOWISZ', 'KSIĘŻYC', 'POLE', 'KORZENIE', 'PASTA', 'GENIUSZ', 'MAJTKI', 'ŻEBRO', 'ŻAGIEL', 'RZUT', 'KLAMKA', 'RZĄD', 'NIEMCY', 'MIÓD', 'RZYM', 'GRABARZ', 'WĄŻ', 'JAJA', 'RYCERZ', 'WAGA', 'KROPKA', 'KORONA', 'BAWEŁNA', 'NAUCZYCIEL', 'POCIECHA', 'SZNUR', 'MOST', 'GRACJA', 'NORA', 'DÓŁ', 'SOKÓŁ', 'POLSKA', 'KRÓLIK', 'KONTRAKT', 'PROMIEŃ', 'PODKŁAD', 'SUKIENKA', 'KRÓL', 'PLASTIK', 'KSIĘŻNICZKA', 'WIATR', 'ANGLIA', 'GROSZEK', 'POCHODNIA', 'SPADEK', 'STRONA', 'GRECJA', 'RULETKA', 'KRYZYS', 'PAJĄK', 'ŻYCIE', 'TELESKOP', 'WIELORYB', 'ORZECH', 'BELKA', 'PAS', 'ŁUK', 'PIELĘGNIARKA', 'KUCHARZ', 'DINOZAUR', 'PIRAMIDA', 'NIEWOLNIK', 'PUDŁO', 'ŚNIEG', 'STOPA', 'ROBAK', 'GŁADKI', 'GWIAZDA', 'TALIA', 'SZEKSPIR', 'NAPOLEON', 'PORT', 'FRANCUZ', 'OGON', 'ŁAWA', 'BICZ', 'SPLOT', 'STADION', 'WOJNA', 'LIS', 'KACZOR', 'ZŁOTO', 'SILNIK', 'RĘKAWICA', 'BABKA', 'BASEN', 'TOREBKA', 'WACHLARZ', 'MOSKWA', 'WARCHLAK', 'PUPIL', 'KRÓLOWA', 'NOGA', 'SKORPION', 'KRÓWKA', 'WYDECH', 'RĘKA', 'OGIER', 'OGR', 'AWARIA', 'JAGODA', 'PALUSZKI', 'CZUJKA', 'POCIĄG', 'FOKA', 'BĄK', 'KASYNO', 'EGIPT', 'NEKTAR', 'AMBULANS', 'RZĘSA', 'LIMUZYNA', 'SAMOCHÓD', 'GOTYK', 'CENTRUM', 'TCHÓRZ', 'OPERA', 'KONTAKT', 'CZAS', 'POWIETRZE', 'GNIAZDKO', 'PĄCZEK', 'PLACEK', 'TRĄBA', 'TRUCIZNA', 'SOCZEWKA', 'BUTELKA', 'AUSTRALIA', 'NIĆ', 'KALOSZ', 'SKORUPA', 'AMBASADA', 'WIOSNA', 'KLAWISZ', 'JĘZYK', 'CHINY', 'KARTA', 'PLIK', 'SIEKACZ', 'ZŁODZIEJ', 'EUROPA', 'LAS', 'SIEĆ', 'KAPTUR', 'KOZIOŁ', 'KOMÓRKA', 'BAŁWAN', 'AMERYKA', 'SUCHAR', 'TRUTEŃ', 'BAL', 'PERŁA', 'ZESPÓŁ', 'ROBOT', 'TRAWA', 'ZIEMIA', 'NÓŻ', 'CENTAUR', 'PAN', 'BLOK', 'FARTUCH', 'CHOROBA', 'OPOKA', 'KRZYŻ', 'AZTEK', 'CHRYSTUS', 'WIEŻOWIEC', 'PUSTKA', 'DRZEWO', 'STOPIEŃ', 'SZCZYT', 'RAKIETA', 'KONCERT', 'WKŁAD', 'ŚWINIA', 'TALERZ', 'AFRYKA', 'KCIUK', 'CZEKOLADA', 'SPARTA', 'EKRAN', 'RAMA', 'LOT', 'PRACA', 'WIEDŹMA', 'OŚMIORNICA', 'ORZEŁ', 'WIDELEC', 'ZAMEK', 'BANAN', 'GIGANT', 'BANK', 'KOD', 'FRANCJA', 'LASER', 'SZAFA', 'KOKAINA', 'MYSZ', 'MUCHA', 'MĄKA', 'NINJA', 'CZAR', 'ŻOŁNIERZ', 'KWADRAT', 'WODA', 'KRAWAT', 'SZMUGIEL', 'KOŃ', 'MARCHEW', 'PISTOLET'];
const numbers = [123, 124, 132, 134, 142, 143, 213, 214, 231, 234, 241, 243, 312, 314, 321, 324, 341, 342, 412, 413, 421, 423, 431, 432];

function log(str) {
    console.log(str);
}

function logObject(obj) {
    console.log(JSON.stringify(obj, null, 4));
}

function drawNumber() {
    return numbers[Math.floor(Math.random() * numbers.length)];
}

function createRoundTeamEntry() {
    return({
        drawn_number : drawNumber(),
        encoded_number : ['', '', ''],
        decoded_number : 0,
    });
}

function createRound() {
    return({
        teams : [createRoundTeamEntry(), createRoundTeamEntry()] 
    });
}

function drawWords() {
    const copied_words = words.slice();
    const shuffled = copied_words.sort(() => 0.5 - Math.random());
    return [shuffled.slice(0, 4), shuffled.slice(10, 14)];
} 

function createGame() {
    return ({ 
        words : drawWords(),
        rounds : [createRound()]
        });    
}

function otherTeam(team) {
    if (team == 0) {
        return 1;
    }
    return 0;
}

function validTeam(team) {
    return team == 0 || team == 1;
}

var validNumbers = new Set(numbers.map(String));

function validEncodedNumber(encoded_number) {
    if (!Array.isArray(encoded_number) || encoded_number.length !== 3) {
        return false;
    }
    for (var i = 0; i < 3; i++) {
        if (typeof encoded_number[i] !== 'string' || encoded_number[i].trim() === '') {
            return false;
        }
    }
    return true;
}

function validDecodedNumber(decoded_number) {
    return validNumbers.has(String(decoded_number));
}

function startRound(game) {
    if (game.rounds.length == 8) {
        log('Already started 8th round');
        return game;
    }
    let rounds = game.rounds.slice();
    rounds.push(createRound());
    return Object.assign({}, game, {rounds : rounds});;
}

function encodeNumber(game, team, encoded_number) {
    if (!validTeam(team)) {
        log('Invalid team ' + team);
        return game;
    }
    if (!validEncodedNumber(encoded_number)) {
        log('Invalid encoded_number from team ' + team);
        return game;
    }
    var currentTeam = game.rounds[game.rounds.length - 1].teams[team];
    if (currentTeam.encoded_number_tick) {
        log('Team ' + team + ' already encoded this round');
        return game;
    }
    var now = new Date();
    var lastIndex = game.rounds.length - 1;
    var updatedTeamEntry = Object.assign({}, game.rounds[lastIndex].teams[team], {
        encoded_number_tick: now.getTime(),
        encoded_number: encoded_number
    });
    var updatedTeams = game.rounds[lastIndex].teams.slice();
    updatedTeams[team] = updatedTeamEntry;
    var updatedRound = Object.assign({}, game.rounds[lastIndex], {teams: updatedTeams});
    var updatedRounds = game.rounds.slice();
    updatedRounds[lastIndex] = updatedRound;
    return Object.assign({}, game, {rounds: updatedRounds});
}

function decodeNumber(game, team, decoded_number) {
    if (!validTeam(team)) {
        log('Invalid team');
        return game;
    }
    if (!validDecodedNumber(decoded_number)) {
        log('Invalid decoded_number from team ' + team + ': ' + decoded_number);
        return game;
    }
    var currentTeam = game.rounds[game.rounds.length - 1].teams[team];
    if (currentTeam.decoded_number) {
        log('Team ' + team + ' already decoded this round');
        return game;
    }
    var lastIndex = game.rounds.length - 1;
    var updatedTeamEntry = Object.assign({}, game.rounds[lastIndex].teams[team], {
        decoded_number: decoded_number
    });
    var updatedTeams = game.rounds[lastIndex].teams.slice();
    updatedTeams[team] = updatedTeamEntry;
    var updatedRound = Object.assign({}, game.rounds[lastIndex], {teams: updatedTeams});
    var updatedRounds = game.rounds.slice();
    updatedRounds[lastIndex] = updatedRound;
    return Object.assign({}, game, {rounds: updatedRounds});
}

function printGame(game) {
    log('-----------------');
    log(game);
    log('*Current round*')
    log('------ TeamA --------');
    log(game.rounds[game.rounds.length - 1].teams[0]);
    log('------ TeamB --------');
    log(game.rounds[game.rounds.length - 1].teams[1]);
    log('-----------------');
}

module.exports = {
    newGame : () => {return createGame(); },
    startRound : (game) => { return startRound(game); },
    submitCoded : (game, team, encoded_number) => { return encodeNumber(game, team, encoded_number); },
    submitDecoded : (game, team, decoded_number) => { return decodeNumber(game, team, decoded_number); },
    printGame : (game) => { printGame(game); },
};
