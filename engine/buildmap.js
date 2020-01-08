/* eslint-disable no-plusplus */
/* eslint-disable prefer-const */
/* eslint-disable no-continue */
/* eslint-disable no-param-reassign */
/* eslint-disable no-undef */
/* eslint-disable no-use-before-define */

// / MAPS
const windowHeight = 1080;
const windowWidth = 1920;
class MapGame {
  scene01() {
    this.scene = new Scene(windowWidth, windowHeight);
    const colorW = new RGB(103, 0, 135).stringColor();
    const posPlayer = new Vec2(100, 100);
    // WATCHERS
    const watchers = [
      new Watcher(
        100,
        150,
        3,
        [new Vec2(1205, 72), new Vec2(1333, 469), new Vec2(1139, 826)],
        new Vec2(1139, 826),
        true,
      ),
      new Watcher(100, 150, 3, [], new Vec2(919, 249), false),
      new Watcher(100, 150, 3, [], new Vec2(551, 158), true),
      new Watcher(
        100,
        150,
        3,
        [new Vec2(771, 739), new Vec2(925, 588), new Vec2(771, 739)],
        new Vec2(771, 739),
        true,
      ),
      new Watcher(100, 150, 3, [], new Vec2(1196, 429), true),
      new Watcher(
        100,
        150,
        3,
        [new Vec2(1164, 812), new Vec2(1166, 603), new Vec2(1005, 702)],
        new Vec2(1005, 702),
        true,
      ),
      new Watcher(100, 150, 3, [], new Vec2(1144, 200), false),
      new Watcher(
        100,
        150,
        3,
        [
          new Vec2(493, 575),
          new Vec2(506, 835),
          new Vec2(113, 719),
          new Vec2(362, 668),
        ],
        new Vec2(362, 668),
        true,
      ),
      new Watcher(
        100,
        150,
        3,
        [
          new Vec2(82, 563),
          new Vec2(101, 377),
          new Vec2(347, 366),
          new Vec2(347, 569),
        ],
        new Vec2(347, 569),
        true,
      ),
      new Watcher(
        100,
        150,
        3,
        [
          new Vec2(84, 366),
          new Vec2(84, 366),
          new Vec2(342, 367),
          new Vec2(347, 571),
          new Vec2(97, 578),
        ],
        new Vec2(97, 578),
        true,
      ),
      new Watcher(
        100,
        150,
        3,
        [
          new Vec2(350, 371),
          new Vec2(350, 371),
          new Vec2(347, 571),
          new Vec2(105, 567),
          new Vec2(102, 360),
        ],
        new Vec2(102, 360),
        true,
      ),
    ];
    // SPECIAL WATCHERS

    // WALLS
    const walls = [
      new Wall(702, 31, new Vec2(440, 497), 'rgb(103, 0, 135, 1)'),
      new Wall(this.scene.width, 50, new Vec2(0, 0), colorW),
      new Wall(
        this.scene.width,
        50,
        new Vec2(0, this.scene.height - 50),
        colorW,
      ),
      new Wall(50, this.scene.height, new Vec2(0, 0), colorW),

      new Wall(
        50,
        this.scene.height,
        new Vec2(this.scene.width - 50, 0),
        colorW,
      ),
      new Wall(400, 30, posPlayer.add(new Vec2(-posPlayer.x, 100)), colorW),
      new Wall(400, 30, posPlayer.add(new Vec2(300, 200)), colorW),
      new Wall(40, 400, posPlayer.add(new Vec2(300, 100)), colorW),
      new Wall(300, 30, posPlayer.add(new Vec2(-posPlayer.x, 200)), colorW),
      new Wall(300, 30, posPlayer.add(new Vec2(-posPlayer.x, 500)), colorW),
      new Wall(43, 104, new Vec2(397, 99), 'rgb(103, 0, 135, 1)'),
      new Wall(142, 285, new Vec2(804, 759), 'rgb(103, 0, 135, 1)'),
      new MissileThrower(new Vec2(508, 416)),
      new MissileThrower(new Vec2(630, 416)),
      new Wall(536, 76, new Vec2(154, 867), 'rgb(103, 0, 135, 1)'),
      new Wall(102, 149, new Vec2(573, 530), 'rgb(103, 0, 135, 1)'),
      new MissileThrower(new Vec2(1507, 390)),
      new MissileThrower(new Vec2(1584, 641)),
      new MissileThrower(new Vec2(1434, 855)),
      new Watcher(
        100,
        150,
        3,
        [new Vec2(1441, 262), new Vec2(1413, 727), new Vec2(1232, 976)],
        new Vec2(1232, 976),
        true,
      ),
    ];

    walls.forEach(element => this.scene.add(element));
    watchers.forEach(element => this.scene.add(element));
    // PLAYER
    const player = new Player(200, true, posPlayer);
    this.scene.add(player);
    this.scene.add(new HP());
    this.scene.add(new FinishLine(new Vec2(107, 262)));
    // MISSILETHROWERS

    return this.scene;
  }

