
package fgc.formatter

import java.io.BufferedWriter
import java.io.File
import java.io.FileWriter

import org.json4s.NoTypeHints
import org.json4s.native.Serialization

import fgc.model.VideoData
import fgc.parser.YogaFlameParser
import fgc.parser.OlympicGamingParser
import fgc.normalizer.Normalizer
import fgc.logger.Logger

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
        Normalizer.normalize(rawVideos)
    }
}

object Formatter {
    def run(): Boolean = {
        println("running formatter")        
        val videos = VideoManager.loadVideos
        val formatted = VideoManager.formatVideos(videos)
        VideoManager.toFile(formatted)
        Logger.logParsing
        (videos != formatted)
    }

    def main(args: Array[String]) {
        println(run)
    }
}
