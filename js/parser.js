
function YogaFlameParser(){

    var self = {};

    var GAME_REGEX_STR = {
        "SF5": "SF5|SFV|Beta SFV",
        "USF4": "USF4",
        "SF4 AE 2012": "(Arcade Edition|AE)( Version)? +2012",
        "SF4 AE": "Arcade Edition|AE",
        "SF3": "SF3",
        "SFxT": "SFxT",
        "Tekken Tag Tournament 2": "Tekken Tag Tournament 2"
    }
    var GAME_REGEX = {};
    function buildRegex(){
        var rounds = "(X[0-9] )?";
        var player = "([\\w\\.\\- ]+) ";
        var character = "(\\(|\\[) *([\\w\\. ]+) *(\\)|\\]) ";
        var versus = "(Vs|vs)\\.? ";
        var resolution = " *(1080p|720p)";
        var gameRegexArr = [];
        for (var key in GAME_REGEX_STR) {
            if (GAME_REGEX_STR.hasOwnProperty(key)) {
                GAME_REGEX[key] = new RegExp(GAME_REGEX_STR[key]);
                gameRegexArr.push(TOOL.format("({1})", GAME_REGEX_STR[key]));
            }
        }
        var combinedGame = gameRegexArr.join('|');
        var game = TOOL.format(" *({1}) ", combinedGame);
        var regexStr = (
            rounds +
            player +
            character +
            versus +
            player +
            character +
            game +
            resolution
        );
        return new RegExp(regexStr);
    }
    var REGEX = buildRegex();
    TOOL.log(REGEX);

    function fixGame(game){
        var matchingKey = null;
        var res = null;
        for (var key in GAME_REGEX) {
            if (GAME_REGEX.hasOwnProperty(key)) {
                res = GAME_REGEX[key].exec(game);
                if (res){
                    matchingKey = key;
                    break;
                }
            }
        }
        return matchingKey || game;
    }

    function fixCharacters(char1, char2){
        return [[char1], [char2]];
    }

    function fixPlayers(player1, player2){
        return [player1, player2];
    }

    self.parse = function(dataTuple){
        var timestamp = dataTuple[0];
        var id = dataTuple[1];
        var title = dataTuple[2];
        var res = REGEX.exec(title);
        if (!res){
            // TOOL.log(title);
            return null;
        }
        return Video(
            timestamp,
            id,
            title,
            fixGame(res[11]),
            fixCharacters(res[4], res[9]),
            fixPlayers(res[2], res[7])
        );
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
