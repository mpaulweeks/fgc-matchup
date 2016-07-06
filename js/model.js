
function Video(
    timestamp,
    id,
    title,
    game,
    characters,
    players)
{
    var self = {
        timestamp: timestamp,
        id: id,
        title: title,
        game: game,
        characters: characters,
        players: players
    }

    self.isMirror = function(){
        return characters.length == 1;
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
