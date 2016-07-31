
package fgc.alias

import fgc.model.Transform
import fgc.model.VideoData
import fgc.levenshtein.EditDistance.editDist

import scala.collection.mutable

class AliasTracker(typoFixer: String => String) {
    private case class AliasStat(
        key: String,
        displayName: String = "(n/a)",
        matches: Map[String, Int] = Map[String, Int](),
        count: Int = 0
    ){
        def register(rawName: String): AliasStat = {
            val matchCount = matches.getOrElse(rawName, 0) + 1
            new AliasStat(
                key,
                displayName,
                matches + (rawName -> matchCount),
                count + 1
            )
        }

        def determineDisplayName(): AliasStat = {
            var newDisplayName = matches.keys.reduceLeft { (x,y) =>
                if (matches(x) > matches(y)) x else y
            }
            setDisplayName(newDisplayName)
        }

        def setDisplayName(newDisplayName: String): AliasStat = {
            new AliasStat(
                key,
                newDisplayName,
                matches,
                count
            )
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
        val stat = registry.getOrElse(key, new AliasStat(key))
        registry(key) = stat.register(rawName)
    }

    def normalize(): Unit = {
        var stats = registry.values
        stats = stats.map(_.determineDisplayName)
        // stats = leveshtein(stats)
        stats = stats.map{s =>
            s.setDisplayName(typoFixer(s.displayName))
        }
        lookup = stats.map{s =>
            (s.key, s)
        }.toMap
    }

    def get(rawName: String): String = {
        lookup(Transform.toKey(rawName)).displayName
    }
}
