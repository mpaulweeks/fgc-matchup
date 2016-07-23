
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

    // todo de-dupe
    def reduce(rawName: String): String = rawName.toLowerCase.trim.replace(" ", "")

    def trim(): VideoData = {
        new VideoData(
            id,
            timestamp,
            game,
            players.map(p => p.trim),
            characters.map(cl => cl.map(cn => cn.trim))
        )
    }

    def updatePlayers(keyLookup: Map[String, String]): VideoData = {
        new VideoData(
            id,
            timestamp,
            game,
            players.map(p => keyLookup(reduce(p))),
            characters
        )
    }
}
