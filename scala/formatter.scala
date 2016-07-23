
package fgc.formatter

import fgc.model.VideoData
import fgc.scraper.VideoItem
import fgc.scraper.YouTubeChannel
import fgc.normalizer.PlayerNormalizer

import java.io._
import scala.util.matching.Regex
import scala.collection.immutable.ListMap

import scalaj.http._
import org.json4s._
import org.json4s.native.Serialization

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
        parsers.flatMap { parser =>
            parser.regex.findFirstMatchIn(videoItem.title).map { m =>
                parser.parseSuccess(videoItem, m.subgroups)
            }
        }.headOption
    }

    val rPlayer = " *([\\w\\.\\-\\| ]+) *"
    val rCharacter = " *(?:\\(|\\[) *([\\w\\. ]+) *(?:\\)|\\]) *"
    val rVersus = "(?:Vs|vs)\\.? "
    val rGameMap: Map[String, String]
    def rGame(): String = {
        val rGames = rGameMap.values.mkString("|")
        s" *($rGames) *"
    }

    def fixGame(rawGame: String): String = {
        rGameMap.flatMap { case (key, value) =>
            value.r.findFirstIn(rawGame).map { m => key }
        }.head
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

    val rGameMap = ListMap(
        "SF5" -> "SF5|SFV|Beta SFV",
        "USF4" -> "USF4",
        "SSF4AE2012" -> "(?:Arcade Edition|AE)(?: Version)? +2012",
        "SSF4AE" -> "Arcade Edition|AE",  // todo this collides with above
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
    object GameFirstParser extends VideoParser {
        val regex = (
            rGame + " - " +
            rRounds +
            rPlayer +
            rCharacter +
            rVersus +
            rPlayer +
            rCharacter +
            rResolution
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

object OlympicGamingParser extends ChannelParser {
    val channel = YouTubeChannel.OlympicGaming

    val rGameMap = ListMap(
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
        parsers.map(p => p.loadVideos).flatten.map(_.trim)
    }

    def formatVideos(rawVideos: List[VideoData]): List[VideoData] = {
        PlayerNormalizer.normalize(rawVideos)
    }
}

object Formatter {
    def run(): Boolean = {
        println("running formatter")        
        val videos = VideoManager.loadVideos
        val formatted = VideoManager.formatVideos(videos)
        VideoManager.toFile(formatted)
        (videos != formatted)
    }

    def main(args: Array[String]) {
        println(run)
    }
}
