const words = ['BUDOWA', 'JATKA', 'RURA', 'BERMUDY', 'KRZESŁO', 'GÓRA', 'LONDYN', 'HIMALAJE', 'PALETA', 'GRA', 'KASA', 'SZKŁO', 'OBSADA', 'MODEL', 'LINIA', 'KIWI', 'SIANO', 'DNO', 'KRAKÓW', 'ŁÓDŹ', 'DONICE', 'ORGANY', 'JABŁKO', 'MUSZLA', 'JEDNOROŻEC', 'PAZUR', 'MATERIAŁ', 'DOKTOR', 'GOLF', 'NOWY JORK', 'BERLIN', 'LOCH NESS', 'ZWOJE', 'FUNT', 'GOŁĄB', 'RAK', 'ŚMIERĆ', 'PIERŚCIEŃ', 'KARAWAN', 'DZIĘCIOŁ', 'SŁUP', 'PŁYTA', 'USTA', 'CIAŁO', 'NUREK', 'POKRYWKA', 'DWÓR', 'STRUMIEŃ', 'MIEDŹ', 'SZPIEG', 'MERKURY', 'GUMA', 'PRAWNIK', 'OPERA', 'GNAT', 'POJAZD', 'PRZEWODNIK', 'FLET', 'PLASTIK', 'PUNKT', 'TOALETA', 'LAKIER', 'RÓŻA', 'KOŚCIÓŁ', 'ŚLIMAK', 'SZKOŁA', 'KANGUR', 'CEBULA', 'PIES', 'DYWAN', 'DANIA', 'NAPAD', 'ZMIANA', 'SIŁA', 'NAUKOWIEC', 'STAN', 'MEKSYK', 'MIKROSKOP', 'NOS', 'SZTUKA', 'ZĄB', 'HOLENDER', 'KLATKA', 'GAZ', 'FENIKS', 'WASZYNGTON', 'RUDA', 'KLUCZ', 'POLICJA', 'SUPERBOHATER', 'OLEJ', 'FILM', 'BOMBA', 'MASA', 'TUBA', 'DIAMENT', 'LEW', 'KOŁO', 'SZPILKA', 'DZIURA', 'ŻURAW', 'NOC', 'DZWON', 'SATELITA', 'MAKS', 'TUSZ', 'LODY', 'PŁOT', 'REKIN', 'WSTĘP', 'CZAPA', 'ZNAK', 'STOŁEK', 'DUSZA', 'KONAR', 'PEKIN', 'LINA', 'ANIOŁ', 'SPADOCHRON', 'MUR', 'PLAŻA', 'SATURN', 'TEATR', 'OLIMP', 'DZIEŃ', 'KAMIEŃ', 'REWOLUCJA', 'HAK', 'SMOK', 'CZARODZIEJ', 'BECZKA', 'MAMUT', 'ANTARKTYKA', 'SZCZĘŚCIE', 'RADOM', 'LÓD', 'KRASNAL', 'ATLANTYDA', 'ZMYWACZ', 'OBCY', 'FALA', 'TUSZA', 'CHOCHLIK', 'IGŁA', 'RYBA', 'GUZIK', 'TANIEC', 'PODKOWA', 'ŻUK', 'STÓŁ', 'ZEBRA', 'BUT', 'HOTEL', 'POŁĄCZENIE', 'DUCH', 'ZIELEŃ', 'NIEDŹWIEDŹ', 'STATEK', 'PAPIER', 'OKO', 'OGIEŃ', 'KOSTIUM', 'HUMOR', 'UCHO', 'BAR', 'TRÓJKĄT', 'KOŚĆ', 'PÓŁNOC', 'KOLEC', 'CZASZKA', 'PIRAT', 'NIEBO', 'MAJ', 'ŻELAZO', 'TWARZ', 'OLIWA', 'ŁOŻYSKO', 'RÓG', 'ŚWIERSZCZ', 'PINGWIN', 'WIEŻA', 'ŻUBR', 'GRZYB', 'SERCE', 'PILOT', 'GRZMOT', 'HOLLYWOOD', 'HELIKOPTER', 'KRĘGI', 'AMAZONKA', 'KECZUP', 'GŁOWA', 'SZPITAL', 'WYBUCH', 'WIRUS', 'ŻABKA', 'PRAWO', 'BIEDRONKA', 'KOT', 'POCZTA', 'KRET', 'LASKA', 'SAMOLOT', 'STRZAŁ', 'MILIONER', 'MISTRZ', 'CIEŃ', 'FIGURA', 'DZIOBAK', 'SZKOCJA', 'TABLICA', 'TOKIO', 'JOWISZ', 'KSIĘŻYC', 'POLE', 'KORZENIE', 'PASTA', 'GENIUSZ', 'MAJTKI', 'ŻEBRO', 'ŻAGIEL', 'RZUT', 'KLAMKA', 'RZĄD', 'NIEMCY', 'MIÓD', 'RZYM', 'GRABARZ', 'WĄŻ', 'JAJA', 'RYCERZ', 'WAGA', 'KROPKA', 'KORONA', 'BAWEŁNA', 'NAUCZYCIEL', 'POCIECHA', 'SZNUR', 'MOST', 'GRACJA', 'NORA', 'DÓŁ', 'SOKÓŁ', 'POLSKA', 'KRÓLIK', 'KONTRAKT', 'PROMIEŃ', 'PODKŁAD', 'SUKIENKA', 'KRÓL', 'PLASTIK', 'KSIĘŻNICZKA', 'WIATR', 'ANGLIA', 'GROSZEK', 'POCHODNIA', 'SPADEK', 'STRONA', 'GRECJA', 'RULETKA', 'KRYZYS', 'PAJĄK', 'ŻYCIE', 'TELESKOP', 'WIELORYB', 'ORZECH', 'BELKA', 'PAS', 'ŁUK', 'PIELĘGNIARKA', 'KUCHARZ', 'DINOZAUR', 'PIRAMIDA', 'NIEWOLNIK', 'PUDŁO', 'ŚNIEG', 'STOPA', 'ROBAK', 'GŁADKI', 'GWIAZDA', 'TALIA', 'SZEKSPIR', 'NAPOLEON', 'PORT', 'FRANCUZ', 'OGON', 'ŁAWA', 'BICZ', 'SPLOT', 'STADION', 'WOJNA', 'LIS', 'KACZOR', 'ZŁOTO', 'SILNIK', 'RĘKAWICA', 'BABKA', 'BASEN', 'TOREBKA', 'WACHLARZ', 'MOSKWA', 'WARCHLAK', 'PUPIL', 'KRÓLOWA', 'NOGA', 'SKORPION', 'KRÓWKA', 'WYDECH', 'RĘKA', 'OGIER', 'OGR', 'AWARIA', 'JAGODA', 'PALUSZKI', 'CZUJKA', 'POCIĄG', 'FOKA', 'BĄK', 'KASYNO', 'EGIPT', 'NEKTAR', 'AMBULANS', 'RZĘSA', 'LIMUZYNA', 'SAMOCHÓD', 'GOTYK', 'CENTRUM', 'TCHÓRZ', 'OPERA', 'KONTAKT', 'CZAS', 'POWIETRZE', 'GNIAZDKO', 'PĄCZEK', 'PLACEK', 'TRĄBA', 'TRUCIZNA', 'SOCZEWKA', 'BUTELKA', 'AUSTRALIA', 'NIĆ', 'KALOSZ', 'SKORUPA', 'AMBASADA', 'WIOSNA', 'KLAWISZ', 'JĘZYK', 'CHINY', 'KARTA', 'PLIK', 'SIEKACZ', 'ZŁODZIEJ', 'EUROPA', 'LAS', 'SIEĆ', 'KAPTUR', 'KOZIOŁ', 'KOMÓRKA', 'BAŁWAN', 'AMERYKA', 'SUCHAR', 'TRUTEŃ', 'BAL', 'PERŁA', 'ZESPÓŁ', 'ROBOT', 'TRAWA', 'ZIEMIA', 'NÓŻ', 'CENTAUR', 'PAN', 'BLOK', 'FARTUCH', 'CHOROBA', 'OPOKA', 'KRZYŻ', 'AZTEK', 'CHRYSTUS', 'WIEŻOWIEC', 'PUSTKA', 'DRZEWO', 'STOPIEŃ', 'SZCZYT', 'RAKIETA', 'KONCERT', 'WKŁAD', 'ŚWINIA', 'TALERZ', 'AFRYKA', 'KCIUK', 'CZEKOLADA', 'SPARTA', 'EKRAN', 'RAMA', 'LOT', 'PRACA', 'WIEDŹMA', 'OŚMIORNICA', 'ORZEŁ', 'WIDELEC', 'ZAMEK', 'BANAN', 'GIGANT', 'BANK', 'KOD', 'FRANCJA', 'LASER', 'SZAFA', 'KOKAINA', 'MYSZ', 'MUCHA', 'MĄKA', 'NINJA', 'CZAR', 'ŻOŁNIERZ', 'KWADRAT', 'WODA', 'KRAWAT', 'SZMUGIEL', 'KOŃ', 'MARCHEW', 'PISTOLET'];

