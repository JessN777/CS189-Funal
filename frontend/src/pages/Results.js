import React, { useEffect, useState } from 'react';
import './src/SearchAndResults.css';
import './src/index.css';


function Results() {
    const [preferences, setPreferences] = useState({
        foodPreference: '',
        foodIntolerance: '',
        calories: ''
    });

    const [recipes, setRecipes] = useState([]);
    const [favorites, setFavorites] = useState([]);


    useEffect(() => {
        const searchParams = JSON.parse(localStorage.getItem('searchPreferences'));
        const searchResults = JSON.parse(localStorage.getItem('searchResults'));
        const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];

        if (searchParams) {
            setPreferences(searchParams);
        }
        if (searchResults) {
            setRecipes(searchResults);
        }
        setFavorites(savedFavorites);
    }, []);
    
    const handleSaveToFavorites = (recipe) => {
        const updatedFavorites = [...favorites, recipe];
        setFavorites(updatedFavorites);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    };


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
                {recipes.map(recipe => (
                    <div key={recipe.recipe_id}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 className="recipe-title">{recipe.recipe_name}</h2>
                        <p className="calories">Calories: {recipe.calories_per_quantity} kcal</p>
                        <button 
                                className="btn-favorite" 
                                onClick={() => handleSaveToFavorites(recipe)}
                                style={{ marginLeft: '10px' }}
                            >
                                Save to Favorites
                            </button>
                        </div>
                        <div className="recipe-layout">
                            <img src="broccoli-cheese-eggs-mug.jpeg" alt="Broccoli-Cheese Eggs" className="rounded" />
                        </div>
                        <br />
                        <div className="ingredients-table">
                            <h2 className="ingredient-title">Ingredients</h2>
                            <table>
                                <tbody>
                                    <tr><td>Broccoli</td><td>1 cup</td></tr>
                                    <tr><td>Red Bell Pepper</td><td>1 Tablespoon</td></tr>
                                    <tr><td>Green Onion</td><td>1 sliced</td></tr>
                                    <tr><td>Eggs</td><td>2</td></tr>
                                    <tr><td>Fat-free Milk</td><td>2 Tablespoon</td></tr>
                                    <tr><td>White Cheddar Cheese</td><td>1/4 cup (1 oz)</td></tr>
                                    <tr><td>Salt, Black Pepper</td><td>To taste</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <br />
                        <div>
                            <h2 className="Tutorial-title">How to Make It</h2>
                            <p className="Tutorial"></p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Results;
