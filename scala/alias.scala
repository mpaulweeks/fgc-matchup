
package fgc.alias

import fgc.model.Transform
import fgc.model.VideoData
import fgc.levenshtein.EditDistance.editDist

import scala.collection.mutable

class AliasTracker(typoFixer: String => String) {
    private case class AliasStat(key: String){
        var displayName: String = "(n/a)"
        var matches: Map[String, Int] = Map()
        var count: Int = 0

        def registerMatch(rawName: String): Unit = {
            val matchCount = matches.getOrElse(rawName, 0) + 1
            matches += (rawName -> matchCount)
            count += count + 1
        }

        def determineDisplayName(): Unit = {
            var newDisplayName = matches.keys.reduceLeft { (x,y) =>
                if (matches(x) > matches(y)) x else y
            }
            displayName = newDisplayName
        }
    }

    private val registry: mutable.Map[String, AliasStat] = mutable.Map()
    private var lookup: Map[String, AliasStat] = Map()

    private def leveshtein(stats: List[AliasStat]): Map[String, String] = {
        // need to recursively collapse levenshtein matches
        // cut execution time in half by caching distances
        println("starting levenshtein")
        stats.map { as =>
            val editDistances = stats.filter { os =>
                os.key != as.key
            }.map{ os =>
                (os, editDist(as.key, os.key))
            }
            val closestEdit = editDistances.reduceLeft { (x,y) =>
                if (x._2 < y._2) x else y
            }
            var trueAlias = as
            if (closestEdit._2 <= 1) {
                println(s"found close match! $as & $closestEdit")
                if (closestEdit._1.count > as.count){
                    println(s"found replacement! $closestEdit")
                    trueAlias = closestEdit._1
                }
            }
            (as.key, trueAlias.displayName)
        }.toMap
    }

    def register(rawName: String): Unit = {
        val key = Transform.toKey(rawName)
        val stat = registry.getOrElseUpdate(key, new AliasStat(key))
        stat.registerMatch(rawName)
    }

    def normalize(): Unit = {
        registry.values.foreach(_.determineDisplayName)
        // leveshtein(registry)
        lookup = registry.map{ case(key, alias) =>
            var targetAlias = alias
            val fixedKey = typoFixer(alias.displayName)
            if (!registry.contains(fixedKey)){
                println(fixedKey)
            }
            if (fixedKey != key){
                targetAlias = registry(fixedKey)
            }
            (key, targetAlias)
        }.toMap
    }

    def get(rawName: String): String = {
        lookup(Transform.toKey(rawName)).displayName
    }
}
