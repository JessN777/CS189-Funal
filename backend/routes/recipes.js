const express = require('express');
const router = express.Router();
const axios = require('axios');

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

module.exports = router;
