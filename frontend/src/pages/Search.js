import React, { useState, useEffect } from 'react';
import './src/index.css';
import backgroundImage from './src/ingredient.jpg';
import { Navigate, useNavigate } from 'react-router-dom';


function Search() {
  const [foodPreference, setFoodPreference] = useState('');
  const [foodIntolerance, setFoodIntolerance] = useState('');
  const [calories, setCalories] = useState('Any');

  const Navigate = useNavigate();

  const handleSearch = async() => {
    if (!foodPreference) {
      alert('Please enter a food preference');
      return;
    }
    
    // Convert calories range to numbers for database query
    try {
      let caloriesRange = null;
      if (calories !== 'Any') {
        const [min, max] = calories.split(' - ').map(num => parseInt(num));
        caloriesRange = { min, max };
      }

      const queryParams = new URLSearchParams({
        preference: foodPreference,
        intolerance: foodIntolerance || '',
        minCalories: caloriesRange?.min || '',
        maxCalories: caloriesRange?.max || ''
      });

      const response = await fetch(`http://localhost:5000/api/recipes/search?${queryParams}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch recipes');
      }

      localStorage.setItem('searchPreferences', JSON.stringify({
        foodPreference,
        foodIntolerance,
        calories
      }));
      localStorage.setItem('searchResults', JSON.stringify(data));
      
      Navigate('/Results');
    } catch (error) {
      console.error('Error fetching recipes:', error);
      alert('Failed to fetch recipes: ' + error.message);
    }
  };

  return (
    <div className="background" style={{backgroundImage: `url(${backgroundImage})`}}>
      <section id="intro">
        <div className="jumbotron vertical-center">
          <div className="container">
            <div className='row'>
              <div className="col-md-12">
                <div className="content">
                  <h1>Recipe Recommendation</h1>
                  <p>What Would You Like to Have Today?</p>
                  <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">Food Preference</span>
                    <input type="text" name="food-preference" className="form-control" placeholder="Ingredient" aria-label="Ingredient" aria-describedby="basic-addon1" value={foodPreference} onChange={(e) => setFoodPreference(e.target.value)} />
                  </div>
                  <br />
                  <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon2">Food Intolerance</span>
                    <input type="text" name="food-intolerance" className="form-control" placeholder="Ingredient" aria-label="Ingredient" aria-describedby="basic-addon2" value={foodIntolerance} onChange={(e) => setFoodIntolerance(e.target.value)} />
                  </div>
                  <br />
                  <div className="input-group mb-3">
                    <label className="input-group-text" htmlFor="inputGroupSelect01">Calories</label>
                    <select className="form-select" name="calories" id="inputGroupSelect01" value={calories} onChange={(e) => setCalories(e.target.value)}>
                      <option value="Any">Any</option>
                      <option value="0 - 200">0 - 200</option>
                      <option value="201 - 400">201 - 400</option>
                      <option value="401 - 600">401 - 600</option>
                      <option value="601 - 800">601 - 800</option>
                      <option value="801 - 1,000">801 - 1,000</option>
                    </select>
                  </div>
                  <br />
                  <div className="container">
                    <button id="search-button" type="button" className="btn-search" onClick={handleSearch}>Search</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Search;
