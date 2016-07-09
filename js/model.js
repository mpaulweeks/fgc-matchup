
function Player(name){
    var self = {};
    self.name = name;
    self.id = TOOL.fixValue(TYPO.fixPlayerName(name));
    return self;
}

function Video(
    timestamp,
    id,
    title,
    game,
    characterTuples,
    playerNames)
{
    var self = {
        game: game,
    }


    var date = timestamp.split('T')[0];
    var allChars = new Set();
    var characterSets = [new Set(characterTuples[0]), new Set(characterTuples[1])];
    characterSets.forEach(function (charSet){
        charSet.forEach(function (char){
            allChars.add(char);
        });
    });
    self.characters = Array.from(allChars);
    self.players = [];
    playerNames.forEach(function (playerName){
        self.players.push(Player(playerName));
    });

    function characterStr(index){
        return characterTuples[index].join(', ');
    }

    self.isMirror = function(char){
        // check if both player's rosters contain char
        return characterSets[0].has(char) && characterSets[1].has(char);
    }

    self.iFrame = function(){
        var html = (
            '<iframe id="ytplayer" type="text/html" width="640" height="390" src="https://www.youtube.com/embed/'
            + self.id
            + '?autoplay=1"  frameborder="0"></iframe>'
        );
        return html;
    }

    var youtubeLink = '<a class="external" target="_blank" href="https://youtu.be/{1}">{2}</a>';
    var playerClass = 'link-player';
    var characterClass = 'link-character';

    self.toData = function(){
        return [
            TOOL.format(youtubeLink, id, date),
            TOOL.internalLink(playerClass, self.players[0].id, self.players[0].name),
            TOOL.internalLink(characterClass, characterStr(0)),
            TOOL.internalLink(playerClass, self.players[1].id, self.players[1].name),
            TOOL.internalLink(characterClass, characterStr(1)),
        ];
    }

    return self;
}
