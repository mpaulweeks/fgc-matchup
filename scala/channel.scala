
package fgc.channel

import java.io.BufferedWriter
import java.io.File
import java.io.FileWriter
import scala.collection.breakOut
import scala.io.Source
import scala.util.parsing.json.JSON

import org.json4s.NoTypeHints
import org.json4s.native.Serialization

import fgc.model.VideoItem

case class YouTubeChannel(fileName: String, playlistId: String) {
    private val DATA_FILE_PATH = s"data/$fileName.json"

    def loadFile(): Map[String, VideoItem] = {
        if (!(new File(DATA_FILE_PATH).exists)){
            throw new Exception
        }
        val jsonString = Source.fromFile(DATA_FILE_PATH).getLines.mkString
        val jsonMap: List[Any] = JSON.parseFull(jsonString).get.asInstanceOf[List[Any]]
        jsonMap.map { item =>
            val videoTuple: List[String] = item.asInstanceOf[List[String]]
            val videoItem = new VideoItem(videoTuple(0), videoTuple(1), videoTuple(2))
            (videoItem.id, videoItem)
        }(breakOut)
    }

    def toFile(videoMap: Map[String, VideoItem]): String = {
        val sortedVideos = (
            videoMap.values.toSeq
            .sortBy(r => (r.timestamp, r.id)).reverse
            .map(item => item.tuple)
        )
        implicit val formats = Serialization.formats(NoTypeHints)
        val serialized = Serialization.writePretty(sortedVideos)
        val file = new File(DATA_FILE_PATH)
        val bw = new BufferedWriter(new FileWriter(file))
        bw.write(serialized)
        bw.close
        serialized
    }
}

object YouTubeChannel {
    val YogaFlame = new YouTubeChannel("YogaFlame24", "UU1UzB_b7NSxoRjhZZDicuqw")
    val OlympicGaming = new YouTubeChannel("TubeOlympicGaming", "UUg5TGonF8hxVU_YVVaOC_ZQ")
    val BlackVegeta = new YouTubeChannel("XblackvegetaX", "UU0B_RY99vT1r13YJYA9SfXQ")
    val TokidoBlog = new YouTubeChannel("Tokidoblog", "UUBznN6sKP6Cts3OceowtEnA")
    val SF5Channel = new YouTubeChannel("UCskcifXzKVhmof87fefuxsA", "UUskcifXzKVhmof87fefuxsA")
    val iShoryukenTV = new YouTubeChannel("iShoryukenTV", "UU6scX38N_OxTIGDzHjZ9a4Q")

    val Channels = List(
        YogaFlame,
        OlympicGaming
    )
}