function log(str) {
    console.log(str);
}

function logObject(obj) {
    console.log(JSON.stringify(obj, null, 4));
}

const GS_IDLE = 1;
const GS_PLAYING_ROUND = 2;
const GS_FINISHED = 3;

const RS_ENCODING = 11;
const RS_DECODING = 12;

const TOKEN_WHITE = 0;
const TOKEN_BLACK = 1;

function roll4() {
    return Math.floor(Math.random() * 4) + 1;
}

function generateNumber() {
    return roll4() * 100 + roll4() * 10 + roll4();
}

function createRoundTeamEntry() {
    return({
        drawn_number : generateNumber(),
        encoded_number : '',
        decoded_number : 0,
        oponnents_number : 0
    });
}

function createRound() {
    return({
        state: RS_ENCODING, 
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
        state : GS_IDLE,
        round : null,
        words : drawWords(),
        tokens : [[0, 0], [0, 0]],
        round_number : 0,
        past_rounds : []
        });    
}

function otherTeam(team) {
    if (team == 0) {
        return 1;
    }
    return 0;
}

function startRound(game) {
    if (game.state == GS_PLAYING_ROUND) {
        log('Alread playing a round');
        return game;
    }
    return Object.assign({}, game, {state : GS_PLAYING_ROUND, round : createRound()});;
}

