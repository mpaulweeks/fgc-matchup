
function runView(){

    function createTable(){
        var tableHtml = `
<table class="table table-video" id="videos">
    <thead>
        <tr>
            <th> Date </th>
            <th> Player </th>
            <th> Character </th>
            <th> Player </th>
            <th> Character </th>
        </tr>
    </thead>
    <tbody id="videos">
    </tbody>
</table>`;
        $('#output').html(tableHtml);
        $('.table-video').each(function (){
            $(this).DataTable({
                "fixedHeader": true,
                "paging": true,
                "pagingType": "simple",
                "pageLength": 100,
                "lengthChange": false,
                "ordering": true,
                "info": false,
                "bFilter": false,
                "columnDefs": [
                    // { "orderable": false, "targets": 0 }
                ],
                "order": [[0, 'desc']],
            });
        });
    }

    function checkValue(elemId, value){
        if (!value){
            return false;
        }
        var selector = TOOL.format("#{1} option[value='{2}']", elemId, value);
        return $(selector).length > 0;
    }

    function setUrlParams(gameId, player, char1, char2){
        var params = "?game=" + gameId;
        if (player){
            params += "&player=" + player;
        }
        if (char1){
            params += "&char=" + char1;
        }
        if (char2){
            params += "&char=" + char2;
        }
        window.history.pushState({}, "", params);
    }

    function readUrlParams(){
        var game = TOOL.readUrlParam("game");
        if (checkValue('game', game)){
            $('#game').val(game).prop('selected', true);
            var player = TOOL.readUrlParam("player");
            var chars = TOOL.readUrlParam("char", true);

            updateDropdowns(game);

            if (checkValue('player', player)){
                $('#player').val(player).prop('selected', true);
            }
            if (chars){
                var charId = 1;
                chars.forEach(function (char){
                    if (checkValue('char1', char)){
                        $('#char' + charId).val(char).prop('selected', true);
                        charId += 1;
                    }
                });
            }
        }
        printResults();
    }

    function updateDropdowns(){
        VideoManager.currentGameId = $('#game').val();
        var base_select = '<option value="">-</option>';
        var html_char1 = base_select;
        var html_char2 = base_select;
        var html_player = base_select;
        VideoManager.getCharacters().forEach(function (char){
            html_char1 += TOOL.option(char);
            html_char2 += TOOL.option(char);
        });
        VideoManager.getPlayers().forEach(function (player){
            html_player += TOOL.option(player);
        });
        $('#char1').html(html_char1);
        $('#char2').html(html_char2);
        $('#player').html(html_player);
    }

    function printResults(){
        if (VideoManager.currentGameId != $('#game').val()){
            updateDropdowns();
        }

        var player = $('#player').val();
        var char1 = $('#char1').val();
        var char2 = $('#char2').val();
        setUrlParams(VideoManager.currentGameId, player, char1, char2);

        var videos = VideoManager.getVideos(player, char1, char2);
        var out = $('#videos').DataTable()
        out.clear();
        var videoData = [];
        videos.forEach(function (video){
            videoData.push(video.toData());
        });
        out.rows.add(videoData);
        out.draw();
    }

    function onLoad(parsedVideos){
        $('#loading').hide();
        createTable();
        VideoManager.organize(parsedVideos);

        // setup game dropdown
        var html_game = "";
        VideoManager.getGames().forEach(function (gameItem){
            html_game += TOOL.option(gameItem);
        });
        $('#game').html(html_game);
        $('#game').val('SF5').prop('selected', true);

        // setup triggers
        $('.filter').change(function (){
            printResults();
        });
        $('.reset').click(function (){
            var select_id = $(this).data('id');
            $('#' + select_id).val('').prop('selected', true);
            $('#' + select_id).trigger('change');
        });
        $(window).bind("popstate", readUrlParams);  //Back button
        $(window).bind("pushstate", readUrlParams); //Forward button, OR window.history.pushState()

        $('.table-video').on('click', '.link-player', function (){
            var playerValue = $(this).data("value");
            $('#player').val(playerValue).prop('selected', true);
            $('#char1').val('').prop('selected', true);
            $('#char2').val('').prop('selected', true);
            $('#player').trigger('change');
        });
        $('.table-video').on('click', '.link-character', function (){
            var characterValue = $(this).data("value");
            if ($('#char1').val()){
                $('#char2').val(characterValue).prop('selected', true);
                $('#char2').trigger('change');
            } else {
                $('#char1').val(characterValue).prop('selected', true);
                $('#char1').trigger('change');
            }
        });

        // start
        readUrlParams();
    }

    function setup(){
        if (TOOL.is_local){
            $(".container").append('<div class="col-md-12" id="log"><hr/></div>');
        }
        $('#enableJs').hide();
        Store.load(onLoad);
    }

    setup();
}
