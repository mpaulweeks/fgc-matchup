
import java.io._

import scala.io.Source
import scala.collection.breakOut
import scala.util.parsing.json.JSON

import scalaj.http._

case class VideoItem(timestamp: String, id: String, title: String) {
    val json:String = (
        s"['$timestamp','$id','${title.replaceAll("'", "~").replaceAll("\"", "~")}']"
        .replaceAll("'", "\"")
        .replaceAll("~", "'")
    )
}

case class YouTubeChannel(fileName: String, playlistId: String) {
    private val DATA_FILE_PATH = s"data/$fileName.json"

    def loadFile(): Map[String, VideoItem] = {
        if (!(new File(DATA_FILE_PATH).exists)){
            throw new Exception
        }
        val jsonString = Source.fromFile(DATA_FILE_PATH).getLines.mkString
        val jsonMap: List[Any] = JSON.parseFull(jsonString).get.asInstanceOf[List[Any]]
        jsonMap.map { item =>
            val videoTuple: List[String] = item.asInstanceOf[List[String]]
            val videoItem = new VideoItem(videoTuple(0), videoTuple(1), videoTuple(2))
            (videoItem.id, videoItem)
        }(breakOut)
    }

    def toFile(videoMap: Map[String, VideoItem]): Unit = {
        val file = new File(DATA_FILE_PATH)
        val bw = new BufferedWriter(new FileWriter(file))
        var first = true
        val sortedVideos = videoMap.values.toSeq.sortBy(r => (r.timestamp, r.id)).reverse
        sortedVideos.foreach( videoItem => {
            var jsonLine = videoItem.json
            if (first){
                first = false
                jsonLine = "[\n" + jsonLine
            } else {
                jsonLine = ",\n" + jsonLine
            }
            bw.write(jsonLine)
        })
        bw.write("\n]")
        bw.close
    }
}

case class VideoFetcher(apiKey: String) {
    private val BASE_URL = "https://www.googleapis.com/youtube/v3/playlistItems"

    def fetchVideos(channel: YouTubeChannel): Unit = {
        val existingVideos = channel.loadFile
        val updatedVideos = updateVideos(channel, existingVideos)
        channel.toFile(updatedVideos)
    }

    private def updateVideos(
        channel: YouTubeChannel,
        videoMap: Map[String, VideoItem],
        nextPageToken: String = ""
    ): Map[String, VideoItem] = {
        val newVideoData = pullVideoData(channel, nextPageToken)
        val (newPageToken, newVideos) = processVideoData(newVideoData)

        val newVideoMap = videoMap ++ newVideos
        val oldData = newVideoMap.size == videoMap.size

        if (newPageToken.length == 0 || oldData){
            newVideoMap
        } else {
            updateVideos(channel, newVideoMap, newPageToken)
        }
    }

    private def pullVideoData(
        channel: YouTubeChannel,
        nextPageToken: String
    ): String = {
        println(s"fetching videos for ${channel.fileName}")
        var request: HttpRequest = (
            Http(BASE_URL)
            .param("part", "snippet")
            .param("maxResults", "50")
            .param("playlistId", channel.playlistId)
            .param("key", apiKey)
        )
        if (nextPageToken.length > 0){
            request = request.param("pageToken", nextPageToken)
        }
        val response: HttpResponse[String] = request.asString
        println(response.code)
        response.body
    }

    private def processVideoData(jsonString: String): (String, Map[String, VideoItem]) = {
        val jsonMap: Option[Any] = JSON.parseFull(jsonString)
        val resObj: Map[String,Any] = jsonMap.get.asInstanceOf[Map[String, Any]]
        var nextPageToken = ""
        if (resObj.contains("nextPageToken")){
            nextPageToken = resObj.get("nextPageToken").get.asInstanceOf[String]
        }
        val videoItems: List[Any] = resObj.get("items").get.asInstanceOf[List[Any]]
        val newVideos: Map[String, VideoItem] = videoItems.map { item =>
            val itemMap: Map[String,Any] = item.asInstanceOf[Map[String,Any]]
            val snippet: Map[String,Any] = itemMap.get("snippet").get.asInstanceOf[Map[String,Any]]
            val timestamp: String = snippet.get("publishedAt").get.asInstanceOf[String]
            val title: String = snippet.get("title").get.asInstanceOf[String]
            val resource: Map[String,String] = snippet.get("resourceId").get.asInstanceOf[Map[String,String]]
            val videoId: String = resource.get("videoId").get
            val videoItem = new VideoItem(timestamp, videoId, title)
            (videoItem.id, videoItem)
        }(breakOut)
        (nextPageToken, newVideos)
    }
}

object Scraper {
    val ChannelYogaFlame = new YouTubeChannel("YogaFlame24", "UU1UzB_b7NSxoRjhZZDicuqw")
    val ChannelOlympicGaming = new YouTubeChannel("TubeOlympicGaming", "UUg5TGonF8hxVU_YVVaOC_ZQ")

    def run() {
        val apiKey = Source.fromFile("keys/youtube").getLines.next
        val fetcher = new VideoFetcher(apiKey)
        fetcher.fetchVideos(ChannelYogaFlame)
        fetcher.fetchVideos(ChannelOlympicGaming)
    }

    def main(args: Array[String]) {
        run
    }
}
