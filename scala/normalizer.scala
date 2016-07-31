
package fgc.normalizer

import fgc.model.VideoData
import fgc.alias.AliasTracker
import fgc.typo.TypoFixer

object Normalizer {
    def normalize(rawVideos: List[VideoData]): List[VideoData] = {
        val typoFixer = new TypoFixer()
        val pTracker = new AliasTracker(typoFixer.fixPlayer)
        val cTracker = new AliasTracker(typoFixer.fixCharacter)
        rawVideos.foreach { videoData =>
            videoData.players.foreach(pTracker.register)
            videoData.characters.foreach(_.foreach(cTracker.register))
        }
        pTracker.normalize
        cTracker.normalize
        rawVideos.map(_.update(pTracker.get, cTracker.get))
    }
}
