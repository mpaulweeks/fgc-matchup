
package fgc.scraper

import scala.collection.breakOut
import scala.io.Source
import scala.util.parsing.json.JSON

import scalaj.http.Http
import scalaj.http.HttpRequest
import scalaj.http.HttpResponse

import fgc.model.VideoItem
import fgc.channel.YouTubeChannel

case class VideoFetcher(apiKey: String) {
    private val BASE_URL = "https://www.googleapis.com/youtube/v3/playlistItems"

    def fetchVideos(channel: YouTubeChannel): Boolean = {
        val existingVideos = channel.loadFile
        val updatedVideos = updateVideos(channel, existingVideos)
        val newVideos = updatedVideos.size > existingVideos.size
        if (true) { // todo
            channel.toFile(updatedVideos)
        }
        newVideos
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

case class ChannelFetcher(apiKey: String) {
    private val SEARCH_URL = "https://www.googleapis.com/youtube/v3/search"
    private val CHANNEL_URL = "https://www.googleapis.com/youtube/v3/channels"
    import org.json4s._
    import org.json4s.native.JsonMethods._
    implicit val formats = DefaultFormats // Brings in default date formats etc.

    def fetchChannelInfo(channelName: String): List[String] = {
        val channelId = getChannelId(channelName)
        val uploadsId = getUploadsId(channelId)
        List(channelName, channelId, uploadsId)
    }

    private def getChannelId(channelName: String): String = {
        println(s"fetching info for channelName: $channelName")
        var request: HttpRequest = (
            Http(SEARCH_URL)
            .param("part", "snippet")
            .param("type", "channel")
            .param("q", channelName)
            .param("key", apiKey)
        )
        val response: HttpResponse[String] = request.asString
        println(response.code)
        val json = parse(response.body)
        val item = (json \ "items")(0)
        (item \ "id" \ "channelId").extract[String]
    }

    private def getUploadsId(channelId: String): String = {
        println(s"fetching info for channelId: $channelId")
        var request: HttpRequest = (
            Http(CHANNEL_URL)
            .param("part", "contentDetails")
            .param("id", channelId)
            .param("key", apiKey)
        )
        val response: HttpResponse[String] = request.asString
        println(response.code)
        val json = parse(response.body)
        val item = (json \ "items")(0)
        (item \ "contentDetails" \ "relatedPlaylists" \ "uploads").extract[String]
    }
}

object ChannelInfo {
    def run(args: Array[String]): Boolean = {
        println("running channel info")
        val apiKey = Source.fromFile("keys/youtube").getLines.next
        val fetcher = new ChannelFetcher(apiKey)
        var results = args.map { channelName =>
            fetcher.fetchChannelInfo(channelName)
        }
        results.foreach { r =>
            println(r.mkString(", "))
        }
        results.length > 0
    }

    def main(args: Array[String]) {
        println(run(args))
    }
}

object Scraper {
    def run(): Boolean = {
        println("running scraper")
        val apiKey = Source.fromFile("keys/youtube").getLines.next
        val fetcher = new VideoFetcher(apiKey)
        var newVideos = false
        YouTubeChannel.Channels.foreach { channel =>
            newVideos |= fetcher.fetchVideos(channel)
        }
        newVideos
    }

    def main(args: Array[String]) {
        println(run)
    }
}