function encodeNumber(game, team, encoded_number) {
    if (game.state != GS_PLAYING_ROUND) {
        log('Not playing a round');        
        return game;
    }
    if (team != 0 || team != 1) {
        log('Invalid team');        
        return game;
    }
    if (game.round.teams[team].encoded_number != '') {
        log('Number already encoded this round');   
        return game;
    }
    game.round.teams[team].encoded_number = encoded_number;
    return game;
}

function decodeNumber(game, team, decoded_number) {
    if (game.state != GS_PLAYING_ROUND) {
        log('Not playing a round');        
        return game;
    }
    if (team != 0 || team != 1) {
        log('Invalid team');        
        return game;
    }
    if (game.round.teams[team].decoded_number != 0) {
        log('Number already decoded this round');   
        return game;
    }
    game.round.teams[team].decoded_number = decoded_number;
    return game;
}

function addToken(game, team, token) {
    game.tokens[team][token] = game.tokens[team][token] + 1;
    if (game.tokens[team][token] == 2) {
        
    }
}

function guessOponnentsNumber(game, team, oponnents_number) {
    if (game.state != GS_PLAYING_ROUND) {
        log('Not playing a round');        
        return game;
    }
    if (team != 0 || team != 1) {
        log('Invalid team');        
        return game;
    }
    if (game.round.teams[team].oponnents_number != 0) {
        log('Number already decoded this round');   
        return game;
    }   
    game.round.teams[team].oponnents_number = oponnents_number; 
    if (oponnents_number == game.round.teams[otherTeam(team)].drawn_number) {
        game.tokens[team][TOKEN_WHITE] = game.tokens[team][TOKEN_WHITE] + 1;
    }
    return game;
}

function printGame(game) {
    log('-----------------');
    log(game);
    log('**')
    log(game.round);
    log('-----------------');
}

module.exports = {
    newGame : () => {return createGame(); },
    startRound : (game) => { return startRound(game); },
    printGame : (game) => { printGame(game); },

    GS_IDLE : 1,
    GS_PLAYING_ROUND : 2,
    GS_FINISHED : 3,
    
    RS_ENCODING : 11,
    RS_DECODING : 12,
    
    TOKEN_WHITE : 0,
    TOKEN_BLACK : 1,
};
