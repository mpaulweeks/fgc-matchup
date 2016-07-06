


function runView(){

    function createTable(){
        var tableHtml = `
<table class="table video">
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
    }

    function onLoad(parsedVideos){
        var out = $('#videos');
        var manager = Manager();
        parsedVideos.forEach(function (video){
            manager.manageVideo(video);
        });

        // setup display
        var html_game = "";
        manager.getGames().forEach(function (game){
            html_game += '<option value="' + game + '">' + game + '</option>';
        });
        $('#game').html(html_game);
        $('#game').val('SF5').prop('selected', true);
        var currentGame = null;

        // setup triggers
        function printResults(){
            var game = $('#game').val();

            if (currentGame != game){
                currentGame = game;
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

            var videos = manager.getVideos(game, player, char1, char2);
            var html = "";
            videos.forEach(function (video){
                html += video.toHTML();
            });
            out.html(html);
            $('.video.table').each(function (){
                $(this).DataTable({
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
        $('.filter').change(printResults);
        $('.reset').click(function (){
            var select_id = $(this).data('id');
            $('#' + select_id).val('').prop('selected', true);
            $('#' + select_id).trigger('change');
        });

        printResults();
    }

    function setup(){
        createTable();
        var store = Store();
        store.load(onLoad);
    }

    setup();
}
