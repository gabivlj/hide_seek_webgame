/* eslint-disable no-plusplus */
/* eslint-disable prefer-const */
/* eslint-disable no-continue */
/* eslint-disable no-param-reassign */
/* eslint-disable no-undef */
/* eslint-disable no-use-before-define */

//
//  Created by Gabriel Villalonga Simón.
//  Copyright © 2020 Gabriel Villalonga Simón. All rights reserved.
//  A game engine and Hide And Seek game. The game engine is just an interface for easier interaction with
//  the canvas.
//

/**
 * TODO Finish line and pass to the next level (scenes)
 * TODO Build 3 scenes
 */

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

/**
 * @description Function that satisfies the gameplay programming paradigm of canX = false and canX = true after x milliseconds.
 * @param {Function} now callback that will be fired the moment this function is called.
 * @param {Function} future callback that will be fired after x ms.
 * @param {number} ms milliseconds to wait until the future callback.
 */
function nowfuture(now, future, ms = 500) {
  now();
  setTimeout(future, ms);
}

/**
 * @description A RGB interface with utils
 */
class RGB {
  constructor(r, g, b, a = 1) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  /**
   * @description RGB formated string (for html and canvas color)
   * @returns {string}
   */
  stringColor() {
    return `rgb(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
  }
}

/**
 * @description This function is in charge of calling a circular drawing to a desired "this" object.
 *              Bind it to the class that you wanna work with, make sure that it has colorCircular (RGB type) and path
 *              attributes and then call it on ownRendering()
 */
function circularColorStandard() {
  this.path = new Path2D();
  ctx.fillStyle = this.colorCircular.stringColor();
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

/**
 * @param {number} value
 * @param {number} x
 * @param {number} y
 * @description Clamp a value between x and y
 * @returns {number}
 */
function Clamp(value, x, y) {
  if (value <= x) return x;
  if (value >= y) return y;
  return value;
}

/**
 * @param {Image[]} images The images array
 * @returns {Promise} Whenever the images are done, it returns the completed promise, don't catch an error because we don't use reject here.
 */
function waitForImages(images) {
  return new Promise(res => {
    const interval = setInterval(() => {
      let charged = true;
      images.forEach(image => {
        if (!image.complete) {
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

/**
 * @description Returns a DEEP copy of an object, only supports arrays, objects, integers, strings etc...
 */
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

/**
 * @description Returns a copy of an object (better format)
 */
function copyObject(a) {
  const copy = {};
  copy.__proto__ = a.__proto__;
  Object.keys(a).forEach(element => {
    copy[element] = COPY(a[element]);
  });
  return copy;
}

/**
 * @description Returns a true copy of an array
 * @param {Array<*>} array
 */
function copyArray(array) {
  const newArray = [];
  array.forEach(a => {
    newArray.push(copyObject(a));
  });
  return newArray;
}

/**
 * @description Vec2 help class. Operations don't change the Vec2 instance,
 *              it returns a new one following a functional programming
 *              approach.
 */
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

  /**
   * @param {number} number
   * @returns {Vec2}
   */
  multiply(number) {
    return new Vec2(this.x * number, this.y * number);
  }

  divide(number) {
    return new Vec2(this.x / number, this.y / number);
  }

  /**
   * @description Returns normalized vector.
   * @returns {Vec2} Normalized vector.
   */
  normalized() {
    const m = this.magnitude();
    if (m >= 0) return this.divide(m);
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

  /**
   * @param {Vec2} other
   * @returns {Vec2}
   */
  add(other) {
    const V = new Vec2(this.x + other.x, this.y + other.y);
    return V;
  }
}

class GameObject {
  /**
   * @param {Vec2} position Position of the corner (starts drawing to the right and down, using the CANVAS API)
   * @param {number} width Width (Collision wise and sprite render wise)
   * @param {number} height Height (Collision wise and sprite render wise)
   * @param {string[]} sprites URL's of the sprites
   * @param {{ color: string, collider: boolean }} configuration The desired configuration for this gameObject, collider will be useful if you want this to collide to things
   * @description The base gameObject, inherit from this.
   */
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

  // Yea don' touch this
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

  /**
   * @param {number} x
   * @param {number} y
   * @description Sets the gameObject to the desired position, use this function instead of changing manually this.position
   */
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

/**
 * @description A Scene stores GameObjects. It's useful for storing the original information of the gameObjects.
 *              This means that the gameObjects are stored TWICE in the game, so take in mind that.
 */
class Scene {
  /**
   * @param {number} w The width of the scene
   * @param {number} h The height of the scene
   */
  constructor(w, h) {
    this.gameObjects = [];
    this.width = w;
    this.height = h;
  }

  /**
   * @description Adds a gameObject to the scene (Won't be instantiated until the next game.start())
   * @param {GameObject} gameObject The gameObject to add to the scene
   */
  add(gameObject) {
    this.gameObjects.push(gameObject);
  }
}

let _____actualGame = null;

/**
 * @description The current running game.
 */
class Game {
  constructor() {
    this.gameObjects = [];
    this.then = 0;
    this.stop = false;
    this.animationFr = 0;
    this.animation = 0;
    this.scene = null;
  }

  /**
   *
   * @param {Vec2} position position
   */
  static IsPositionOutOfBounds(position) {
    const game = _____actualGame;
    if (!game.scene) return null;
    return (
      position.y < 0 ||
      position.y >= game.scene.height ||
      game.scene.width < position.x ||
      position.x < 0
    );
  }

  static game() {
    return _____actualGame;
  }

  /**
   * @description Checks a path if it collides with other path
   * @param {Path2D} path
   * @returns {GameObject?} Returns null if it doesn't, returns gameObject if it does
   */
  static checkColPath(path) {
    const l = _____actualGame.gameObjects.length;
    for (let i = 0; i < l; i += 1) {
      const otherObject = _____actualGame.gameObjects[i];
      if (
        ctx.isPointInPath(path, otherObject.position.x, otherObject.position.y)
      ) {
        return otherObject;
      }
    }
    return false;
  }

  /**
   * @description Using AABB checks if the G.O collides with another collider: true gameObject. Returns cool information about the colliding situation
   * @param {GameObject} gameObject
   */
  static checkCol(gameObject) {
    const bottom = gameObject.position.y + gameObject.height;
    const right = gameObject.position.x + gameObject.width;
    const l = _____actualGame.gameObjects.length;
    const collidedGameObjects = [];
    let conditions;
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

      conditions = {
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

      collidedGameObjects.push({
        collided: true,
        colliderInformation: {
          conditions,
          collided: true,
        },
      });
    }
    if (collidedGameObjects.length) {
      return {
        collided: true,
        colliderInformation: {
          conditions,
          collided: true,
        },
        arrayCollided: collidedGameObjects,
      };
    }
    return {
      collided: false,
      colliderInformation: {},
    };
  }

  /**
   * @param {Scene} scene The scene that you wanna start the game with. You can change scenes with this as well
   * @param {string[]} sprites A sprite array to load images.
   */
  async start(scene, sprites = []) {
    this.scene = scene;
    if (this.reqAnimationFrame) {
      this.gameObjects = [];
      clearInterval(this.reqAnimationFrame);
      window.cancelAnimationFrame(this.animation);
      this.then = 0;
    }
    this.gameObjects = copyArray(scene.gameObjects);
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
   * @description Checks if a unknownGameObject is of the specified type (Pass constructor)
   * @param {FunctionConstructor} type
   * @param {GameObject} unknownGameObject
   * @returns {Boolean}
   */
  static IsType(type, unknownGameObject) {
    return unknownGameObject.constructor.name === type.name;
  }

  /**
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

  /**
   * @param {GameObjectT} GameObject The gameObject you wanna instantiate (Pass the type, not the instance)
   * @param  {...any} params The parameters that you wanna pass to the constructor of the gameObject
   * @returns {GameObject} The instantiated gameObject
   */
  instantiate(GameObject, ...params) {
    const gameObject = new GameObject(...params);
    gameObject.instanceID = guidGenerator();
    gameObject.start();
    this.gameObjects.push(gameObject);
    return gameObject;
  }

  /**
   * @param {GameObjectT} GameObject The gameObject you wanna instantiate (Pass the type, not the instance)
   * @param  {...any} params The parameters that you wanna pass to the constructor of the gameObject
   * @returns {GameObject} The instantiated gameObject
   */
  static instantiate(gameObject, ...params) {
    return _____actualGame.instantiate(gameObject, ...params);
  }

  /**
   * @param {GameObject} gameObject The gameObject you wanna destroy
   */
  destroy(gameObject) {
    this.gameObjects = this.gameObjects.filter(gameObjec => {
      gameObject.destroyed = true;
      return gameObjec.instanceID !== gameObject.instanceID;
    });
  }

  /**
   * @param {GameObject} gameObject The gameObject you wanna destroy
   */
  static destroy(gameObject) {
    _____actualGame.destroy(gameObject);
  }

  update(frequencyRate = 15) {
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
    };
    this.reqAnimationFrame = setInterval(() => {
      this.animation = requestAnimationFrame(upd);
    }, frequencyRate);
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
    this.state = {
      hiding: false,
      won: false,
      canShoot: true,
      canWall: true,
      wallsLeft: 3,
      bulletsLeft: 10,
    };
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

  handleWallBuild(space) {
    if (!space) return;
    if (this.state.wallsLeft <= 0) return;
    if (!this.state.canWall) return;
    nowfuture(
      () => {
        this.state.canWall = false;
      },
      () => {
        this.state.canWall = true;
      },
      500,
    );
    const instanceNextPos = this.position.add(
      new Vec2(this.signX * this.width, this.signY * this.height),
    );
    this.state.wallsLeft -= 1;
    // w, h, pos, col = 'rgb(200, 200, 200)'
    Game.instantiate(Wall, this.width, this.height, instanceNextPos);
  }

  handleBulletLogic(l, r, u, d) {
    if (!this.state.canShoot) return;
    if (this.state.bulletsLeft <= 0) return;
    if (!l && !r && !u && !d) return;
    // Checks if r & l was pressed at the same time, if it was then set left to 0
    if (l && r) {
      r = 1;
      l = 0;
    }
    if (u && d) {
      d = 0;
      u = 1;
    }

    nowfuture(
      () => {
        this.state.canShoot = false;
      },
      () => {
        this.state.canShoot = true;
      },
      500,
    );
    const truePosition = new Vec2(
      this.position.x - this.width / 2,
      this.position.y + this.height / 2,
    );
    const signX = r - l;
    const signY = u - d;
    const newPos = truePosition.add(
      new Vec2(signX * this.width, signY * this.height),
    );
    Game.instantiate(Bullet, signX, signY, newPos);
    this.state.canShoot = false;
    setTimeout(() => {
      this.state.bulletsLeft -= 1;
      this.state.canShoot = true;
    }, 500);
  }

  start() {}

  update(dt) {
    let [w, a, d, s, q, lt, rt, up, dwn, spacebar, x] = Input.getInputs(
      'w',
      'a',
      'd',
      's',
      'q',
      'left',
      'right',
      'up',
      'down',
      ' ',
      'x',
    );
    this.handleWallBuild(spacebar);
    this.handleBulletLogic(lt, rt, up, dwn);
    this.colliding = { top: false, left: false, right: false, down: false };
    if (this.hp <= 0) {
      Game.destroy(this);
      setTimeout(() => window.location.reload(), 2000);
      return;
    }
    if (!this.input) return;

    this.state.hiding = !!q;
    if (this.state.hiding) {
      if (!x) return;
      const collision = Game.checkCol(this, this.path);
      if (!collision.collided) return;
      collision.arrayCollided.forEach(collision => {
        const { gameObject } = collision.colliderInformation.conditions;
        if (
          Game.IsType(Watcher, gameObject) ||
          Game.IsType(MissileThrower, gameObject)
        ) {
          Game.destroy(gameObject);
        }
      });
      return;
    }
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
      collision.arrayCollided.forEach(collision => {
        const { gameObject } = collision.colliderInformation.conditions;

        if (collision.colliderInformation.conditions.top) {
          if (s > 0) s = 0;
          this.colliding.down = true;
        }
        if (collision.colliderInformation.conditions.bot) {
          if (w > 0) w = 0;
          this.colliding.top = true;
        }
        if (collision.colliderInformation.conditions.left) {
          if (d > 0) d = 0;
          this.colliding.right = true;
        }
        if (collision.colliderInformation.conditions.right) {
          if (a > 0) a = 0;
          this.colliding.left = true;
        }
      });
    }
    this.pos(
      this.position.x + (-a + d) * dt * this.speed,
      this.position.y + (-w + s) * this.speed * dt,
    );
  }
}

class Bullet extends GameObject {
  constructor(signX, signY, position) {
    super(position, 20, 20, [], { collider: true });
    this.colorCircular = {};
    this.path = undefined;
    this.signX = signX;
    this.signY = signY;
    this.speed = 500;
  }

  start() {
    this.path = new Path2D();
    this.colorCircular = new RGB(200, 0, 0, 1);
    this.renderingFn = circularColorStandard.bind(this);
  }

  ownRendering() {
    this.renderingFn();
  }

  update(dt) {
    const collider = Game.checkCol(this);
    this.pos(
      this.position.x + this.signX * this.speed * dt,
      this.position.y - this.signY * this.speed * dt,
    );
    if (Game.IsPositionOutOfBounds(this.position)) Game.destroy(this);
    if (!collider.collided) return;
    const { gameObject } = collider.colliderInformation.conditions;
    if (Game.IsType(Player, gameObject)) return;
    if (Game.IsType(Wall, gameObject)) Game.destroy(this);
    if (
      Game.IsType(MissileThrower, gameObject) ||
      Game.IsType(Missile, gameObject) ||
      Game.IsType(Watcher, gameObject)
    ) {
      Game.destroy(this);
      Game.destroy(gameObject);
    }
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
    colorOfCircle = new RGB(...[255, 10, 0], 1),
    colorCone = new RGB(...[255, 40, 0], 0.5),
  ) {
    super(pos, 30, 30, [], { collider: true });
    this.colorCone = colorCone;
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
    this.colorO = colorOfCircle;
  }

  start() {
    this.objectivePlayers = Game.getObject('Player');
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
          return;
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

/**
 * @description The missile thrower, can be destroyed by player bullets.
 */
class MissileThrower extends GameObject {
  /**
   *
   * @param {Vec2} pos The initial position
   */
  constructor(pos = new Vec2(10, 20)) {
    const w = 70;
    const h = 70;
    super(pos, w, h, [], { collider: true });
    this.colorCircular = {};
    this.renderingFn = {};
    this.path = {};
    this.currentMissile = undefined;
    this.player = {};
  }

  start() {
    this.colorCircular = new RGB(0, 100, 222, 1);
    this.renderingFn = circularColorStandard.bind(this);
    [this.player] = Game.getObject('Player');
  }

  ownRendering() {
    this.path = new Path2D();
    this.renderingFn();
  }

  update() {
    if (!this.player || this.player.destroyed) return;
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
    this.fnCircular = circularColorStandard.bind(this);
    this.finish = false;
  }

  start() {
    this.colorCircular = new RGB(0, 100, 255, 0.9);
    [this.player] = Game.getObject('Player');
    setTimeout(() => {
      this.finish = true;
      Game.destroy(this);
    }, 10 * 1000);
  }

  ownRendering() {
    this.fnCircular();
  }

  collideWall() {
    const collide = Game.checkCol(this);
    if (!collide.collided) return false;
    collide.arrayCollided.forEach(collide => {
      if (
        Game.IsType(Wall, collide.colliderInformation.conditions.gameObject)
      ) {
        Game.destroy(this);
      }
    });
    return true;
  }

  update() {
    if (this.finish) return;
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
    this.collideWall();
  }
}

const scenes = [];
class FinishLine extends GameObject {
  constructor(pos) {
    super(pos, 30, 30, [], { collider: true });
    this.fnCircular = {};
    this.colorCircular = undefined;
    this.path = undefined;
    this.currentScene = 0;
  }

  start() {
    this.path = new Path2D();
    this.fnCircular = circularColorStandard.bind(this);
    this.colorCircular = new RGB(100, 255, 30, 1);
  }

  ownRendering() {
    this.fnCircular();
  }

  update() {
    const collide = Game.checkCol(this);
    if (!collide.collided) return;
    if (!Game.IsType(Player, collide.colliderInformation.conditions.gameObject))
      return;
    this.currentScene = (this.currentScene + 1) % scenes.length;
    Game.game().start(scenes[this.currentScene]);
  }
}
