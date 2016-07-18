
package fgc.runtime

import fgc.scraper.Scraper
import fgc.formatter.Formatter

object Main {
    def run(): Unit = {
        // val newVideos = Scraper.run
        val parsed = Formatter.run
    }

    def main(args: Array[String]) {
        println("running main")
        // run
    }
}