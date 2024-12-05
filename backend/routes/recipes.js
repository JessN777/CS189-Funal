const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../config/db');

// Route to fetch daily recommendations
router.get('/daily-recommendations', async (req, res) => {
    try {
        const response = await axios.get(
            `https://api.spoonacular.com/recipes/random?number=12&apiKey=${process.env.SPOONACULAR_API_KEY}`
        );
        res.json(response.data.recipes);
    } catch (error) {
        console.error("Error fetching recipes:", error.message);
        res.status(500).json({ error: "Failed to fetch recipes" });
    }
});

// Route to fetch recipe details
router.get('/recipe-details/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const response = await axios.get(
            `https://api.spoonacular.com/recipes/${id}/information?apiKey=${process.env.SPOONACULAR_API_KEY}`
        );
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching recipe details:", error.message);
        res.status(500).json({ error: "Failed to fetch recipe details" });
    }
});

// Define the /search route
router.get('/search', async (req, res) => {
    const { preference, intolerance, minCalories, maxCalories } = req.query;

    console.log('Received search parameters:', req.query); // Log the parameters

    try {
        // Call Spoonacular API with search parameters
        const response = await axios.get(`https://api.spoonacular.com/recipes/complexSearch`, {
            params: {
                query: preference,
                intolerances: intolerance,
                minCalories,
                maxCalories,
                apiKey: process.env.SPOONACULAR_API_KEY
            }
        });

        // If no results, return an empty array
        const results = response.data.results || [];

        // Optionally, map fields if necessary (e.g., adapting API response structure)
        const mappedRecipes = await Promise.all(
            results.map(async recipe => {
                let calories = 'Unknown';
        
                // If calories aren't available in the complexSearch response, make an additional call
                if (!recipe.nutrition) {
                    try {
                        const detailedResponse = await axios.get(
                            `https://api.spoonacular.com/recipes/${recipe.id}/nutritionWidget.json`,
                            {
                                params: { apiKey: process.env.SPOONACULAR_API_KEY },
                            }
                        );
                        calories = detailedResponse.data.calories || 'Unknown';
                    } catch (error) {
                        console.error(`Failed to fetch detailed nutrition for recipe ID ${recipe.id}:`, error.message);
                    }
                } else {
                    calories = recipe.nutrition.nutrients.find(n => n.name === 'Calories')?.amount || 'Unknown';
                }
        
                return {
                    recipe_id: recipe.id,
                    recipe_name: recipe.title,
                    total_calories: calories,
                    ingredients: recipe.ingredients || [],
                };
            })
        );        

        console.log('Mapped Recipes:', mappedRecipes);
        res.json(mappedRecipes);
    } catch (error) {
        console.error('Error fetching recipes:', error.message);
        res.status(500).json({ error: 'Failed to fetch recipes from Spoonacular' });
    }
});

router.get('/:id/ingredients', async (req, res) => {
    const { id } = req.params;

    try {
        // Check if the recipe exists in the database
        const [existingRecipe] = await db.query('SELECT * FROM Recipes WHERE recipe_id = ?', [id]);

        if (existingRecipe.length === 0) {
            // Fetch recipe details from Spoonacular
            const recipeResponse = await axios.get(
                `https://api.spoonacular.com/recipes/${id}/information`,
                { params: { apiKey: process.env.SPOONACULAR_API_KEY } }
            );

            const { title, nutrition } = recipeResponse.data;

            // Extract total calories
            const calories = nutrition?.nutrients.find((n) => n.name === 'Calories')?.amount || 0;

            // Insert the recipe into the database
            await db.query(
                'INSERT INTO Recipes (recipe_id, recipe_name, total_calories) VALUES (?, ?, ?)',
                [id, title, calories]
            );
        }

        // Check if ingredients are already in the database
        const [ingredients] = await db.query('SELECT * FROM Ingredients WHERE recipe_id = ?', [id]);

        if (ingredients.length > 0) {
            return res.json(ingredients); // Return cached ingredients
        }

        // If not in the database, fetch from Spoonacular
        const ingredientsResponse = await axios.get(
            `https://api.spoonacular.com/recipes/${id}/information`,
            { params: { apiKey: process.env.SPOONACULAR_API_KEY } }
        );

        const fetchedIngredients = ingredientsResponse.data.extendedIngredients.map((ingredient) => ({
            ingredient_id: ingredient.id,
            ingredient_name: ingredient.name,
            quantity: `${ingredient.amount} ${ingredient.unit}`.trim(),
        }));

        // Save fetched ingredients to the database
        const ingredientValues = fetchedIngredients.map(({ ingredient_id, ingredient_name, quantity }) => [
            id, // recipe_id
            ingredient_name,
            quantity,
            0, // Default calories_per_quantity to 0 if not provided
        ]);

        await db.query(
            'INSERT INTO Ingredients (recipe_id, ingredient_name, quantity, calories_per_quantity) VALUES ?',
            [ingredientValues]
        );

        res.json(fetchedIngredients); // Return fetched ingredients
    } catch (error) {
        console.error(`Failed to fetch ingredients for recipe ID ${id}:`, error.message);
        res.status(500).json({ error: `Failed to fetch ingredients for recipe ID ${id}` });
    }
});

module.exports = router;
