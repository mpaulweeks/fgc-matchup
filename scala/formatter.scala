
package fgc.formatter

import java.io.BufferedWriter
import java.io.File
import java.io.FileWriter

import fgc.model.VideoData
import fgc.parser.YouTubeChannelParser
import fgc.normalizer.Normalizer
import fgc.logger.Logger

object VideoManager {
    private val DATA_FILE_PATH = "data/video.json"

    def toFile(videoDatas: List[VideoData]): String = {
        val sortedVideos = (
            videoDatas
            .sortBy(r => (r.timestamp, r.id)).reverse
            .map(_.json)
        )
        val serialized = "[\n" + sortedVideos.mkString(",\n") + "\n]"
        val file = new File(DATA_FILE_PATH)
        val bw = new BufferedWriter(new FileWriter(file))
        bw.write(serialized)
        bw.close
        serialized
    }

    def loadVideos(): List[VideoData] = {
        (
            YouTubeChannelParser.Parsers
            .map(p => p.loadVideos)
            .flatten
            .map(_.trim)
        )
    }

    def formatVideos(rawVideos: List[VideoData]): List[VideoData] = {
        Normalizer.normalize(rawVideos)
    }
}

object Formatter {
    def run(): Boolean = {
        println("running formatter")
        println("parsing videos")
        val videos = VideoManager.loadVideos
        println("normalizing videos")
        val formatted = VideoManager.formatVideos(videos)
        VideoManager.toFile(formatted)
        Logger.logParsing
        (videos != formatted)
    }

    def main(args: Array[String]) {
        println(run)
    }
}
