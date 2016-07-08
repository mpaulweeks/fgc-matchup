


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
        var game = TOOL.readUrlParam("game");
        if (game && manager.hasGame(game)){
            $('#game').val(game).prop('selected', true);
            var player = TOOL.readUrlParam("player");
            var chars = TOOL.readUrlParam("char", true);

            printResults(manager, true);
            if (player && manager.hasPlayer(game, player)){
                $('#player').val(player).prop('selected', true);
            }
            if (chars){
                var charId = 1;
                chars.forEach(function (char){
                    if (char && manager.hasCharacter(game, char)){
                        $('#char' + charId).val(char).prop('selected', true);
                        charId += 1;
                    }
                });
            }
        }
        printResults(manager);
    }

    function printResults(manager, dontSetUrlParams){
        var game = $('#game').val();

        if (manager.currentGame != game){
            manager.currentGame = game;
            var base_select = '<option value="">-</option>';
            var html_char1 = base_select;
            var html_char2 = base_select;
            var html_player = base_select;
            manager.getCharacters(game).forEach(function (char){
                html_char1 += TOOL.option(char);
                html_char2 += TOOL.option(char);
            });
            manager.getPlayers(game).forEach(function (player){
                html_player += TOOL.option(player);
            });
            $('#char1').html(html_char1);
            $('#char2').html(html_char2);
            $('#player').html(html_player);
        }

        var player = $('#player').val();
        var char1 = $('#char1').val();
        var char2 = $('#char2').val();
        if (!dontSetUrlParams){
            setUrlParams(game, player, char1, char2);
        }

        var videos = manager.getVideos(game, player, char1, char2);
        var out = $('#videos').DataTable()
        out.clear();
        videos.forEach(function (video){
            out.row.add(video.toData());
        });
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
            html_game += '<option value="' + game + '">' + CONSTANTS.GAMES[game] + '</option>';
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
            $(".container").append('<div id="log"></div>');
        }
        $('#enableJs').hide();
        var store = Store();
        store.load(onLoad);
    }

    setup();
}
