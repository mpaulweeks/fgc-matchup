
package fgc.model

import org.json4s.NoTypeHints
import org.json4s.native.Serialization

object Transform{
    def toKey(rawName: String): String = rawName.toLowerCase.trim.replace(" ", "").replace("_", "").replace("-", "")
}

case class VideoItem(timestamp: String, id: String, title: String) {
    val tuple: List[String] = List(timestamp, id, title)
}

object VideoData {
    val meleeColors = List(
        "Black",
        "Blue",
        "Green",
        "Orange",
        "Pink",
        "Purple",
        "Red",
        "White"
    )
    // todo: make this a generic lookup by game
    val meleeTypos: Map[String, List[String]] = Map(
        "Captian Falcon Fox" -> List("Captain Falcon", "Fox"),
        "Falco Fox" -> List("Falco", "Fox"),
        "Marth Sheik" -> List("Marth", "Sheik"),
        "Sheik Marth" -> List("Sheik", "Marth")
    )
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

    def fixCharacters(): VideoData = {
        if (game == "Melee"){
            val fixedCharacters = List(0,1).map{ i =>
                var chars = characters(i)
                if (chars.length == 1) {
                    chars = VideoData.meleeTypos.getOrElse(chars(0), chars)
                }
                chars.map{ char =>
                    var fixed = char
                    VideoData.meleeColors.foreach{ col =>
                        if (fixed.startsWith(col)){
                            fixed = fixed.stripPrefix(col)
                        }
                    }
                    fixed = fixed.trim()
                    if (fixed == ""){
                        fixed = characters(1-i)(0)
                    }
                    fixed
                }.toList
            }.toList
            new VideoData(
                id,
                timestamp,
                game,
                players,
                fixedCharacters
            )
        } else {
            this
        }
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
