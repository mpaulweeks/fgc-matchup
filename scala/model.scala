
package fgc.model

case class VideoData(
    id: String,
    timestamp: String,
    game: String,
    players: List[String],
    characters: List[List[String]]
){
    val tuple: List[Any] = List(
        timestamp, id, game, players, characters
    )
}
