
var CONSTANTS = {};
CONSTANTS.GAMES = {
    SF5: 'Street Fighter V',
    USF4: 'Ultra Street Fighter 4',
    SSF4AE2012: 'Super Street Fighter 4 AE 2012',
    SSF4AE: 'Super Street Fighter 4 Arcade Edition',
    SF3: "Street Fighter 3",
    SFxT: "Street Fighter x Tekken",
    TTT2: "Tekken Tag Tournament 2",
    SC5: "Soulcalibur V",
    DOA5: "Dead Or Alive 5 Last Round",
    GGXrd: "Guilty Gear Xrd",
    P4AU: "Persona 4 Arena Ultimax",
    MKX: "Mortal Kombat X",
    KI: "Killer Instinct",
    Smash4: "Super Smash Bros Wii U",
};
CONSTANTS.getGame = function(game){
    if (game in CONSTANTS.GAMES){
        return CONSTANTS.GAMES[game];
    }
    return "(unknown)";
}
