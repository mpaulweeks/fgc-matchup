
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

    private val BASE_URL = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=5&playlistId=UU1UzB_b7NSxoRjhZZDicuqw&key="
    private val library = new VideoLibrary()

    def fetchVideos(nextPageToken: String = ""): Unit = {
        println("fetching videos")

        var requestUrl = BASE_URL + apiKey
        if (nextPageToken.length > 0){
            requestUrl += "&pageToken=" + nextPageToken
        }
        println(requestUrl)

        val response: HttpResponse[String] = Http(requestUrl).asString
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
        val nextPageToken:String = resObj.get("nextPageToken").get.asInstanceOf[String]
        val videoItems:List[Any] = resObj.get("items").get.asInstanceOf[List[Any]]
        var continue = true
        videoItems.foreach( item => {
            val itemMap:Map[String,Any] = item.asInstanceOf[Map[String,Any]]
            val snippet:Map[String,Any] = itemMap.get("snippet").get.asInstanceOf[Map[String,Any]]
            val timestamp:String = snippet.get("publishedAt").get.asInstanceOf[String]
            val title:String = snippet.get("title").get.asInstanceOf[String]
            val resource:Map[String,String] = snippet.get("resourceId").get.asInstanceOf[Map[String,String]]
            val videoId:String = resource.get("videoId").get
            val newVideo = new VideoItem(timestamp, videoId, title)

            println(newVideo)
            continue &= library.add(newVideo)
        })
        if (continue){
            fetchVideos(nextPageToken)
        } else {
            println("duplicate found")
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
