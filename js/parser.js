
function Fixer(){
    var self = {};
    var typo = TypoFixer();

    self.fixCharacters = function(char1, char2){
        return [[typo.fixCharacterName(char1)], [typo.fixCharacterName(char2)]];
    }

    self.fixPlayers = function(player1, player2){
        return [typo.fixPlayerName(player1), typo.fixPlayerName(player2)];
    }

    return self;
}


var REGEX_STR = {
    PLAYER: "([\\w\\.\\-\| ]+) ",
    CHARACTER: "(\\(|\\[) *([\\w\\. ]+) *(\\)|\\]) ",
    VERSUS: "(Vs|vs)\\.? ",
}

function YogaFlameParser(){
    var self = {};
    var fixer = Fixer();

    var GAME_REGEX_STR = {
        SF5: "SF5|SFV|Beta SFV",
        USF4: "USF4",
        SSF4AE2012: "(Arcade Edition|AE)( Version)? +2012",
        SSF4AE: "Arcade Edition|AE",
        SF3: "SF3",
        SFxT: "SFxT",
        TTT2: "Tekken Tag Tournament 2"
    }
    var GAME_REGEX = {};
    function buildRegex(){
        var rounds = "(X[0-9] )?";
        var resolution = " *(1080p|720p)";
        var gameRegexArr = [];
        for (var key in GAME_REGEX_STR) {
            if (GAME_REGEX_STR.hasOwnProperty(key)) {
                GAME_REGEX[key] = new RegExp(GAME_REGEX_STR[key]);
                gameRegexArr.push(TOOL.format("{1}", GAME_REGEX_STR[key]));
            }
        }
        var combinedGame = gameRegexArr.join('|');
        var game = TOOL.format(" *({1}) ", combinedGame);
        var regexStr = (
            rounds +
            REGEX_STR.PLAYER +
            REGEX_STR.CHARACTER +
            REGEX_STR.VERSUS +
            REGEX_STR.PLAYER +
            REGEX_STR.CHARACTER +
            game +
            resolution
        );
        return new RegExp(regexStr);
    }
    var REGEX = buildRegex();

    function fixGame(game){
        var res = null;
        for (var key in GAME_REGEX) {
            if (GAME_REGEX.hasOwnProperty(key)) {
                res = GAME_REGEX[key].exec(game);
                if (res){
                    return key;
                }
            }
        }
        return game;
    }

    self.parse = function(dataTuple){
        var timestamp = dataTuple[0];
        var id = dataTuple[1];
        var title = dataTuple[2];
        var res = REGEX.exec(title);
        if (!res){
            TOOL.visuLog(title);
            return null;
        }
        return Video(
            timestamp,
            id,
            title,
            fixGame(res[11]),
            fixer.fixCharacters(res[4], res[9]),
            fixer.fixPlayers(res[2], res[7])
        );
    };

    return self;
}

function OlympicParser(){
    var self = {};
    var fixer = Fixer();

    var GAME_REGEX_STR = {
        SF5: "Street Fighter (5 */? *V|5|V)|SFV",
        SFxT: "Street Fighter X Tekken",
        P4AU: "Persona 4 Arena Ultimax",
        MKX: "Mortal Kombat X",
        SC5: "SoulCalibur 5/V",
        DOA5: "Dead Or Alive 5 Last Round",
        Smash4: "Super Smash Bros Wii U",
        GGXrd: "Guilty Gear Xrd",
        KI: "Killer Instinct",
    }
    var GAME_REGEX = {};
    var REGEX_1 = null;
    var REGEX_2 = null;
    function buildRegex(){
        var endtag = "(Wii|Xbox|PS4|-? ?Gameplay).*";
        var gameRegexArr = [];
        for (var key in GAME_REGEX_STR) {
            if (GAME_REGEX_STR.hasOwnProperty(key)) {
                GAME_REGEX[key] = new RegExp(GAME_REGEX_STR[key]);
                gameRegexArr.push(TOOL.format("{1}", GAME_REGEX_STR[key]));
            }
        }
        var combinedGame = gameRegexArr.join('|');
        var game = TOOL.format(" *({1}) *", combinedGame);
        var regexStr1 = (
            REGEX_STR.PLAYER +
            REGEX_STR.CHARACTER +
            REGEX_STR.VERSUS +
            REGEX_STR.PLAYER +
            REGEX_STR.CHARACTER +
            game +
            endtag
        );
        REGEX_1 = new RegExp(regexStr1);
        var regexStr2 = (
            game + ': ' +
            REGEX_STR.PLAYER +
            REGEX_STR.CHARACTER +
            REGEX_STR.VERSUS +
            REGEX_STR.PLAYER +
            REGEX_STR.CHARACTER +
            endtag
        );
        REGEX_2 = new RegExp(regexStr2);
    }
    buildRegex();
    TOOL.log(REGEX_1);
    TOOL.log(REGEX_2);

    function fixGame(game){
        var res = null;
        for (var key in GAME_REGEX) {
            if (GAME_REGEX.hasOwnProperty(key)) {
                res = GAME_REGEX[key].exec(game);
                if (res){
                    return key;
                }
            }
        }
        return game;
    }

    self.parse = function(dataTuple){
        var timestamp = dataTuple[0];
        var id = dataTuple[1];
        var title = dataTuple[2];

        var res = REGEX_1.exec(title);
        if (res){
            return Video(
                timestamp,
                id,
                title,
                fixGame(res[10]),
                fixer.fixCharacters(res[3], res[8]),
                fixer.fixPlayers(res[1], res[6])
            );
        }
        res = REGEX_2.exec(title);
        if (res){
            return Video(
                timestamp,
                id,
                title,
                fixGame(res[1]),
                fixer.fixCharacters(res[5], res[10]),
                fixer.fixPlayers(res[3], res[8])
            );
        }
        // else
        TOOL.visuLog(title);
        return null;
    };

    return self;
}

function parseJSON(data, parser){
    var res = [];
    data.forEach(function (dataTuple){
        var video = parser(dataTuple);
        if (video){
            res.push(video);
        }
    });
    return res;
}
