
function TypoFixer(){

    var self = {};

    var CHAR_NAME_MAP = {
        'Abel': [
            'abel',
        ],
        'Balrog': [
            'Barlog',
        ],
        'Bison': [
            'Bision',
            'M. Bison',
            'M.Bison',
            'M .Bison',
        ],
        'Blanka': [
            'blanka',
        ],
        'C. Viper': [
            'C.Viper',
            'Viper',
            'Wolfkrone',
        ],
        'Chun Li': [
            'Chun li',
            'ChunLi',
            'Chunli',
        ],
        'Cody': [
            'cody',
            'Sasaki',
        ],
        'Decapre': [
            'Decaore',
            'Decapri',
        ],
        'Dee Jay': [
            'DeeJay',
            'Deejay',
            'Deeay',
        ],
        'Dhalsim': [
            'Dhalsm',
            'Dhasim',
            'Dhlaism',
        ],
        'E. Honda': [
            'E.Honda',
            'Honda',
        ],
        'El Fuerte': [
            'EL Fuerte',
            'EL fuerte',
            'El fuerte',
            'ElFuerte',
            'GiPie',
        ],
        'Evil Ryu': [
            'Evil Ry',
        ],
        'Fang': [
            'F.A.N.G.',
            'F.A.N.G',
            'FANG',
        ],
        'Fei Long': [
            'FeiLong',
            'FeLong',
            'Feilong',
        ],
        'Ibuki': [
            'ibuki',
        ],
        'Juri': [
            'juri',
        ],
        'Ken': [
            'ken',
        ],
        'Laura': [
            'laura',
        ],
        'Makoto': [
            'makoto',
        ],
        'Nash': [
            'Charlie',
        ],
        'Necalli': [
            'Necali',
        ],
        'R. Mika': [
            'R.Mika',
        ],
        'T. Hawk': [
            'T.Hawk',
            'Hawk',
        ],
        'Rose': [
            'rose',
        ],
        'Ryu': [
            'rYU',
        ],
        'Yun': [
            'YUN',
        ],
        'Zangief': [
            'Zangeif',
            'Zanguef',
            'Zangef',
        ],
    };
    var CHAR_TYPO_MAP = {};
    for (var name in CHAR_NAME_MAP) {
        if (CHAR_NAME_MAP.hasOwnProperty(name)) {
            CHAR_NAME_MAP[name].forEach(function (typo){
                CHAR_TYPO_MAP[typo] = name;
            });
        }
    }

    self.fixCharacterName = function(char){
        char = char.trim().replace(/\s+/g, ' ');
        if (CHAR_TYPO_MAP.hasOwnProperty(char)) {
            return CHAR_TYPO_MAP[char];
        }
        return char;
    }

    self.fixPlayerName = function(player){
        player = player.trim().replace(/\s+/g, ' ');
        return player;
    }

    return self;
}