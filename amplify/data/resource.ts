import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

// Keep the first persistence pass close to the current frontend state:
// recipes, meal-plan slot assignments, and grocery items.
const schema = a.schema({
  Recipe: a
    .model({
      id: a.id().required(),
      title: a.string().required(),
      image: a.string(),
      servings: a.integer(),
      preparationMinutes: a.integer(),
      cookingMinutes: a.integer(),
      nutrition: a.json(),
      extendedIngredients: a.json(),
      tags: a.string().array(),
      source: a.string().required(),
    })
    .authorization((allow) => [allow.owner()]),

  MealPlanEntry: a
    .model({
      id: a.id().required(),
      date: a.date().required(),
      slot: a.string().required(),
      recipeId: a.id().required(),
    })
    .authorization((allow) => [allow.owner()]),

  GroceryItem: a
    .model({
      id: a.id().required(),
      name: a.string().required(),
      quantity: a.string(),
      category: a.string(),
      source: a.string(),
      checked: a.boolean().required(),
    })
    .authorization((allow) => [allow.owner()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
