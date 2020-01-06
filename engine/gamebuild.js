/* eslint-disable prefer-const */
/* eslint-disable no-continue */
/* eslint-disable no-param-reassign */
/* eslint-disable no-undef */
/* eslint-disable no-use-before-define */
const game = new Game();
const scene2 = new Scene(window.innerWidth, window.innerHeight);
const scene = new Scene(window.innerWidth, window.innerHeight);
canvas.style.backgroundColor = 'purple';
const missile = new MissileThrower(new Vec2(30, 30));

const player = new Player(500, true);
const watcher = new Watcher(
  100,
  150,
  0.2,
  [new Vec2(100, 100), new Vec2(50, 50), new Vec2(200, 50)],
  new Vec2(50, 50),
  true,
);
const watcher2 = new Watcher(100, 150, 4, []);
const wall = new Wall(300, 100, new Vec2(10, 500));
const hp = new HP();

player.position.x += 100;

scene2.add(player);
scene2.add(watcher);
scene2.add(watcher2);
scene2.add(wall);
scene2.add(hp);
scene2.add(missile);
scene.add(player);
scene.add(watcher);
scene.add(watcher2);
scene.add(wall);
scene.add(hp);
scene.add(missile);

setTimeout(() => game.start(scene2), 2000);
game.start(scene);
console.log(game);
