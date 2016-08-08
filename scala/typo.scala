
package fgc.typo

import java.io.File
import scala.io.Source
import scala.util.parsing.json.JSON

import fgc.model.Transform

class TypoFixer() {
    private val CHARACTER_FILE_PATH = "reference/character_typo.json"
    private val PLAYER_FILE_PATH = "reference/player_typo.json"

    private def loadFile(filePath: String): Map[String, List[String]] = {
        if (!(new File(filePath).exists)){
            throw new Exception
        }
        val jsonString = Source.fromFile(filePath).getLines.mkString
        val jsonMap: Map[String, Any] = JSON.parseFull(jsonString).get.asInstanceOf[Map[String, Any]]
        jsonMap.map { case(fix, typos) =>
            (fix, typos.asInstanceOf[List[String]])
        }.toMap
    }

    private def genInverse(nameMap: Map[String, List[String]]): Map[String, String] = {
        nameMap.map { case(fix, typos) =>
            typos.map(typo => (Transform.toKey(typo), Transform.toKey(fix)))
        }.flatten.toMap
    }

    private val charNameMap: Map[String, List[String]] = loadFile(CHARACTER_FILE_PATH)
    private val charInverse = genInverse(charNameMap)

    private val playerNameMap: Map[String, List[String]] = loadFile(PLAYER_FILE_PATH)
    private val playerInverse = genInverse(playerNameMap)

    def fixPlayer(rawName: String): String = {
        val key = Transform.toKey(rawName)
        playerInverse.getOrElse(key, key)
    }

    def fixCharacter(rawName: String): String = {
        val key = Transform.toKey(rawName)
        charInverse.getOrElse(key, key)
    }
}