  scene02() {
    const colorW = new RGB(103, 0, 135).stringColor();
    this.scene = new Scene(windowWidth, windowHeight);
    const objects = [
      new Wall(291, 101, new Vec2(1272, 291), 'rgb(103, 0, 135, 1)'),
      new Watcher(
        100,
        150,
        3,
        [new Vec2(1591, 455), new Vec2(1548, 644)],
        new Vec2(1548, 644),
        true,
      ),
      new Wall(126, 190, new Vec2(1270, 212), 'rgb(103, 0, 135, 1)'),
      new Watcher(
        100,
        150,
        3,
        [
          new Vec2(1618, 526),
          new Vec2(1584, 523),
          new Vec2(1611, 918),
          new Vec2(1658, 444),
        ],
        new Vec2(1658, 444),
        true,
      ),
      new FinishLine(new Vec2(1355, 197)),
      new Watcher(100, 150, 3, [], new Vec2(211, 131), false),
      new Wall(302, 51, new Vec2(610, 398), 'rgb(103, 0, 135, 1)'),
      new Wall(62, 256, new Vec2(555, 398), 'rgb(103, 0, 135, 1)'),
      new Player(200, true, new Vec2(746, 487)),
      new Wall(this.scene.width, 50, new Vec2(0, 0), colorW),
      new Wall(
        this.scene.width,
        50,
        new Vec2(0, this.scene.height - 50),
        colorW,
      ),
      new Watcher(
        100,
        150,
        3,
        [new Vec2(808, 771), new Vec2(831, 994), new Vec2(480, 851)],
        new Vec2(480, 851),
        true,
      ),
      new Wall(50, this.scene.height, new Vec2(0, 0), colorW),
      new MissileThrower(new Vec2(185, 881)),
      new Watcher(
        100,
        150,
        3,
        [
          new Vec2(423, 832),
          new Vec2(577, 952),
          new Vec2(707, 822),
          new Vec2(842, 992),
        ],
        new Vec2(842, 992),
        true,
      ),
      new Wall(
        50,
        this.scene.height,
        new Vec2(this.scene.width - 50, 0),
        colorW,
      ),
      new Wall(116, 562, new Vec2(911, 398), 'rgb(103, 0, 135, 1)'),
      new Wall(371, 89, new Vec2(1027, 871), 'rgb(103, 0, 135, 1)'),
      new Wall(222, 475, new Vec2(1175, 399), 'rgb(103, 0, 135, 1)'),
      new Watcher(
        100,
        150,
        3,
        [
          new Vec2(1056, 414),
          new Vec2(1052, 848),
          new Vec2(1152, 846),
          new Vec2(1143, 426),
        ],
        new Vec2(1143, 426),
        true,
      ),
      new Watcher(
        100,
        150,
        3,
        [
          new Vec2(1150, 429),
          new Vec2(1050, 424),
          new Vec2(1056, 838),
          new Vec2(1149, 847),
        ],
        new Vec2(1149, 847),
        true,
      ),
      new MissileThrower(new Vec2(1064, 832)),
      new MissileThrower(new Vec2(1132, 782)),
      new Watcher(100, 150, 3, [], new Vec2(872, 261), false),
      new Watcher(100, 150, 3, [], new Vec2(704, 267), false),
      new Wall(350, 85, new Vec2(617 - 350, 654), 'rgb(103, 0, 135, 1)'),
      new MissileThrower(new Vec2(881, 105)),
      new MissileThrower(new Vec2(1400, 430)),
      new MissileThrower(new Vec2(1400, 500)),
      new MissileThrower(new Vec2(1400, 570)),
      new Watcher(
        100,
        150,
        3,
        [new Vec2(1424, 479), new Vec2(1428, 937)],
        new Vec2(1428, 937),
        true,
      ),
      new Watcher(
        100,
        150,
        3,
        [
          new Vec2(500, 617),
          new Vec2(345, 306),
          new Vec2(354, 228),
          new Vec2(416, 166),
          new Vec2(480, 195),
          new Vec2(503, 294),
          new Vec2(422, 400),
        ],
        new Vec2(422, 400),
        true,
      ),
      new Watcher(
        100,
        150,
        3,
        [
          new Vec2(165, 514),
          new Vec2(146, 490),
          new Vec2(146, 449),
          new Vec2(184, 428),
          new Vec2(227, 433),
          new Vec2(240, 458),
          new Vec2(240, 489),
          new Vec2(212, 506),
          new Vec2(239, 455),
          new Vec2(238, 434),
          new Vec2(236, 414),
          new Vec2(234, 389),
          new Vec2(235, 352),
          new Vec2(235, 324),
          new Vec2(237, 296),
          new Vec2(234, 258),
          new Vec2(248, 228),
          new Vec2(281, 218),
          new Vec2(310, 228),
          new Vec2(324, 264),
          new Vec2(324, 294),
          new Vec2(328, 320),
          new Vec2(329, 357),
          new Vec2(328, 379),
          new Vec2(330, 393),
          new Vec2(331, 414),
          new Vec2(335, 436),
          new Vec2(353, 451),
          new Vec2(379, 442),
          new Vec2(392, 427),
          new Vec2(396, 395),
          new Vec2(361, 369),
          new Vec2(333, 373),
          new Vec2(300, 389),
          new Vec2(302, 403),
        ],
        new Vec2(302, 403),
        true,
      ),
      new Watcher(
        100,
        150,
        3,
        [
          new Vec2(1055, 850),
          new Vec2(1152, 853),
          new Vec2(1150, 426),
          new Vec2(1049, 426),
        ],
        new Vec2(1049, 426),
        true,
      ),
      new HP(),
    ];
    objects.forEach(element => this.scene.add(element));
    return this.scene;
  }
}

let currPoint = { x: 0, y: 0 };
const listOfClicked = [];
let clickBef = null;

window.onclick = e => {
  clickBef = { x: currPoint.x, y: currPoint.y };
  currPoint = new Vec2(e.clientX, e.clientY);
  listOfClicked.push(currPoint);
  console.log(`new Vec2(${currPoint.x}, ${currPoint.y})`);
};

window.onmousewheel = e => {
  const w = currPoint.x - clickBef.x;
  const h = currPoint.y - clickBef.y;
  const posW = `new Vec2(${clickBef.x}, ${clickBef.y})`;
  const posForOthers = `new Vec2(${currPoint.x}, ${currPoint.y})`;
  const colorWall = new RGB(103, 0, 135).stringColor();
  console.log(`new Wall(${w}, ${h}, ${posW}, '${colorWall}')`);
  console.log(`new Watcher(
       100,
       150,
       3,
       [${
         listOfClicked.length > 1
           ? listOfClicked.map(a => `new Vec2(${a.x}, ${a.y})`)
           : []
       }],
       ${posForOthers},
       ${listOfClicked.length > 1},
     )`);
  console.log(`new Player(200, true, ${posForOthers})`);
  console.log(`new MissileThrower(${posForOthers})`);
};
