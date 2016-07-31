
package fgc.model

case class VideoData(
    id: String,
    timestamp: String,
    game: String,
    players: List[String],
    characters: List[List[String]]
){
    val tuple: List[Any] = List(
        timestamp, id, game, players, characters
    )

    def trim(): VideoData = {
        new VideoData(
            id,
            timestamp,
            game,
            players.map(_.trim),
            characters.map(_.map(_.trim))
        )
    }

    def update(
        playerLookup: String => String,
        characterLookup: String => String
    ): VideoData = {
        new VideoData(
            id,
            timestamp,
            game,
            players.map(playerLookup),
            characters.map(_.map(characterLookup))
        )
    }
}
