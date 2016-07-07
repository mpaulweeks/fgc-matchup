
import java.io._

import scala.io.Source._
import scala.collection.mutable
import scala.util.parsing.json.JSON

import scalaj.http._

case class VideoItem(timestamp: String, id: String, title: String) {

    def toJSON():String = {
        return "[\"" + timestamp + "\",\"" + id + "\",\"" + title.replaceAll("\"", "'") + "\"]"
    }
}

case class ChannelInfo(fileName: String, playlistId: String)

class VideoLibrary(fileName: String) {
    private val DATA_FILE_PATH = s"data/$fileName.json"
    private val videoList: mutable.ListBuffer[VideoItem] = mutable.ListBuffer.empty[VideoItem];
    private val videoIds: mutable.Set[String] = mutable.Set();

    private def loadFile(): Unit = {
        if (!(new File(DATA_FILE_PATH).exists())){
            return
        }
        val jsonString = fromFile(DATA_FILE_PATH).getLines.mkString
        val jsonMap:List[Any] = JSON.parseFull(jsonString).get.asInstanceOf[List[Any]]
        jsonMap.foreach( item => {
            val videoTuple:List[String] = item.asInstanceOf[List[String]]
            val videoItem = new VideoItem(videoTuple(0), videoTuple(1), videoTuple(2))
            add(videoItem)
        })
    }
    loadFile()

    def add(video: VideoItem): Boolean = {
        // for debugging
        // if (videoIds.size > 9) {
        //     return false;
        // }

        if (!(videoIds contains video.id)){
            videoList += video;
            videoIds add video.id;
            return true;
        } else {
            return false;
        }
    }

    def toFile(): Unit = {
        val file = new File(DATA_FILE_PATH)
        val bw = new BufferedWriter(new FileWriter(file))
        var first = true
        val sortedVideos = videoList.sortWith(_.timestamp > _.timestamp)
        sortedVideos.foreach( videoItem => {
            var jsonLine = videoItem.toJSON()
            if (first){
                first = false
                jsonLine = "[\n" + jsonLine
            } else {
                jsonLine = ",\n" + jsonLine
            }
            bw.write(jsonLine)
        })
        bw.write("\n]")
        bw.close()
    }
}

case class VideoFetcher(apiKey: String, channelInfo: ChannelInfo) {
    private val BASE_URL = "https://www.googleapis.com/youtube/v3/playlistItems"
    private val library = new VideoLibrary(channelInfo.fileName)

    def fetchVideos(nextPageToken: String = ""): Unit = {
        println("fetching videos")

        var request: HttpRequest = (
            Http(BASE_URL)
            .param("part", "snippet")
            .param("maxResults", "50")
            .param("playlistId", channelInfo.playlistId)
            .param("key", apiKey)
        )
        if (nextPageToken.length > 0){
            request = request.param("pageToken", nextPageToken)
        }
        val response: HttpResponse[String] = request.asString
        println(response.code)
        processVideos(response.body)
    }

    private def processVideos(content: String): Unit = {
        val jsonString = content
        val jsonMap:Option[Any] = JSON.parseFull(jsonString)
        val resObj:Map[String,Any] = jsonMap.get.asInstanceOf[Map[String, Any]]
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
            return
        }
        library.toFile()
    }
}

object Demo {

    val ChannelYogaFlame = new ChannelInfo("YogaFlame24", "UU1UzB_b7NSxoRjhZZDicuqw")
    val ChannelOlympicGaming = new ChannelInfo("TubeOlympicGaming", "UUg5TGonF8hxVU_YVVaOC_ZQ")

    def run() {
        val apiKey = fromFile("keys/youtube").getLines().next()
        new VideoFetcher(apiKey, ChannelYogaFlame).fetchVideos();
        new VideoFetcher(apiKey, ChannelOlympicGaming).fetchVideos();
    }

    def main(args: Array[String]) {
        run()
    }
}
