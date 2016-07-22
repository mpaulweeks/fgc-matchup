
package fgc.normalizer

import fgc.model.VideoData

import scala.collection.mutable

object PlayerNormalizer {

    class AliasTracker() {
        case class AliasStat(
            displayName: String = "(default)",
            matches: Map[String, Int] = Map[String, Int](),
            count: Int = 0
        ){
            def register(rawName: String): AliasStat = {
                val matchCount = matches.getOrElse(rawName, 0) + 1
                new AliasStat(
                    displayName,
                    matches + (rawName -> matchCount),
                    count + 1    
                )
            }

            def determineDisplayName(): AliasStat = {
                
                new AliasStat(
                    newDisplayName,
                    matches,
                    count
                )                
            }
        }

        val lookup: mutable.Map[String, AliasStat] = new mutable.Map()

        private def reduce(rawName) = rawName.toLowerCase.trim.replace(" ", "")

        def register(rawName: String): Unit = {
            val key = reduce(rawName)
            val stat = lookup.getOrElse(key, new AliasStat())
            lookup(key) = stat.register(rawName)
        }

        def normalize(): Unit = {

        }
    }

    def generateTracker(videos: List[VideoData]): AliasTracker = {
        val tracker = new AliasTracker()
        videos.foreach { videoData =>
            videoData.players.foreach(tracker.register)
        }
        tracker
    }

    def normalize(rawVideos: List[VideoData]): List[VideoData] = {
        val tracker = generateTracker(rawVideos)
        tracker.normalize

    }
}
