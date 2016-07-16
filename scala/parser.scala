
import java.io._

import scalaj.http._
import org.json4s._
import org.json4s.native.Serialization

case class VideoData(
    id: String,
    timestamp: String,
    game: String,
    characters: List[List[String]],
    players: List[String]
){}

trait Parser {
    val channel: YouTubeChannel
    def parseVideo(videoItem: VideoItem): VideoData

    def loadVideos(): Map[String, VideoData] = {
        val videoItemMap = channel.loadFile
        videoItemMap.map { case (key, item) =>
            (key, parseVideo(item))
        }
    }

    val rPlayer = "([\\w\\.\\-\| ]+) "
    val rCharacter = "(?:\\(|\\[) *([\\w\\. ]+) *(?:\\)|\\]) "
    val rVersus = "(?:Vs|vs)\\.? "
    val rGameMap
    def fixGame(rawGame: String): String = {
        var matchingKey = ""
        rGameMap.foreach ( case (key, value) =>
            if (value.r.findFirstIn(rawGame).length > 0){
                matchingKey = key
            }
        )
        matchingKey
    }
    def fixCharacters(char1: String, char2: String): List[String] = {
        List(List(char1), List(char2))
    }
    def fixPlayers(player1: String, player2: String): List[String] = {
        List(player1, player2)
    }
}

object YogaFlameParser extends Parser {
    val channel = YouTubeChannel.YogaFlame // foinoern

    val rGameMap = Map(
        "SF5" -> "SF5|SFV|Beta SFV",
        "USF4" -> "USF4",
        "SSF4AE2012" -> "(?:Arcade Edition|AE)(?: Version)? +2012",
        "SSF4AE" -> "Arcade Edition|AE",
        "SF3" -> "SF3",
        "SFxT" -> "SFxT",
        "TTT2" -> "Tekken Tag Tournament 2"
    )
    val regex = {
        val rRounds = "(?:X[0-9] )?"
        val rResolution = " *(?:1080p|720p)"
        val rGames = rGameMap.values.mkString("|")
        val rGame = s" *($rGames) "
        val regexStr = (
            rRounds +
            rPlayer +
            rCharacter +
            rVersus +
            rPlayer +
            rCharacter +
            rGame +
            rResolution
        );
        return regexStr.r
    }

    def parseVideo(videoItem): VideoData = {
        val matches = regex.findFirstIn(videoItem.title)
        new VideoData(
            videoItem.id,
            videoItem.timestamp,
            fixGame(matches(5)),
            fixCharacters(matches(2), matches(4)),
            fixPlayers(matches(1), matches(3))
        )
    }
}

object VideoManager {
    private val DATA_FILE_PATH = "data/video.json"
    private val parsers = List(
        YogaFlameParser,
    )

    private def toFile(videoDatas: List[VideoData]): String = {
        val sortedVideos = (
            videoDatas
            .sortBy(r => (r.timestamp, r.id)).reverse
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
        var videoMap = Map()
        parsers.foreach { parser =>
            videoMap = videoMap ++ parser.loadVideos
        }
        videoMap.values.toSeq
    }
}
