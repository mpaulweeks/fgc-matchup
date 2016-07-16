
// todo delete this file

var OlympicParser = (function(){
    var self = {};
    var fixer = FIXER;

    var GAME_REGEX_STR = {
        SF5: "Street Fighter (?:5 */? *V|5|V)|SFV",
        SFxT: "Street Fighter X Tekken",
        P4AU: "Persona 4 Arena Ultimax",
        MKX: "Mortal Kombat X",
        SC5: "SoulCalibur 5\/V",
        DOA5: "Dead Or Alive 5 Last Round",
        Smash4: "Super Smash Bros Wii U",
        GGXrd: "Guilty Gear Xrd",
        KI: "Killer Instinct",
    }
    var GAME_REGEX = {};
    var REGEX_1 = null;
    var REGEX_2 = null;
    function buildRegex(){
        var endtag = "(?:Wii|Xbox|PS4|-? ?Gameplay).*";
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
            return VideoItem(
                timestamp,
                id,
                title,
                fixGame(res[5]),
                fixer.fixCharacters(res[2], res[4]),
                fixer.fixPlayers(res[1], res[3])
            );
        }
        res = REGEX_2.exec(title);
        if (res){
            return VideoItem(
                timestamp,
                id,
                title,
                fixGame(res[1]),
                fixer.fixCharacters(res[3], res[5]),
                fixer.fixPlayers(res[2], res[4])
            );
        }
        // else
        TOOL.visuLog(title);
        return null;
    };

    return self;
})();
