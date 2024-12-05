app.get('/recipes', async (req, res) => {
    try {
        const [recipes] = await db.query('SELECT * FROM Recipes');
        const [ingredients] = await db.query('SELECT * FROM Ingredients');

        const result = recipes.map(recipe => ({
            id: recipe.recipe_id,
            name: recipe.recipe_name,
            calories: recipe.total_calories,
            ingredients: ingredients
                .filter(ingredient => ingredient.recipe_id === recipe.recipe_id)
                .map(({ ingredient_name, quantity, calories_per_quantity }) => ({
                    name: ingredient_name,
                    quantity,
                    calories: calories_per_quantity,
                })),
        }));

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

app.post('/recipes', async (req, res) => {
    const { name, total_calories, ingredients } = req.body;

    try {
        const [recipeResult] = await db.query('INSERT INTO Recipes (recipe_name, total_calories) VALUES (?, ?)', [
            name,
            total_calories,
        ]);

        const recipeId = recipeResult.insertId;

        if (ingredients && ingredients.length > 0) {
            const ingredientValues = ingredients.map(({ name, quantity, calories }) => [
                recipeId,
                name,
                quantity,
                calories,
            ]);

            await db.query(
                'INSERT INTO Ingredients (recipe_id, ingredient_name, quantity, calories_per_quantity) VALUES ?',
                [ingredientValues]
            );
        }

        res.status(201).send('Recipe added successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

app.delete('/recipes/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await db.query('DELETE FROM Recipes WHERE recipe_id = ?', [id]);
        res.send('Recipe deleted successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});


