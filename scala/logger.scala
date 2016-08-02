
package fgc.logger

import java.io.BufferedWriter
import java.io.File
import java.io.FileWriter
import scala.collection.mutable

object Logger {
    private var parsingLogs = mutable.Map[String, mutable.ListBuffer[String]]()

    def parsingFailure(channelName: String, videoTitle: String): Unit = {
        var channelLog = parsingLogs.getOrElseUpdate(channelName, new mutable.ListBuffer)
        channelLog += s"$videoTitle"
    }

    def logParsing(): Unit = {
        parsingLogs.foreach { case (channelName, logs ) =>
            val file = new File(s"logs/parse-$channelName.txt")
            val bw = new BufferedWriter(new FileWriter(file))
            logs.foreach { line =>
                bw.write(line + "\n")
            }
            bw.close
        }
        parsingLogs = mutable.Map()
    }
}
