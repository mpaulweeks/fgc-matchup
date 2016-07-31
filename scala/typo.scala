
package fgc.typo

import java.io.File
import scala.io.Source
import scala.util.parsing.json.JSON

import fgc.model.Transform

class TypoFixer() {
    private val CHARACTER_FILE_PATH = "reference/character_typo.json"

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

    private val charNameMap: Map[String, List[String]] = loadFile(CHARACTER_FILE_PATH)
    private val charInverse = charNameMap.map { case(fix, typos) =>
        typos.map(typo => (Transform.toKey(typo), Transform.toKey(fix)))
    }.flatten.toMap

    def fixPlayer(rawName: String): String = {
        Transform.toKey(rawName)
    }

    def fixCharacter(rawName: String): String = {
        val key = Transform.toKey(rawName)
        charInverse.getOrElse(key, key)
    }
}
