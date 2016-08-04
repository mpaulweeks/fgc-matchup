
package fgc.parser

import scala.util.matching.Regex
import scala.collection.immutable.ListMap

import fgc.model.VideoData
import fgc.model.VideoItem
import fgc.channel.YouTubeChannel
import fgc.logger.Logger

object YouTubeChannelParser {
    val Parsers = List(
        YogaFlameParser,
        OlympicGamingParser
    )
}

trait ChannelParser {
    val channel: YouTubeChannel
    def loadVideos(): List[VideoData] = {
        channel.loadFile.values.flatMap { videoItem =>
            val opt = parseVideo(videoItem)
            if (!opt.isDefined){
                Logger.parsingFailure(channel.fileName, videoItem.title)
            }
            opt
        }.toList
    }

    def fixRegex(rawRegexStr: String): Regex = { ("(?i)" + rawRegexStr).r }

    trait VideoParser {
        val regexStr: String
        def parseSuccess(videoItem: VideoItem, regexMatch: List[String]): VideoData {}
    }
    val parsers: List[VideoParser]
    def parseVideo(videoItem: VideoItem): Option[VideoData] = {
        parsers.flatMap { parser =>
            fixRegex(parser.regexStr).findFirstMatchIn(videoItem.title).map { m =>
                parser.parseSuccess(videoItem, m.subgroups)
            }
        }.headOption
    }

    val rPlayer = "(?:[\\w ]* (?:ft |ft\\.))? *([\\w\\.\\-\\| ]+) *"
    val rCharacter = " *(?:\\(|\\[) *([\\w\\. ]+) *(?:\\)|\\]) *"
    val rVersus = "(?:vs)\\.? "
    val rGameMap: Map[String, String]
    def rGame(): String = {
        val rGames = rGameMap.values.mkString("|")
        s" *($rGames) *"
    }

    def fixGame(rawGame: String): String = {
        rGameMap.flatMap { case (key, gameRegexStr) =>
            fixRegex(gameRegexStr).findFirstIn(rawGame).map { m => key }
        }.head
    }
    def fixCharacters(char1: String, char2: String): List[List[String]] = {
        List(List(char1), List(char2))
    }
    def fixPlayers(player1: String, player2: String): List[String] = {
        List(player1, player2)
    }
}

object YogaFlameParser extends ChannelParser {
    val channel = YouTubeChannel.YogaFlame

    val rGameMap = ListMap(
        "SF5" -> "SF5|SFV|Beta SFV",
        "USF4" -> "USF4",
        "SSF4AE2012" -> "(?:Arcade Edition|AE)(?: Version)? +2012",
        "SSF4AE" -> "Arcade Edition|AE",  // todo this collides with above
        "SF3" -> "SF3",
        "SFxT" -> "SFxT",
        "GGXrdRev" -> "GGXrd Rev|GGXrd REVELATOR",
        "GGXrd" -> "GGXrd",
        "TTT2" -> "Tekken Tag Tournament 2"
    )
    val rRounds = "(?:X[0-9] )?"
    val rResolution = " *(?:1080p|720p)"

    object GameLastParser extends VideoParser {
        val regexStr = (
            rRounds +
            rPlayer +
            rCharacter +
            rVersus +
            rPlayer +
            rCharacter +
            rGame +
            rResolution
        )
        def parseSuccess(videoItem: VideoItem, regexMatch: List[String]): VideoData = {
            new VideoData(
                videoItem.id,
                videoItem.timestamp,
                fixGame(regexMatch(4)),
                fixPlayers(regexMatch(0), regexMatch(2)),
                fixCharacters(regexMatch(1), regexMatch(3))
            )
        }
    }
    object GameFirstParser extends VideoParser {
        val regexStr = (
            rGame + " *- *" +
            rRounds +
            rPlayer +
            rCharacter +
            rVersus +
            rPlayer +
            rCharacter +
            rResolution
        )
        def parseSuccess(videoItem: VideoItem, regexMatch: List[String]): VideoData = {
            new VideoData(
                videoItem.id,
                videoItem.timestamp,
                fixGame(regexMatch(0)),
                fixPlayers(regexMatch(1), regexMatch(3)),
                fixCharacters(regexMatch(2), regexMatch(4))
            )
        }
    }
    val parsers = List(GameLastParser, GameFirstParser)
}

object OlympicGamingParser extends ChannelParser {
    val channel = YouTubeChannel.OlympicGaming

    val rGameMap = ListMap(
        "SF5" -> "Street Fighter (?:5 *\\/? *V|5|V)|SFV",
        "SFxT" -> "Street Fighter X Tekken",
        "P4AU" -> "Persona 4 Arena Ultimax",
        "MKX" -> "Mortal Kombat X",
        "SC5" -> "SoulCalibur 5\\/V",
        "DOA5" -> "Dead Or Alive 5 Last Round",
        "Smash4" -> "Super Smash Bros *Wii U",
        "GGXrd" -> "Guilty Gear Xrd|Guilty Gear",
        "KI" -> "Killer Instinct"
    )
    val rEndtag = "(?:Wii|Xbox|PS4|-? ?Gameplay).*"

    object GameLastParser extends VideoParser {
        val regexStr = (
            rPlayer +
            rCharacter +
            rVersus +
            rPlayer +
            rCharacter +
            rGame +
            rEndtag
        )
        def parseSuccess(videoItem: VideoItem, regexMatch: List[String]): VideoData = {
            new VideoData(
                videoItem.id,
                videoItem.timestamp,
                fixGame(regexMatch(4)),
                fixPlayers(regexMatch(0), regexMatch(2)),
                fixCharacters(regexMatch(1), regexMatch(3))
            )
        }
    }
    object GameFirstParser extends VideoParser {
        val regexStr = (
            rGame + ": " +
            rPlayer +
            rCharacter +
            rVersus +
            rPlayer +
            rCharacter +
            rEndtag
        )
        def parseSuccess(videoItem: VideoItem, regexMatch: List[String]): VideoData = {
            new VideoData(
                videoItem.id,
                videoItem.timestamp,
                fixGame(regexMatch(0)),
                fixPlayers(regexMatch(1), regexMatch(3)),
                fixCharacters(regexMatch(2), regexMatch(4))
            )
        }
    }
    val parsers = List(GameLastParser, GameFirstParser)
}
