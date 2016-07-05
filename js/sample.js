
var SAMPLE_DATA = [
["vbQ2uahddRo","X3 Tokido ( Ryu ) Vs 200won ( R.Mika ) SF5 1080p - 60fps ★"],
["eRjFx1veqgw","X4 Haneyama ( Ibuki ) Vs Mohamedo ( Balrog ) SF5 1080p - 60fps ★"],
["XwraZs_xhEI","X5 Haneyama ( Ibuki ) Vs Hamenageru ( Zangief ) SF5 1080p - 60fps ★"],
["8IXFu-1WJ9U","X3 PR Balrog ( Balrog ) Vs VGP_Integra ( Ken ) SF5 1080p - 60fps ★"],
["uZocVYjcwiw","X2 Pr Balrog ( Balrog ) Vs GodKingLockdown ( Bison ) SF5 1080p - 60fps ★"],
["A8d3-TWoyXQ","X5 Sako ( Ibuki ) Vs Rintarou ( Ken ) SF5 1080p - 60fps ★"],
["aqGYvaYxNH0","X4 OmGiTzChun ( R.Mika ) Vs PR Balrog ( Balrog ) SF5 1080p - 60fps ★"],
["xxVSsCAZ9Gs","X2 Sako ( Ibuki ) Vs tommy_February4 ( Karin ) SF5 1080p - 60fps ★"],
["PcTp4TCWqGw","X4 SonicFox ( Ibuki ) Vs TS Sabin ( Dhalsim ) SF5 1080p - 60fps ★"],
["nty6wJR7Uw4","X3 Sabin ( Dhalsim ) Vs PR Balrog ( Balrog ) SF5 1080p - 60fps ★"],
["bDI48_wr750","X3 Sako ( Chun li ) Vs montana ( Ibuki ) SF5 1080p - 60fps ★"],
["oHUXZyR83R8","X3 PR Balrog ( Balrog ) Vs PIE Smug ( Karin ) SF5 1080p - 60fps ★"],
["wMMpBYHdllI","X3 PR Balrog ( Balrog ) Vs The_Cool_Kid91 ( Alex ) SF5 1080p - 60fps ★"],
["-tJ49vrs9us","X2 Momochi ( Ibuki ) Vs Rice-rt10 ( Karin ) SF5 1080p - 60fps ★"],
["7lNBM6De8vA","Chris G ( Ibuki ) Vs PR Balrog ( Balrog ) SF5 1080p - 60fps ★"],
["nnRl7dd4KdQ","Momochi ( Ibuki ) Vs JKD_sid ( Necalli ) SF5 1080p - 60fps ★"],
["mQsrxdeOj3U","StromKubo ( Balrog ) Vs Tokido ( Ryu ) SF5 1080p - 60fps ★"],
["ufxa-Bch62Y","Chris G ( Ibuki ) Vs Ryuyunjin ( Ryu ) 1080p - 60fps ★"],
["z6jy75-6zzI","X2 Chris G ( Ibuki ) Vs Xabien ( Nash ) SF5 1080p - 60fps ★"],
["JceUyhq5vcI","PR Balrog ( Balrog ) Vs Chavargh ( Chun li ) SF5 1080p - 60fps ★"],
["G50eVlstq_E","PR Balrog ( Balrog ) Vs Noahtheprodigy ( R.Mika ) SF5 1080p - 60fps ★"],
["ExZrc9pdhPI","X3 SonicFox ( Fang ) Vs Liquidnuckledu ( R.Mika ) SF5 1080p - 60fps ★"],
["Hmn5DUduFCs","X2 XsK_Samurai ( Ryu ) Vs -Vagabond ( Necalli ) SF5 1080p - 60fps ★"],
["33FyXkEnd34","Tokido ( Ryu ) Vs Saulabis ( Rashid ) SF5 1080p - 60fps ★"],
["UB91IinhS94","X2 Tokido ( Ryu ) Vs Kyo_Anton ( Nash ) SF5 1080p - 60fps ★"],
["_CeSh9qja-A","X2 Kyo_ Anton ( Nash ) Vs Crusher ( Birdie ) SF5 1080p - 60fps ★"],
["DNots3VVOY0","X2 FChampRyan ( Dhalsim ) Vs XsK_ Samurai ( Ryu ) SF5 1080p - 60fps ★"],
["LW43ETH9ImI","X2 Wolfkrone ( Laura ) Vs PIE Smug ( Karin ) SF5 1080p - 60fps ★"],
["Fd5qI5zy2ME","X2 Phenom ( Necali ) Vs Swagskheletor ( Fang ) SF5 1080p - 60fps ★"],
["dDxyjUJLU5A","X2 200won ( R.Mika ) Vs Sazabi ( Alex ) SF5 1080p - 60fps ★"],
["yqFk9Rh2rYs","X2 Galtu ( Bison ) Vs Daigo Umehara ( Ryu ) SF5 1080p - 60fps ★"],
["el9Bjil5C3I","X2 Lord Problem ( Nash ) Vs Infexious ( Zangief ) SF5 1080p - 60fps ★"],
["GH3g0trOUxw","infexious ( Zangief ) Vs Packz93 ( Karin ) SF5 1080p - 60fps ★"],
["f5SD2I9Hwgk","Ahjubii ( Nash ) Vs Doyanbo ( Guile ) SF5 1080p - 60fps ★"],
["jZAEqWtTqN8","Gachikun ( Rashid ) Vs YHCmochi ( Dhalsim ) SF5 1080p - 60fps ★"],
["U1oxtd8850I","Doyanbo ( Guile ) Vs 200won ( R.Mika ) SF5 1080p - 60fps ★"],
["opUOVWEbJ1c","Doyanbo ( Guile ) Vs Kuro_Kuro ( Birdie ) SF5 1080p - 60fps ★"],
["6_acqVr0osA","Kyo_Anton ( Nash ) Vs Hotaru ( Zangief ) SF5 1080p - 60fps ★"],
["zAjcr8uInLc","Galtu ( Bison ) Vs Pirorinn ( Ken ) SF5 1080p - 60fps ★"],
["8kYF25zCGfI","X2 SonicFox ( Fang ) Vs AdnanNYC ( Dhalsim ) SF5 1080p - 60fps ★"],
["wWLgq2GCo8w","X2 SonicFox ( Fang ) Vs CDJR ( Ken ) SF5 1080p - 60fps ★"],
["J7QFH6Fh0nE","X2 PIE Smug ( Karin ) Vs Deepneko ( Chun li ) SF5 1080p - 60fps ★"],
["claam28hR0Y","X2 ChrisTatarian ( Ken ) Vs GammenaRD ( Birdie ) SF5 1080p - 60fps ★"],
["rzvFIc-98r4","X3 Daigo Umehara ( Ryu ) Vs FatProteins ( Rashid ) SFV 1080p - 60fps ★"],
["UxX6uZe_z-Q","GutaBoom ( Bison ) Vs Daigo Umehara ( Ryu ) SF5 1080p - 60fps ★"],
["eGEum7AVek8","Gachikun ( Rashid ) Vs Angry_Ojisan ( Zangief ) SF5 1080p - 60fps ★"],
["CHuuK7dndjI","YHCmochi ( Dhalsim ) Vs FH-888 ( Vega ) SF5 1080p - 60fps ★"],
["pjP1-32e1ns","Sako ( Chun Li ) Vs Pagappa ( Fang ) SF5 1080p - 60fps ★"],
["5BQ-BU_aC94","Mago ( Karin ) Vs Jyobin ( Ryu ) SF5 1080p - 60fps ★"],
["cTJbmvJgz94","Oyazi_oryzae ( Alex ) Vs Tokido ( Ryu ) SF5 1080p - 60fps ★"]
]

function runSample(){

    // setup data
    var out = $('#videos');
    var manager = Manager();
    var titles = [];
    var video;
    SAMPLE_DATA.forEach(function (tuple){
        titles.push(tuple[1]);
        video = parseYogaFlame(tuple[0], tuple[1]);
        if (video){
            manager.manageVideo(video);
        }
    });

    // setup display
    manager.getCharacters().forEach(function (char){
        var html = '<option value="' + char + '">' + char + '</option>';
        $('#char1').append(html);
        $('#char2').append(html);
    });
    manager.getPlayers().forEach(function (player){
        var html = '<option value="' + player + '">' + player + '</option>';
        $('#player').append(html);
    });

    // setup triggers
    function printResults(){
        var game = 'SF5';
        var player = $('#player').val();
        var char1 = $('#char1').val();
        var char2 = $('#char2').val();
        var videos = manager.getVideos(game, player, char1, char2);

        var html = "";
        videos.forEach(function (video){
            html += video.toHTML();
        });
        out.html(html);
    }
    $('.filter').change(printResults);
    $('.reset').click(function (){
        var select_id = $(this).data('id');
        $('#' + select_id).val('').prop('selected', true);
        $('#' + select_id).trigger('change');
    });

    printResults();
}
