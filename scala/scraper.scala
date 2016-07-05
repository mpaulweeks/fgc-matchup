
import scala.io.Source._
import scala.collection.mutable

// import dispatch._, Defaults._
// import scala.util.{Success, Failure}

val BASE_URL = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=5&playlistId=UU1UzB_b7NSxoRjhZZDicuqw&key=";

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
    private val library = new VideoLibrary();

    def fetchVideos(nextPage: String = ""): Unit = {
        println("fetching videos");
        // on success, call process
        // val svc = url(BASE_URL + apiKey);
        // val response : Future[String] = Http(svc OK as.String)

        // response onComplete {
        //     case Success(content) => {
        //         println("Successful response" + content)
        //     }
        //     case Failure(t) => {
        //         println("An error has occurred: " + t.getMessage)
        //     }
        // }
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
        // todo
    }

    def run() {
        val apiKey = fromFile("keys/youtube").getLines().next()
        val fetcher = new VideoFetcher(apiKey);
        fetcher.fetchVideos();
    }
}

Demo.run()
