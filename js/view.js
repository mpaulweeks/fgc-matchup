


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
                "paging": false,
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

    function setUrlParams(game, player, char1, char2){
        var params = "?game=" + game;
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

    function readUrlParams(manager){
        TOOL.log('reading url params');
        var game = TOOL.readUrlParam("game");
        if (checkValue('game', game)){
            $('#game').val(game).prop('selected', true);
            var player = TOOL.readUrlParam("player");
            var chars = TOOL.readUrlParam("char", true);

            updateDropdowns(manager, game);

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
        printResults(manager);
    }

    function updateDropdowns(manager){
        manager.currentGame = $('#game').val();
        var base_select = '<option value="">-</option>';
        var html_char1 = base_select;
        var html_char2 = base_select;
        var html_player = base_select;
        manager.getCharacters().forEach(function (char){
            html_char1 += TOOL.option(char);
            html_char2 += TOOL.option(char);
        });
        manager.getPlayers().forEach(function (player){
            html_player += TOOL.option(player);
        });
        $('#char1').html(html_char1);
        $('#char2').html(html_char2);
        $('#player').html(html_player);
    }

    function printResults(manager){
        if (manager.currentGame != $('#game').val()){
            updateDropdowns(manager);
        }

        var player = $('#player').val();
        var char1 = $('#char1').val();
        var char2 = $('#char2').val();
        setUrlParams(manager.currentGame, player, char1, char2);

        var videos = manager.getVideos(player, char1, char2);
        var out = $('#videos').DataTable()
        out.clear();
        var videoData = [];
        videos.forEach(function (video){
            videoData.push(video.toData());
        });
        out.rows.add(videoData);
        out.draw();
        $('.link-player').click(function (){
            var playerValue = $(this).data("value");
            $('#player').val(playerValue).prop('selected', true);
            $('#char1').val('').prop('selected', true);
            $('#char2').val('').prop('selected', true);
            $('#player').trigger('change');
        });
        $('.link-character').click(function (){
            var characterValue = $(this).data("value");
            if ($('#char1').val()){
                $('#char2').val(characterValue).prop('selected', true);
                $('#char2').trigger('change');
            } else {
                $('#char1').val(characterValue).prop('selected', true);
                $('#char1').trigger('change');
            }
        });
    }

    function onLoad(parsedVideos){
        $('#loading').hide();
        createTable();
        var manager = Manager();
        parsedVideos.forEach(function (video){
            manager.manageVideo(video);
        });

        // setup display
        var html_game = "";
        manager.getGames().forEach(function (game){
            html_game += TOOL.option(game, CONSTANTS.GAMES[game]);
        });
        $('#game').html(html_game);
        $('#game').val('SF5').prop('selected', true);

        // setup triggers
        $('.filter').change(function (){
            printResults(manager);
        });
        $('.reset').click(function (){
            var select_id = $(this).data('id');
            $('#' + select_id).val('').prop('selected', true);
            $('#' + select_id).trigger('change');
        });

        readUrlParams(manager);
    }

    function setup(){
        if (TOOL.is_local){
            $(".container").append('<div class="col-md-12" id="log"><hr/></div>');
        }
        $('#enableJs').hide();
        var store = Store();
        store.load(onLoad);
    }

    setup();
}
