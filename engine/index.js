/* eslint-disable prefer-const */
/* eslint-disable no-continue */
/* eslint-disable no-param-reassign */
/* eslint-disable no-undef */
/* eslint-disable no-use-before-define */
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

function circularColorStandard() {
  ctx.fillStyle = this.colorMis.stringColor();
  this.path.moveTo(
    this.position.x + this.width / 2,
    this.position.y + this.height / 2,
  );
  this.path.arc(
    this.position.x + this.width / 2,
    this.position.y + this.height / 2,
    this.height / 2,
    0,
    Math.PI * 2,
    true,
  );
  ctx.stroke(this.path);
  ctx.fill(this.path);
  this.path.closePath();
}

class RGB {
  constructor(r, g, b, a = 1) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  stringColor() {
    return `rgb(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
  }
}

function Clamp(value, x, y) {
  if (value <= x) return x;
  if (value >= y) return y;
  return value;
}

function waitForImages(a) {
  return new Promise(res => {
    const interval = setInterval(() => {
      let charged = true;
      a.forEach(a => {
        if (!a.complete) {
          charged = false;
        }
      });

      if (charged) {
        res(true);
      }
      clearInterval(interval);
    }, 1);
  });
}

function COPY(a) {
  if (typeof a === 'object') {
    if (Array.isArray(a)) {
      const cpy = [];
      a.forEach(b => {
        cpy.push(COPY(b));
      });
      return cpy;
    }
    return copyObject(a);
  }
  return a;
}

function copyObject(a) {
  const copy = {};
  Object.keys(a).forEach(element => {
    copy[element] = COPY(a[element]);
  });
  return copy;
}

function copy(array) {
  const newArray = [];
  array.forEach(a => {
    newArray.push(copyObject(a));
  });
  return newArray;
}

class Vec2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   * @param {Vec2} one
   * @param {Vec2} two
   * @returns {Vec2}
   */
  static substract(one, two) {
    const V = new Vec2(one.x - two.x, one.y - two.y);
    return V;
  }

  multiply(number) {
    return new Vec2(this.x * number, this.y * number);
  }

  normalized() {
    const m = this.magnitude();
    if (m >= 0) return new Vec2(this.x / m, this.y / m);
    return this;
  }

  /**
   * @returns {number}
   */
  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * @param {Vec2} one
   * @param {Vec2} two
   * @returns {Vec2}
   */
  static add(one, two) {
    const V = new Vec2(one.x + two.x, one.y + two.y);
    return V;
  }

  add(other) {
    const V = new Vec2(this.x + other.x, this.y + other.y);
    return V;
  }
}

class GameObject {
  constructor(
    position,
    width,
    height,
    sprites = [],
    configuration = { color: 'red', collider: true },
  ) {
    this.position = new Vec2(position.x, position.y);
    this.__positionBefore = new Vec2(position.x, position.y);
    this.changed = true;
    this.width = width;
    this.height = height;
    this.destroyed = false;
    this.sprites = sprites.map(s => {
      const img = new Image(width, height);
      img.src = s;
      return img;
    });
    this.currentSpriteIndex = 0;
    this.collider = configuration.collider;
    this.color = configuration.color;
    this.instanceID = '';
  }

  ownRendering() {}

  _render() {
    this.ownRendering();
    // ctx.
    if (this.sprites.length)
      ctx.drawImage(
        this.sprites[this.currentSpriteIndex],
        this.position.x,
        this.position.y,
      );
  }

  pos(x, y) {
    this.changed = true;
    this.__positionBefore.x = this.position.x;
    this.__positionBefore.y = this.position.y;
    this.position.x = x;
    this.position.y = y;
  }

  start() {}

  update() {}
}

class Scene {
  constructor(w, h) {
    this.gameObjects = [];
    this.width = w;
    this.height = h;
  }

  add(gameObject) {
    this.gameObjects.push(gameObject);
  }
}

let _____actualGame = null;

class Game {
  constructor() {
    this.gameObjects = [];
    this.then = 0;
    this.stop = false;
    this.animationFr = 0;
    this.animation = 0;
  }

  static game() {
    return _____actualGame;
  }

  static checkColPath(path) {
    const l = _____actualGame.gameObjects.length;

    for (let i = 0; i < l; i += 1) {
      const otherObject = _____actualGame.gameObjects[i];
      if (
        ctx.isPointInPath(path, otherObject.position.x, otherObject.position.y)
      ) {
        return true;
      }
    }
    return false;
  }

  static checkCol(gameObject) {
    const bottom = gameObject.position.y + gameObject.height;
    const right = gameObject.position.x + gameObject.width;
    const l = _____actualGame.gameObjects.length;

    for (let i = 0; i < l; i += 1) {
      const otherObject = _____actualGame.gameObjects[i];

      if (!otherObject.collider) continue;
      if (otherObject.instanceID === gameObject.instanceID) continue;
      const colCondition =
        gameObject.position.x < otherObject.position.x + otherObject.width &&
        gameObject.instanceID !== otherObject.instanceID &&
        gameObject.position.x + gameObject.width > otherObject.position.x &&
        gameObject.position.y < otherObject.position.y + otherObject.height &&
        gameObject.height + gameObject.position.y > otherObject.position.y;
      if (!colCondition) continue;
      const tileBottom = otherObject.position.y + otherObject.height;
      const tileRight = otherObject.position.x + otherObject.width;
      const bCollision = Math.floor(tileBottom - gameObject.position.y);
      const tCollision = Math.floor(bottom - otherObject.position.y);
      const lCollision = Math.floor(right - otherObject.position.x);
      const rCollision = Math.floor(tileRight - gameObject.position.x);

      const conditions = {
        left:
          lCollision < rCollision &&
          lCollision < tCollision &&
          lCollision < bCollision,
        top:
          tCollision < rCollision &&
          tCollision < lCollision &&
          tCollision < bCollision,
        right:
          rCollision < tCollision &&
          rCollision < lCollision &&
          rCollision < bCollision,
        bot:
          bCollision < tCollision &&
          bCollision < lCollision &&
          bCollision < rCollision,
        info: {
          bCollision,
          tCollision,
          lCollision,
          rCollision,
        },
        gameObject: otherObject,
      };

      return {
        collided: true,
        colliderInformation: {
          conditions,
          collided: true,
        },
      };
    }
    return {
      collided: false,
      colliderInformation: {},
    };
  }

  async start(scene, sprites = []) {
    if (this.reqAnimationFrame) {
      this.gameObjects = [];
      clearInterval(this.reqAnimationFrame);
      window.cancelAnimationFrame(this.animation);
      this.then = 0;
    }
    console.log(scene.gameObjects);
    this.gameObjects = copy(scene.gameObjects);
    this.gameObjects.forEach((g, index) => {
      g.instanceID = guidGenerator();
      g.sprites = scene.gameObjects[index].sprites;
      g.update = scene.gameObjects[index].update;
      g.start = scene.gameObjects[index].start;
      g._render = scene.gameObjects[index]._render;
      g.pos = scene.gameObjects[index].pos;
      g.ownRendering = scene.gameObjects[index].ownRendering;
      g.__proto__ = scene.gameObjects[index].__proto__;
    });
    canvas.width = scene.width;
    canvas.height = scene.height;
    _____actualGame = this;
    await waitForImages(
      this.gameObjects.reduce((prev, now) => [...prev, ...now.sprites], [
        ...sprites,
      ]),
    );
    this.gameObjects.forEach(g => g.start());

    this.update();
  }

  /**
   *
   * @param {String} type
   * @returns {GameObject[]}
   */
  static getObject(type) {
    const objectives = [];
    for (let i = 0; i < Game.game().gameObjects.length; i += 1) {
      const g = Game.game().gameObjects[i];
      if (g.constructor.name === type) {
        objectives.push(g);
      }
    }
    return objectives;
  }

  instantiate(GameObject, ...params) {
    const gameObject = new GameObject(...params);
    gameObject.instanceID = guidGenerator();
    gameObject.start();
    this.gameObjects.push(gameObject);
    return gameObject;
  }

  static instantiate(gameObject, ...params) {
    return _____actualGame.instantiate(gameObject, ...params);
  }

  destroy(gameObject) {
    this.gameObjects = this.gameObjects.filter(gameObjec => {
      gameObject.destroyed = true;
      return gameObjec.instanceID !== gameObject.instanceID;
    });
  }

  static destroy(gameObject) {
    _____actualGame.destroy(gameObject);
  }

  update() {
    console.log(this.gameObjects);
    const upd = () => {
      const now = Date.now();
      const delta = now - this.then;
      if (delta > 1000) {
        this.then = now;
        return;
      }
      this.gameObjects.forEach(gameObject => {
        gameObject.update(delta / 1000);
      });

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      this.gameObjects.forEach(gameObject => {
        gameObject._render();
      });

      this.then = now;

      // Request to do this again ASAP
      // this.reqAnimationFrame = requestAnimationFrame(upd);
    };
    this.reqAnimationFrame = setInterval(() => {
      this.animation = requestAnimationFrame(upd);
    }, 15);
  }
}

class Player extends GameObject {
  constructor(speed, inp, pos = new Vec2(30, 30)) {
    super(pos, 20, 20);
    this.speed = speed;
    this.input = inp;
    this.signX = 0;
    this.signY = 0;
    this.deg = 0;
    this.path = new Path2D();
    this.hp = 100;
    this.colliding = { top: false, left: false, right: false, down: false };
    this.state = { hiding: false };
  }

  ownRendering() {
    ctx.fillStyle = !this.state.hiding
      ? 'rgb(255, 255, 255, 1)'
      : 'rgb(200, 200, 200, 0.8)';
    this.path = new Path2D();
    this.path.moveTo(this.position.x, this.position.y);
    this.path.arc(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2,
      this.height / 2,
      0,
      Math.PI * 2,
      true,
    );
    ctx.fill(this.path);
  }

  start() {}

  update(dt) {
    this.colliding = { top: false, left: false, right: false, down: false };
    if (!this.input) return;
    let [w, a, d, s, q] = Input.getInputs('w', 'a', 'd', 's', 'q');
    this.state.hiding = !!q;
    if (this.state.hiding) return;
    this.signX = a - d ? a - d : this.signX;
    this.signY = -w + s ? -w + s : this.signY;
    if (a - d) {
      this.signY = 0;
      this.signX = a - d;
    } else if (-w + s) {
      this.signX = 0;
      this.signY = -w + s;
    }
    const collision = Game.checkCol(this, this.path);

    if (collision.collided) {
      if (collision.colliderInformation.conditions.top) {
        if (s > 0) s = 0;
        this.colliding.down = true;
      } else if (collision.colliderInformation.conditions.bot) {
        if (w > 0) w = 0;
        this.colliding.top = true;
      }
      if (collision.colliderInformation.conditions.left) {
        if (d > 0) d = 0;
        this.colliding.right = true;
      } else if (collision.colliderInformation.conditions.right) {
        if (a > 0) a = 0;
        this.colliding.left = true;
      }
    }
    this.pos(
      this.position.x + (-a + d) * dt * this.speed,
      this.position.y + (-w + s) * this.speed * dt,
    );
  }
}

class Watcher extends GameObject {
  constructor(
    coneWidth,
    coneRadius,
    speedRotating,
    pathOfGoing,
    pos = new Vec2(150, 150),
    follower = false,
    color = null,
  ) {
    super(pos, 30, 30, [], { collider: true });

    this.coneRadius = coneRadius;
    this.speedRotating = speedRotating;
    this.pathOfGoing = pathOfGoing;
    this.deg = 0;
    this.path = new Path2D();
    this.coneWidth = coneWidth;
    this.currentPoint = 0;
    this.objectivePlayers = [];
    this.state = { following: false };
    this.follower = follower;
  }

  start() {
    this.objectivePlayers = Game.getObject('Player');
    this.colorO = new RGB(255, 10, 0, 1);
    this.colorCone = new RGB(255, 40, 0, 0.5);
    Game.instantiate(Missile, this.position);
    setInterval(() => {}, 10000);
  }

  /**
   * @returns {Vec2}
   */
  getCurrentPointIA() {
    return this.follower && this.state.following
      ? this.state.following.position
      : this.pathOfGoing[this.currentPoint];
  }

  IAdeg() {
    const currentPoint = this.getCurrentPointIA();
    if (currentPoint) {
      const dist = Vec2.substract(currentPoint, this.position).normalized();
      this.deg =
        (Math.atan2(dist.y, dist.x) * 180) / Math.PI + this.coneWidth / 2;
    }
  }

  conePath() {
    const p = new Path2D();
    ctx.fillStyle = this.colorCone.stringColor();
    this.deg += this.speedRotating;
    this.IAdeg();

    p.moveTo(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2,
    );
    const initialDeg = ((this.deg - this.coneWidth) * Math.PI) / 180;
    const endDeg = (this.deg * Math.PI) / 180;

    p.arc(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2,
      this.coneRadius,
      initialDeg,
      endDeg,
      false,
    );
    if (this.deg > 360) this.deg = 0;

    this.checkCollisionsPlayers(ctx, p);
    p.closePath();
    ctx.stroke(p);
    return p;
  }

  checkCollisionsPlayers(ctx, p) {
    this.objectivePlayers.forEach(e => {
      if (
        !e.destroyed &&
        !e.state.hiding &&
        ctx.isPointInPath(p, e.position.x, e.position.y)
      ) {
        if (e.position.x - this.position.x > 0 && e.colliding.left) {
          this.state.following = false;
          return;
        }
        if (e.position.x - this.position.x < 0 && e.colliding.right) {
          this.state.following = false;
          return;
        }
        if (e.position.y - this.position.y > 0 && e.colliding.top) {
          this.state.following = false;
          return;
        }
        if (e.position.y - this.position.y < 0 && e.colliding.down) {
          this.state.following = false;
          return;
        }
        if (this.follower) {
          this.state.following = e;
        }
        e.hp -= 1;
        if (e.hp <= 0) {
          Game.destroy(e);
        }
        // Fill style detected.
        ctx.fillStyle = 'rgb(40, 40, 100, 0.4)';
        return;
      }
      this.state.following = false;
    });
  }

  ownRendering() {
    const p = this.conePath();

    ctx.fill(p);
    ctx.fillStyle = this.colorO.stringColor();
    this.path = new Path2D();
    this.path.moveTo(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2,
    );

    this.path.arc(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2,
      this.height / 2,
      0,
      Math.PI * 2,
      true,
    );

    ctx.closePath();
    ctx.stroke(this.path);
    ctx.fill(this.path);
  }

  nextPoint() {
    const distance = Vec2.substract(
      this.position,
      this.pathOfGoing[this.currentPoint],
    ).magnitude();
    if (distance < 1) {
      this.currentPoint =
        this.currentPoint + 1 >= this.pathOfGoing.length
          ? 0
          : this.currentPoint + 1;
    }
  }

  update() {
    if (!this.pathOfGoing.length) return;
    this.nextPoint();
    const point = this.getCurrentPointIA();
    const newPos = Vec2.substract(point, this.position)
      .normalized()
      .add(this.position);
    this.pos(newPos.x, newPos.y);
  }
}

class Wall extends GameObject {
  constructor(w, h, pos, col = 'rgb(200, 200, 200)') {
    super(pos, w, h, [], { color: col, collider: true });
  }

  start() {}

  ownRendering() {
    ctx.beginPath();
    ctx.rect(this.position.x, this.position.y, this.width, this.height);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

class HP extends GameObject {
  constructor() {
    super(new Vec2(0, window.innerHeight - 30), window.innerWidth, 30, []);
    this.player = {};
    this.initialWidth = window.innerWidth;
  }

  start() {
    [this.player] = Game.getObject('Player');
  }

  ownRendering() {
    ctx.beginPath();
    ctx.fillStyle = 'rgb(255, 100, 0, 1)';
    ctx.rect(this.position.x, this.position.y, this.initialWidth, this.height);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = 'rgb(0, 200, 90)';
    ctx.rect(
      this.position.x,
      this.position.y,
      (this.player.hp * this.initialWidth) / 100,
      this.height,
    );
    ctx.fill();
  }
}

class MissileThrower extends GameObject {
  constructor(pos = new Vec2(10, 20)) {
    const w = 70;
    const h = 70;
    super(pos, w, h, [], { collider: true });
    this.colorMis = {};
    this.renderingFn = {};
    this.path = {};
    this.currentMissile = undefined;
  }

  start() {
    this.colorMis = new RGB(0, 100, 222, 1);
    this.renderingFn = circularColorStandard.bind(this);
  }

  ownRendering() {
    this.path = new Path2D();
    this.renderingFn();
  }

  update() {
    if (!this.currentMissile || this.currentMissile.destroyed) {
      this.currentMissile = Game.instantiate(Missile, this.position);
    }
  }
}

class Missile extends GameObject {
  constructor(pos) {
    super(pos, 40, 40, [], {
      collider: true,
    });
    /**
     * @type {HP}
     */
    this.hp = {};
    /**
     * @type {Path2D}
     */
    this.path = null;
    /**
     * @type {GameObject}
     */
    this.player = null;
  }

  start() {
    this.colorMis = new RGB(0, 100, 255, 0.9);
    [this.player] = Game.getObject('Player');
  }

  ownRendering() {
    this.path = new Path2D();

    ctx.fillStyle = this.colorMis.stringColor();
    this.path.moveTo(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2,
    );
    this.path.arc(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2,
      this.height / 2,
      0,
      Math.PI * 2,
      true,
    );
    ctx.stroke(this.path);
    ctx.fill(this.path);
    this.path.closePath();
  }

  update() {
    if (!this.player || this.player.destroyed) {
      Game.destroy(this);
      return;
    }
    const [q] = Input.getInputs('q');
    const point = this.player.position;
    let newPos = Vec2.substract(point, this.position);
    if (newPos.magnitude() <= 3) {
      // Basically if the user ain't pressing the q we substract the hp
      if (!q) {
        this.player.hp -= 10;
      }
      Game.destroy(this);
    }
    newPos = newPos.normalized();
    // newPos.x = Clamp(newPos.x, -1, 1);
    newPos.y = Clamp(newPos.y, -1, 1);
    newPos = newPos.multiply(4);
    newPos = newPos.add(this.position);
    this.pos(newPos.x, newPos.y);
  }
}

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
