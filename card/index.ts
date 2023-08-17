import { askQuestion, distributeCard, printResult } from "@/utils";

// Prompt the user
const numberOfUser = askQuestion();

// Generate a deck of cards, shuffle cards, and distribute cards to the user(s)
const distrbutedCards = distributeCard(numberOfUser);

// Logging the results
printResult(distrbutedCards);
