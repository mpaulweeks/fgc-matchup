
import scala.io.Source._
import scala.collection.mutable

import scalaj.http._

case class VideoItem(timestamp: String, id: String, title: String)

class VideoLibrary() {
    private val videoList: mutable.ListBuffer[VideoItem] = mutable.ListBuffer.empty[VideoItem];
    private val videoIds: mutable.Set[String] = mutable.Set();

    // init: load file

    def add(video: VideoItem): Boolean = {
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

    private val BASE_URL = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=5&playlistId=UU1UzB_b7NSxoRjhZZDicuqw&key=";
    private val library = new VideoLibrary();

    def fetchVideos(nextPage: String = ""): Unit = {
        println("fetching videos");

        val requestUrl = BASE_URL + apiKey
        println(BASE_URL + apiKey)

        val response: HttpResponse[String] = Http(requestUrl).asString
        println(response.body)
        println(response.code)
        println(response.headers)
        println(response.cookies)
    }

    private def makeVideo(): VideoItem = {
        // parse json
        return new VideoItem("","","");
    }

    private def processVideos(content: String): Unit = {
        // foreach -> makeVideo, then add to library
        // if any adds return false, terminate
        // else if nextPage, call fetch
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
