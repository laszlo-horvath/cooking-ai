export const getPrompt = (DAILY_MEAL = 'breakfast', INTOLERANCE = 'lactose intolerance', IDEA_COUNT = 3) => {
  const prompt = `Give me a ${IDEA_COUNT} ideas what I should eat for ${DAILY_MEAL.toLowerCase()} and clearly start every of them with "---" so I can programatically split them. Please consider the following food intolarence: ${INTOLERANCE} intolarence. Make sure not to include complex or hard cooking recipes only easy ones that don't require advanced cooking skills. Concatenate the food names in hungarian after the english name inside brackets.`;
  return prompt;
};
