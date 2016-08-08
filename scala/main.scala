
package fgc.runtime

import fgc.scraper.Scraper
import fgc.formatter.Formatter

object Main {
    def run(): Unit = {
        val newVideos = Scraper.run
        if (newVideos){
            Formatter.run
        } else {
            println("no new videos, skipping formatter")
        }
    }

    def main(args: Array[String]) {
        println("running main")
        run
    }
}

object Debug {
    def main(args: Array[String]) {
        // fill with whatever
        import fgc.parser.VGBootCampParser
        println(VGBootCampParser.GameLastParser.regexStr)
    }
}
