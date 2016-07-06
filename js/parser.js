
var GAME_SF5 = "SF5";
var GAME_SF4_2012 = "Arcade Edition 2012";

function fixGame(game){
    if (game == "SFV"){
        game = GAME_SF5;
    }
    if (game == "AE Version 2012" || game == "AE 2012"){
        game = GAME_SF4_2012;
    }
    return game;
}

function fixCharacters(char1, char2){
    if (char1 == char2){
        return [char1];
    }
    return [char1, char2];
}

function fixPlayers(player1, player2){
    return [player1, player2];
}

var REGEX_YOGAFLAME = /(X[0-9] )?([\w\.\- ]+) \( ([\w\. ]+) \) (Vs|vs) ([\w\.\- ]+) \( ([\w\. ]+) \) +(SF5|SFV|USF4|Arcade Edition +2012|Arcade Edition Version 2012|AE Version 2012|AE 2012|Arcade Edition|SF3) (1080p|720p)/;

function parseYogaFlame(dataTuple){
    var timestamp = dataTuple[0];
    var id = dataTuple[1];
    var title = dataTuple[2];
    var res = REGEX_YOGAFLAME.exec(title);
    if (!res){
        TOOL.log(title);
        return null;
    }
    return Video(
        timestamp,
        id,
        title,
        fixGame(res[7]),
        fixCharacters(res[3], res[6]),
        fixPlayers(res[2], res[5])
    );
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
