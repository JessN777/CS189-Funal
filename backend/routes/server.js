const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

// Middleware
app.use(cors()); // To allow cross-origin requests
app.use(bodyParser.json()); // To parse JSON request bodies

// Mock data (replace with a real database)
let recipes = [
  { id: 1, name: 'Broccoli-Cheese Egg in a Mug', calories: 300, category: 'Breakfast', instructions: 'Mix ingredients and microwave for 2 mins.' },
  { id: 2, name: 'Avocado Toast', calories: 250, category: 'Breakfast', instructions: 'Spread avocado on toast and season.' },
  { id: 3, name: 'Grilled Chicken Salad', calories: 400, category: 'Lunch', instructions: 'Grill chicken and mix with greens.' }
];

let favorites = [];

// Route: Search Recipes
app.post('/api/search', (req, res) => {
  const { foodPreference, calorieLimit } = req.body;

  // Filter recipes based on food preference and calorie limit
  const results = recipes.filter(
    (recipe) =>
      recipe.name.toLowerCase().includes(foodPreference.toLowerCase()) &&
      recipe.calories <= calorieLimit
  );

  res.json({ results });
});

// Route: Daily Recommendations
app.get('/api/daily-recommendations', (req, res) => {
  // Here, you could implement logic to provide daily-changing recommendations
  res.json({ recommendations: recipes.slice(0, 3) });
});

// Route: My Favorites
app.get('/api/favorites', (req, res) => {
  res.json({ favorites });
});

// Route: Add to Favorites
app.post('/api/favorites', (req, res) => {
  const { recipeId } = req.body;
  const recipe = recipes.find((r) => r.id === recipeId);

  if (recipe && !favorites.includes(recipe)) {
    favorites.push(recipe);
    res.json({ message: 'Recipe added to favorites', favorites });
  } else {
    res.status(400).json({ message: 'Recipe already in favorites or not found' });
  }
});

// Route: Remove from Favorites
app.delete('/api/favorites/:id', (req, res) => {
  const recipeId = parseInt(req.params.id);
  favorites = favorites.filter((r) => r.id !== recipeId);

  res.json({ message: 'Recipe removed from favorites', favorites });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
