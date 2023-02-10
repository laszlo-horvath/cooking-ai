export const getPrompt = (DAILY_MEAL = 'breakfast', INTOLERANCE = 'lactose intolerance', IDEA_COUNT = 3) => {
  const prompt = `Give me a ${IDEA_COUNT} ideas what I should eat for ${DAILY_MEAL} and clearly label them "1.", "2." and "3.". Please consider the following food intolarence: ${INTOLERANCE}. Make sure not to include complex or hard cooking recipes only easy ones that don't require advanced cooking skills.`;
  return prompt;
};
