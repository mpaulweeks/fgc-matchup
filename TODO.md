# todo.txt

when in doubt: `git grep todo`

## (re)design
- find a way to algorithmically fix typos/collapse similar players/chars
- support games with multiple chars
- support videos with multiple chars
- embed/inline video view (with cookie-based toggle setting)
- improve regex
    - better debugging misses
    - more centralized/shared logic between parsers

## research
- add more support for Olympic games/style
- look into iShoryuken https://www.youtube.com/user/iShoryukenTV
- look into CapcomFighters/alternative channels

## quickies
- add real url encoding/decoding for params
- overhaul readme, describe how to contrib
- organize classes, figure out dependency graph
- refactor parsers and FIXER

## player converge
- delay indexing ValueManager until all videos loaded
- once all videos loaded (and all players indexed) fix all players
- create map of reduced -> originals
- prbalrog: {
    PR Balrog: 2,
    pr balrog: 1,
    prbalrog: 1
}
- determine true name off of high count of pre-formatted
