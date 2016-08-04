
package fgc.model

import org.json4s.NoTypeHints
import org.json4s.native.Serialization

object Transform{
    def toKey(rawName: String): String = rawName.toLowerCase.trim.replace(" ", "").replace("_", "").replace("-", "")
}

case class VideoItem(timestamp: String, id: String, title: String) {
    val tuple: List[String] = List(timestamp, id, title)
}

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

    implicit val formats = Serialization.formats(NoTypeHints)
    val json: String = Serialization.write(tuple)

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
