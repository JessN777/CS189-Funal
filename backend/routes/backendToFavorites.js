const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../config/db');

router.get('/', async (req, res) => {
    try {
        const [recipes] = await db.query('SELECT * FROM Recipes');
        const [ingredients] = await db.query('SELECT * FROM Ingredients');

        // Combine recipes and their ingredients
        const result = recipes.map((recipe) => ({
            id: recipe.recipe_id,
            name: recipe.recipe_name,
            calories: recipe.total_calories,
            image: recipe.image,
            ingredients: ingredients
                .filter((ingredient) => ingredient.recipe_id === recipe.recipe_id)
                .map((ingredient) => ({
                    name: ingredient.ingredient_name,
                    quantity: ingredient.quantity,
                    calories: ingredient.calories_per_quantity,
                })),
        }));

        res.json(result);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).json({ message: 'Failed to fetch recipes' });
    }
});

router.post('/', async (req, res) => {
    const { id, name, total_calories, image, ingredients } = req.body;

    try {
        // Check if the recipe already exists in the database
        const [existingRecipe] = await db.query('SELECT * FROM Recipes WHERE recipe_id = ?', [id]);

        if (existingRecipe.length > 0) {
            return res.status(400).json({ message: 'Recipe is already in the database' });
        }

        // Add the recipe to the Recipes table
        const [recipeResult] = await db.query(
            'INSERT INTO Recipes (recipe_id, recipe_name, total_calories) VALUES (?, ?, ?)',
            [id, name, total_calories, image]
        );

        // Add the ingredients to the Ingredients table
        if (ingredients && ingredients.length > 0) {
            const ingredientValues = ingredients.map(({ name, quantity, calories }) => [
                id, // Use the recipe ID from the request body
                name,
                quantity,
                calories,
            ]);

            await db.query(
                'INSERT INTO Ingredients (recipe_id, ingredient_name, quantity, calories_per_quantity) VALUES ?',
                [ingredientValues]
            );
        }

        res.status(201).json({ message: 'Recipe added successfully' });
    } catch (error) {
        console.error('Error adding recipe:', error);
        res.status(500).json({ message: 'Failed to add recipe' });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await db.query('DELETE FROM Recipes WHERE recipe_id = ?', [id]);
        res.send('Recipe deleted successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

module.exports = router;