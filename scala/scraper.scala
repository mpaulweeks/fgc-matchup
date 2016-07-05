
import scala.collection.mutable

// todo
val url = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=5&playlistId=UU1UzB_b7NSxoRjhZZDicuqw&key=";

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

class VideoFetcher() {
    private val library = new VideoLibrary();

    def fetchVideos(nextPage: String = ""): Unit = {
        println("fetching videos");
        // on success, call process
    }

    private def makeVideo(): VideoItem = {
        // parse json
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
        val fetcher = new VideoFetcher();
        fetcher.fetchVideos();
    }
}

Demo.run()
