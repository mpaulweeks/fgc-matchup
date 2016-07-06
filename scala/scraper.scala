
import scala.io.Source._
import scala.collection.mutable
import scala.util.parsing.json.JSON

import scalaj.http._

case class VideoItem(timestamp: String, id: String, title: String)

class VideoLibrary() {
    private val videoList: mutable.ListBuffer[VideoItem] = mutable.ListBuffer.empty[VideoItem];
    private val videoIds: mutable.Set[String] = mutable.Set();

    // init: load file

    def add(video: VideoItem): Boolean = {
        if (videoIds.size > 15) {
            return false;
        }
        if (!(videoIds contains video.id)){
            videoList += video;
            videoIds add video.id;
            return true;
        } else {
            return false;
        }
    }
}

case class VideoFetcher(apiKey: String) {
    private val BASE_URL = "https://www.googleapis.com/youtube/v3/playlistItems"
    private val library = new VideoLibrary()

    def fetchVideos(nextPageToken: String = ""): Unit = {
        println("fetching videos")

        var request: HttpRequest = (
            Http(BASE_URL)
            .param("part", "snippet")
            .param("maxResults", "5")
            .param("playlistId", "UU1UzB_b7NSxoRjhZZDicuqw")
            .param("key", apiKey)
        )
        if (nextPageToken.length > 0){
            request = request.param("pageToken", nextPageToken)
        }
        val response: HttpResponse[String] = request.asString
        // println(response.body)
        println(response.code)
        // println(response.headers)
        // println(response.cookies)

        processVideos(response.body)
    }

    private def processVideos(content: String): Unit = {
        // foreach -> makeVideo, then add to library
        // if any adds return false, terminate
        // else if nextPage, call fetch
        val jsonString = content
        val json:Option[Any] = JSON.parseFull(jsonString)
        val resObj:Map[String,Any] = json.get.asInstanceOf[Map[String, Any]]
        var nextPageToken = ""
        if (resObj.contains("nextPageToken")){
            nextPageToken = resObj.get("nextPageToken").get.asInstanceOf[String]
        }
        val videoItems:List[Any] = resObj.get("items").get.asInstanceOf[List[Any]]
        var allUnique = true
        videoItems.foreach( item => {
            val itemMap:Map[String,Any] = item.asInstanceOf[Map[String,Any]]
            val snippet:Map[String,Any] = itemMap.get("snippet").get.asInstanceOf[Map[String,Any]]
            val timestamp:String = snippet.get("publishedAt").get.asInstanceOf[String]
            val title:String = snippet.get("title").get.asInstanceOf[String]
            val resource:Map[String,String] = snippet.get("resourceId").get.asInstanceOf[Map[String,String]]
            val videoId:String = resource.get("videoId").get
            val newVideo = new VideoItem(timestamp, videoId, title)

            println(newVideo)
            allUnique &= library.add(newVideo)
        })
        if (!allUnique){
            println("dupe found, terminating")
        } else if (nextPageToken.length == 0){
            println("hit end of video list, termination")
        } else {
            fetchVideos(nextPageToken)
        }
    }
}

object Demo {
    def main(args: Array[String]) {
        run()
    }

    def run() {
        val apiKey = fromFile("keys/youtube").getLines().next()
        val fetcher = new VideoFetcher(apiKey);
        fetcher.fetchVideos();
    }
}
