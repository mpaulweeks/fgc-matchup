
function Video(
    timestamp,
    id,
    title,
    game,
    characterTuples,
    players)
{
    var self = {
        game: game,
        players: players
    }

    var date = timestamp.split('T')[0];
    var _char = new Set();
    var characterSets = [new Set(characterTuples[0]), new Set(characterTuples[1])];
    characterSets.forEach(function (charSet){
        charSet.forEach(function (char){
            _char.add(char);
        });
    });
    self.characters = Array.from(_char);

    function characterStr(index){
        return characterTuples[index].join(', ');
    }

    self.isMirror = function(char){
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

    var linkTemplate = '<a target="_blank" href="https://youtu.be/{1}">{2}</a>';

    self.toData = function(){
        return [
            TOOL.format(linkTemplate, id, date),
            self.players[0],
            characterStr(0),
            self.players[1],
            characterStr(1)
        ];
    }

    return self;
}
