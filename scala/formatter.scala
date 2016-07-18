
package fgc.formatter

import fgc.scraper.VideoItem
import fgc.scraper.YouTubeChannel

import java.io._
import scala.util.matching.Regex

import scalaj.http._
import org.json4s._
import org.json4s.native.Serialization

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
}

trait ChannelParser {
    val channel: YouTubeChannel
    def loadVideos(): List[VideoData] = {
        channel.loadFile.values.flatMap(parseVideo).toList
    }

    trait VideoParser {
        val regex: Regex
        def parseSuccess(videoItem: VideoItem, regexMatch: List[String]): VideoData {}
    }
    val parsers: List[VideoParser]
    def parseVideo(videoItem: VideoItem): Option[VideoData] = {
        var toRet: Option[VideoData] = None
        parsers.foreach { parser =>
            val matchMaybe = parser.regex.findFirstMatchIn(videoItem.title)
            matchMaybe match {
                case Some(matchRes) => {
                    val regexMatch = matchRes.subgroups
                    toRet = Option(parser.parseSuccess(videoItem, regexMatch))
                }
                case None => {}
            }
        }
        if (toRet == None){
            // failed regex, maybe log?
        }
        toRet
    }

    val rPlayer = "([\\w\\.\\-\\| ]+) "
    val rCharacter = "(?:\\(|\\[) *([\\w\\. ]+) *(?:\\)|\\]) "
    val rVersus = "(?:Vs|vs)\\.? "
    val rGameMap: Map[String, String]
    def rGame(): String = {
        val rGames = rGameMap.values.mkString("|")
        s" *($rGames) *"
    }

    def fixGame(rawGame: String): String = {
        // todo improve this
        var matchingKey = ""
        rGameMap.foreach { case (key, value) =>
            val matchMaybe = value.r.findFirstIn(rawGame)
            matchMaybe match {
                case Some(name) =>
                    matchingKey = key
                case None =>
                    // do nothing
            }
        }
        matchingKey
    }
    def fixCharacters(char1: String, char2: String): List[List[String]] = {
        List(List(char1), List(char2))
    }
    def fixPlayers(player1: String, player2: String): List[String] = {
        List(player1, player2)
    }
}

object YogaFlameParser extends ChannelParser {
    val channel = YouTubeChannel.YogaFlame

    val rGameMap = Map(
        "SF5" -> "SF5|SFV|Beta SFV",
        "USF4" -> "USF4",
        "SSF4AE2012" -> "(?:Arcade Edition|AE)(?: Version)? +2012",
        "SSF4AE" -> "Arcade Edition|AE",
        "SF3" -> "SF3",
        "SFxT" -> "SFxT",
        "TTT2" -> "Tekken Tag Tournament 2"
    )
    val rRounds = "(?:X[0-9] )?"
    val rResolution = " *(?:1080p|720p)"

    object GameLastParser extends VideoParser {
        val regex = (
            rRounds +
            rPlayer +
            rCharacter +
            rVersus +
            rPlayer +
            rCharacter +
            rGame +
            rResolution
        ).r
        def parseSuccess(videoItem: VideoItem, regexMatch: List[String]): VideoData = {
            new VideoData(
                videoItem.id,
                videoItem.timestamp,
                fixGame(regexMatch(4)),
                fixPlayers(regexMatch(0), regexMatch(2)),
                fixCharacters(regexMatch(1), regexMatch(3))
            )
        }
    }
    val parsers = List(GameLastParser)
}

object OlympicGamingParser extends ChannelParser {
    val channel = YouTubeChannel.OlympicGaming

    val rGameMap = Map(
        "SF5" -> "Street Fighter (?:5 *\\/? *V|5|V)|SFV",
        "SFxT" -> "Street Fighter X Tekken",
        "P4AU" -> "Persona 4 Arena Ultimax",
        "MKX" -> "Mortal Kombat X",
        "SC5" -> "SoulCalibur 5\\/V",
        "DOA5" -> "Dead Or Alive 5 Last Round",
        "Smash4" -> "Super Smash Bros Wii U",
        "GGXrd" -> "Guilty Gear Xrd",
        "KI" -> "Killer Instinct"
    )
    // val rEndtag = " *(?:[\\w ]*-? *Gameplay).*"
    val rEndtag = "(?:Wii|Xbox|PS4|-? ?Gameplay).*"

    object GameLastParser extends VideoParser {
        val regex = (
            rPlayer +
            rCharacter +
            rVersus +
            rPlayer +
            rCharacter +
            rGame +
            rEndtag
        ).r
        def parseSuccess(videoItem: VideoItem, regexMatch: List[String]): VideoData = {
            new VideoData(
                videoItem.id,
                videoItem.timestamp,
                fixGame(regexMatch(4)),
                fixPlayers(regexMatch(0), regexMatch(2)),
                fixCharacters(regexMatch(1), regexMatch(3))
            )
        }
    }
    object GameFirstParser extends VideoParser {
        val regex = (
            rGame + ": " +
            rPlayer +
            rCharacter +
            rVersus +
            rPlayer +
            rCharacter +
            rEndtag
        ).r
        def parseSuccess(videoItem: VideoItem, regexMatch: List[String]): VideoData = {
            new VideoData(
                videoItem.id,
                videoItem.timestamp,
                fixGame(regexMatch(0)),
                fixPlayers(regexMatch(1), regexMatch(3)),
                fixCharacters(regexMatch(2), regexMatch(4))
            )
        }
    }
    val parsers = List(GameLastParser, GameFirstParser)
}

object VideoManager {
    private val DATA_FILE_PATH = "data/video.json"
    private val parsers = List(
        YogaFlameParser,
        OlympicGamingParser
    )

    def toFile(videoDatas: List[VideoData]): String = {
        val sortedVideos = (
            videoDatas
            .sortBy(r => (r.timestamp, r.id)).reverse
            .map(_.tuple)
        )
        implicit val formats = Serialization.formats(NoTypeHints)
        val serialized = Serialization.writePretty(sortedVideos)
        val file = new File(DATA_FILE_PATH)
        val bw = new BufferedWriter(new FileWriter(file))
        bw.write(serialized)
        bw.close
        serialized
    }

    def loadVideos(): List[VideoData] = {
        parsers.map(p => p.loadVideos).flatten
    }

    def formatVideos(rawVideos: List[VideoData]): List[VideoData] = {
        // todo player/character normalization
        rawVideos
    }
}

object Formatter {
    def run(): Boolean = {
        val videos = VideoManager.loadVideos
        val formatted = VideoManager.formatVideos(videos)
        VideoManager.toFile(formatted)
        true
    }

    def main(args: Array[String]) {
        println("running formatter")
        println(run)
    }
}
