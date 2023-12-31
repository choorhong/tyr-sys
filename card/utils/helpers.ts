import promptSync from "prompt-sync";
const prompt = promptSync();

const maxNumOfCards = 13 * 4;
/**
 *
 * @returns a deck of cards in an array, 52 in total.
 */
export const generateCardDeck = () => {
  // Generate card values
  const values = Array.from({ length: 13 }, (_, index) => {
    const i = index + 1;

    switch (i) {
      case 1:
        return "A";
      case 10:
        return "X";
      case 11:
        return "J";
      case 12:
        return "Q";
      case 13:
        return "K";
      default:
        return i.toString();
    }
  });

  // Generate card suits
  const suits = ["S", "H", "C", "D"];

  // Generate total cards with suit and value. Eg: 'H-A'
  const cards = [];
  for (let s = 0; s < suits.length; s++) {
    for (let v = 0; v < values.length; v++) {
      const value = values[v];
      const suit = suits[s];
      cards.push(`${suit}-${value}`);
    }
  }

  return cards;
};

/**
 * Shuffles array in place.
 * @param {Array} a an array containing the items.
 */
export const shuffle = (a: string[]) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/**
 *
 * @param numberOfUser number of user
 * @returns boolean. True if validation fails
 */
export const validateAnswer = (numberOfUser: any) => {
  return !numberOfUser || isNaN(numberOfUser) || parseInt(numberOfUser) <= 0;
};

/**
 * Ask the number of users to receive cards
 * @returns positive non-float number
 */
export const askQuestion = () => {
  let numberOfUser: any;

  while (validateAnswer(numberOfUser)) {
    numberOfUser = prompt("Please input the number of user: ");

    if (validateAnswer(numberOfUser)) {
      console.log("Invalid value, please try again!");
    }
  }
  return parseInt(numberOfUser);
};

/**
 *
 * @param {number} numberOfUser number of user
 * @returns list of empty array
 */
export const generateUserArray = (numberOfUser: number) => {
  const length = Math.min(numberOfUser, maxNumOfCards);
  return Array.from({ length }, (_, _index) => []);
};

/**
 *
 * @param numberOfUser number of user
 * @returns list of array of distributed cards
 */
export const distributeCard = (numberOfUser: number) => {
  // Generate a deck of cards
  const cards = generateCardDeck();

  // Shuffle the generated deck of cards
  const shuffledCards = shuffle(cards);

  // Generate list of empty array as temporary placeholder
  const array: string[][] = generateUserArray(numberOfUser);

  let arrayIndex = 0;

  shuffledCards.forEach((element) => {
    array[arrayIndex].push(element);

    arrayIndex++;

    if (arrayIndex >= array.length) {
      arrayIndex = 0;
    }
  });

  return array;
};

/**
 *
 * @param {string[][]} dc list of array of distributed cards
 * @param {number} userInput number of users
 */
export const printResult = (dc: string[][], userInput?: number) => {
  dc.forEach((el, index) => {
    console.log(
      `User ${index + 1} receives: ${el}. Number of card(s) received: ${
        el.length
      }`
    );
  });
  if (userInput && userInput > maxNumOfCards) {
    if (userInput - maxNumOfCards === 1) {
      console.log("Sadly, user 53 will not receive any card");
    } else {
      console.log(
        `Sadly, user 53 to user ${userInput} will not receive any card`
      );
    }
  }
};
