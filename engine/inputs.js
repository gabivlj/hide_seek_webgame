/**
 * @description Inputs keycode object, we'll also check here when user gets inputs if they exist and inform if it exist
 */
const INPUTS = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  // Get all the chars from there (Lazy way)
  ...new Array(25)
    .fill(0)
    .map((_, index) => String.fromCharCode(97 + index))
    .reduce(
      (prev, char, index) => ({ ...prev, [char.toUpperCase()]: 65 + index }),
      {},
    ),
  MOUSEX: 1,
  MOUSEY: 1,
  // SPACE VARIANTS
  SPACEBAR: 32,
  SPACE: 32,
  ' ': 32,
  '': 32,
};

function guidGenerator() {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return `_${Math.random()
    .toString(36)
    .substr(2, 9)}`;
}

/**
 * @description Map keys that will store if an input exists
 */
const mapKeys = new Array(200).fill(0);

/**
 * @description Sets in the object if the input is being pressed (Refactor this in the future)
 */
const processInput = (inputs, keyNumber, key, inputArrowKeys, inputThis) => {
  if (keyNumber === INPUTS[inputArrowKeys] && mapKeys[key]) {
    inputs[inputThis] = 1;
  } else if (keyNumber === INPUTS[inputArrowKeys] && !mapKeys[key])
    inputs[inputThis] = 0;
};

let globalInputs = null;

class Input {
  constructor() {
    if (globalInputs) {
      throw new Error('You cannot instantiate inputs class!');
    }
    this.EXTRA_INPUTS = { MOUSEX: 0, MOUSEY: 0 };
    /**
     * @description The purpose of this is check in every frame what input is being checked and that it goes smooth.
     */
    const inputKeys = Object.keys(INPUTS);
    window.onkeydown = window.onkeyup = e => {
      // eslint-disable-next-line no-restricted-globals
      e = e || event; // to deal with IE
      mapKeys[e.keyCode] = e.type === 'keydown';
      inputKeys.forEach(key => {
        const keyNumber = parseInt(INPUTS[key], 10);
        processInput(
          this.EXTRA_INPUTS,
          keyNumber,
          INPUTS[key],
          key.toUpperCase(),
          key,
        );
      });
    };
    document.onmousemove = e => {
      if (e.clientX && e.clientY) {
        INPUTS.MOUSEX = e.clientX;
        INPUTS.MOUSEY = e.clientY;
        this.EXTRA_INPUTS.MOUSEX = INPUTS.MOUSEX;
        this.EXTRA_INPUTS.MOUSEY = INPUTS.MOUSEY;
      }
    };
  }

  /**
   * @description We'll use this for static getInputs function
   */
  ___getInputs(inputs) {
    return inputs.reduce((prev, now) => {
      now = now.toUpperCase();
      prev.push(
        INPUTS[now]
          ? this.EXTRA_INPUTS[now] || 0
          : (() => {
              console.warn(`${now} input doesn't exist!`);
              return null;
            })(),
      );
      return prev;
    }, []);
  }

  /**
   * @param  {...String} inputs, [a...z] [A..Z] [UP..LEFT](clockwise)
   */
  static getInputs(...inputs) {
    return globalInputs.___getInputs(inputs);
  }
}

globalInputs = new Input();
