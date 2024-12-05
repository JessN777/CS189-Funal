import React, { useEffect, useState } from 'react';
import '../SearchAndResults.css';
import '../index.css';

function Results() {
    const [preferences, setPreferences] = useState({
        foodPreference: '',
        foodIntolerance: '',
        calories: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [recipes, setRecipes] = useState([]);

    const handleSaveToFavorites = async (recipe) => {
        try {
            const payload = {
                id: recipe.recipe_id, // Use `recipe_id` from search results
                name: recipe.recipe_name,
                total_calories: recipe.total_calories || 0,
                ingredients: recipe.ingredients.map((ingredient) => ({
                    name: ingredient.ingredient_name,
                    quantity: ingredient.quantity,
                    calories: ingredient.calories || 0, // Handle cases where calories may not exist
                })),
            };
    
            console.log('Payload being sent:', payload); // Debugging log
            const response = await fetch('http://localhost:5000/api/favorites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
    
            if (!response.ok) {
                throw new Error('Failed to save recipe to favorites');
            }
    
            alert(`${recipe.recipe_name} has been added to your favorites!`);
        } catch (error) {
            console.error('Error saving recipe to favorites:', error);
        }
    };                        

    useEffect(() => {
        const savedPreferences = JSON.parse(localStorage.getItem('searchPreferences')) || {};
        setPreferences(savedPreferences);

        const fetchRecipeDetails = async () => {
            try {
                const searchResults = JSON.parse(localStorage.getItem('searchResults')) || [];
                if (searchResults.length > 0) {
                    const detailedRecipes = await Promise.all(
                        searchResults.map(async (recipe) => {
                            if (!recipe.recipe_id) {
                                console.error('Missing recipe_id for recipe:', recipe);
                                return null;
                            }
                            try {
                                const response = await fetch(`http://localhost:5000/api/recipes/${recipe.recipe_id}/ingredients`);
                                if (!response.ok) {
                                    throw new Error(`Failed to fetch ingredients for recipe_id: ${recipe.recipe_id}`);
                                }
                                const ingredients = await response.json();
                                return { ...recipe, ingredients };
                            } catch (error) {
                                console.error(error.message);
                                return null;
                            }
                        })
                    );
                    setRecipes(detailedRecipes.filter(recipe => recipe !== null));
                } else {
                    setRecipes([]);
                }
                setLoading(false);
            } catch (err) {
                console.error('Error fetching recipe details:', err);
                setError('Failed to load recipe details');
                setLoading(false);
            }
        };

        fetchRecipeDetails();
    }, []);

    return (
        <div className="search-and-results">
            <div className="container1">
                <h1 className="title">Result</h1>

                <div className="filter-section">
                    <h2 className="filter-title">Filter</h2>
                    <div className="filter-options">
                        <div className="filter-group">
                            <span>Food Preference:</span>
                            <span id="preference-value">{preferences.foodPreference || 'None'}</span>
                        </div>
                        <div className="filter-group">
                            <span>Food Intolerance:</span>
                            <span id="intolerance-value">{preferences.foodIntolerance || 'None'}</span>
                        </div>
                        <div className="filter-group">
                            <span>Calories:</span>
                            <span id="calories-value">{preferences.calories || 'Any'}</span>
                        </div>
                    </div>
                </div>

                <div className="recipe-content">
                    {loading ? (
                        <p>Loading recipes...</p>
                    ) : error ? (
                        <p>{error}</p>
                    ) : recipes.length === 0 ? (
                        <p>No recipes found matching your criteria</p>
                    ) : (
                        recipes.map(recipe => (
                            <div key={recipe.recipe_id}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h2 className="recipe-title">{recipe.recipe_name}</h2>
                                    <p className="calories">
                                        Calories: {recipe.total_calories !== 'Unknown' ? `${recipe.total_calories} kcal` : 'Data not available'}
                                    </p>
                                    <button 
                                        className="btn-favorite" 
                                        onClick={() => handleSaveToFavorites(recipe)}
                                        style={{ marginLeft: '10px' }}
                                    >
                                        Save to Favorites
                                    </button>
                                </div>
                                <br />
                                <div className="ingredients-table">
                                    <h2 className="ingredient-title">Ingredients</h2>
                                    <table>
                                        <tbody>
                                            {recipe.ingredients.map((ingredient, index) => (
                                                <tr key={`${ingredient.ingredient_id || 'unknown'}-${index}`}>
                                                    <td>{ingredient.ingredient_name || 'Unknown'}</td>
                                                    <td>{ingredient.quantity || 'Unknown'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <br />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default Results;
