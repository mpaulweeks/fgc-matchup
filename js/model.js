
function Video(
    timestamp,
    id,
    title,
    game,
    characterTuples,
    players)
{
    var self = {
        timestamp: timestamp,
        id: id,
        title: title,
        game: game,
        players: players
    }

    var _char = new Set();
    var characterSets = [new Set(characterTuples[0]), new Set(characterTuples[1])];
    characterSets.forEach(function (charSet){
        charSet.forEach(function (char){
            _char.add(char);
        });
    });
    self.characters = Array.from(_char);

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

    self.toHTML = function(){
        return '<li>' + self.title +'</li>';
    }

    return self;
}
