/* eslint-disable prefer-const */
/* eslint-disable no-continue */
/* eslint-disable no-param-reassign */
/* eslint-disable no-undef */
/* eslint-disable no-use-before-define */
const game = new Game();

const mapGenerator = new MapGame();
scenes.push(mapGenerator.scene01(), mapGenerator.scene02());
game.start(scenes[0]);
canvas.style.backgroundColor = 'purple';
