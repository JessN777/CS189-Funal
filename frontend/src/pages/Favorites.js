import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [filterCalories, setFilterCalories] = useState(null);
    const [filterIngredient, setFilterIngredient] = useState('');
    const [filterAllergen, setFilterAllergen] = useState('');
    const [loading, setLoading] = useState(true);

    // Fetch favorites from the database
    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/recipes');
                setFavorites(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error in fetching favorites:', error);
                setLoading(false);
            }
        };
        fetchFavorites();
    }, []);

    // Remove a recipe from favorites
    const handleRemove = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/recipes/${id}`);
            setFavorites(favorites.filter((item) => item.id !== id));
        } catch (error) {
            console.error('Error in removing favorites', error);
        }
    };

    // Filter favorites based on user input
    const filteredFavorites = favorites.filter((item) => {
        const matchesCalories =
            filterCalories === null || item.calories <= filterCalories;
        const matchesIngredient =
            !filterIngredient || item.ingredients.some((ingredient) =>
                ingredient.name.toLowerCase().includes(filterIngredient.toLowerCase())
            );
        const matchesAllergen =
            !filterAllergen || !item.ingredients.some((ingredient) =>
                ingredient.name.toLowerCase().includes(filterAllergen.toLowerCase())
            );
        return matchesCalories && matchesIngredient && matchesAllergen;
    });

    return (
        <div>
            <div className='container mt-4'>
                <h2 className='text-center'>My Favorites</h2>
                {/* Filters */}
                <div className='d-flex justify-content-between align-items-center mb-3'>
                    <label htmlFor='caloriesFilter' className='form-label'>
                        Filter by Calories:
                    </label>
                    <select
                        id='calorieFilter'
                        className='form-select w-25'
                        onChange={(e) =>
                            setFilterCalories(e.target.value ? parseInt(e.target.value) : null)
                        }
                    >
                        <option value=''>All</option>
                        <option value='300'>Up to 300</option>
                        <option value='400'>Up to 400</option>
                        <option value='500'>Up to 500</option>
                        <option value='600'>Up to 600</option>
                    </select>
                </div>
                <div className='mb-3'>
                    <label htmlFor='ingredientFilter' className='form-label'>Filter by Ingredients:</label>
                    <input
                        type='text'
                        id='ingredientFilter'
                        className='form-control w-50'
                        placeholder='Enter an ingredient (e.g. Chicken)'
                        onChange={(e) => setFilterIngredient(e.target.value)}
                    />
                </div>
                <div className='mb-3'>
                    <label htmlFor='allergenFilter' className='form-label'>Exclude Allergens:</label>
                    <input
                        type='text'
                        id='allergenFilter'
                        className='form-control w-50'
                        placeholder='Enter an allergen ingredient (e.g. Nuts)'
                        onChange={(e) => setFilterAllergen(e.target.value)}
                    />
                </div>

                {/* Recipe Cards */}
                {loading ? (
                    <p className='text-center'>Loading...</p>
                ) : (
                    <div className='row'>
                        {filteredFavorites.length > 0 ? (
                            filteredFavorites.map((item) => (
                                <div key={item.id} className='col-md-4 mb-4'>
                                    <div className='card border-0 shadow-sm h-100'>
                                        <Link to={`/recipe/${item.id}`} className='text-decoration-none'>
                                            <img
                                                src={item.image || 'default-image-url.jpg'} // Ensure an image exists
                                                className='card-img-top rounded-top'
                                                alt={item.name}
                                                style={{ maxHeight: '200px', objectFit: 'cover' }}
                                            />
                                        </Link>
                                        <div className='card-body'>
                                            <h5 className='card-title text-dark fw-bold'>
                                                <Link to={`/recipe/${item.id}`} className='text-decoration-none text-dark'>
                                                    {item.name}
                                                </Link>
                                            </h5>
                                            <p className='card-text text-secondary'>
                                                Ingredients: {item.ingredients.map((ingredient, index) => (
                                                    <span key={index}>
                                                        {ingredient.name} ({ingredient.quantity || 'N/A'})
                                                        {index < item.ingredients.length - 1 ? ', ' : ''}
                                                    </span>
                                                ))}
                                            </p>
                                            <p className='card-text text-secondary'>Calories: {item.calories}</p>
                                            <button
                                                className='btn btn-outline-danger btn-sm mt-2'
                                                onClick={() => handleRemove(item.id)}
                                            >
                                                Remove from Favorites
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className='text-center'>No recipes match the filter</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Favorites;
