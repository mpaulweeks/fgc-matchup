
import java.io._

import scalaj.http._
import org.json4s._
import org.json4s.native.Serialization

case class VideoData(
    id: String,
    game: String,
    timestamp: String,
    characters: List[List[String]],
    players: List[String]
){}

trait Parser {
    val channel: YouTubeChannel

    def parseVideos(): Map[String, VideoData]

    protected def loadVideos(): Map[String, VideoItem] = {
        channel.loadFile
    }
}

object YogaFlameParser extends Parser {
    // reuse Channel class from other file?
    val channel = // foinoern

    def loadVideos(): Map[String, VideoData] = {

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
