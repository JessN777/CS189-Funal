import React, { useEffect, useState } from 'react';
import './src/SearchAndResults.css';
import './src/index.css';


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
            const response = await fetch('http://localhost:5000/api/recipes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(recipe),
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
      const fetchRecipeDetails = async () => {
        try {
          const searchResults = JSON.parse(localStorage.getItem('searchResults'));
          if (searchResults) {
            // Fetch full recipe details including ingredients for each recipe
            const detailedRecipes = await Promise.all(
              searchResults.map(async (recipe) => {
                const response = await fetch(`http://localhost:5000/api/recipes/${recipe.recipe_id}/ingredients`);
                const ingredients = await response.json();
                return { ...recipe, ingredients };
              })
            );
            setRecipes(detailedRecipes);
          }
          setLoading(false);
        } catch (err) {
          setError('Failed to load recipe details');
          setLoading(false);
        }
      };
  
      fetchRecipeDetails();
    }, []);

    return (
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
                <p className="calories">Calories: {recipe.total_calories} kcal</p>
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
                    {recipe.ingredients.map(ingredient => (
                      <tr key={ingredient.ingredient_id}>
                        <td>{ingredient.ingredient_name}</td>
                        <td>{ingredient.quantity}</td>
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
  );
}

export default Results;
