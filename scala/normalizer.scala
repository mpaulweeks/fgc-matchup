
package fgc.normalizer

import fgc.model.VideoData
import fgc.alias.AliasTracker

object Normalizer {
    def normalize(rawVideos: List[VideoData]): List[VideoData] = {
        val pTracker = new AliasTracker()
        val cTracker = new AliasTracker()
        rawVideos.foreach { videoData =>
            videoData.players.foreach(pTracker.register)
            videoData.characters.foreach(_.foreach(cTracker.register))
        }
        pTracker.normalize
        cTracker.normalize
        rawVideos.map(_.update(pTracker.get, cTracker.get))
    }
}
