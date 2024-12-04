import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [filterCalories, setFilterCalories] = useState(null);
    const [filterIngredient, setFilterIngredient] = useState('');
    const [filterAllergen, setfilterAllergen] = useState('');
    const [loading, setloading] = useState(true);

    //Get my favorites
    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await axios.get('...');//link to database
                setFavorites(response.data);
                setloading(false);
            } catch (error) {
                console.error('Error in fetching favorites', error);
                setloading(false);
            }
        };
        fetchFavorites();
    }, []);

    //Delete my favorites
    const handleRemove = async (id) => {
        try {
            await axios.delete(`...${id}`);//link to database
            setFavorites(favorites.filter((item) => item.id !== id));
        } catch (error) {
            console.error('Error in removing favorites', error);
        }
    };

    //Filtered data
    const filteredFavorites = favorites.filter((item) => {
        const matchesCalories = 
            filterCalories === null || item.calories <= filterCalories;
        const matchesIngredient = 
            !filterIngredient || item.ingredients.toLowerCase().includes(filterIngredient.toLowerCase());
        const matchesAllergen =
            !filterAllergen || !item.ingredients.toLowerCase().includes(filterAllergen.toLowerCase());
        return matchesCalories && matchesIngredient && matchesAllergen;
    });

    return (
        <div>
            <Navbar />
            <div className='container mt-4'>
                <h2 className='text-center'>My Favorites</h2>
                {/*filter*/}
                <div className='d-flex justify-content-between align-items-center mb-3'>
                    <label htmlFor='caloriesFilter' className='form-label'>
                        Filter by Calories:
                    </label>
                    <select
                        id='calorieFilter'
                        className='form-select w-25'
                        onChange={(e) => setFilterCalories(e.target.value ? parseInt(e.target.value) : null)}
                    >
                        <option value="">All</option>
                        <option value="300">Up to 300</option>
                        <option value="400">Up to 400</option>
                        <option value="500">Up to 500</option>
                        <option value="600">Up to 600</option>
                    </select>
                </div>
                <div className='mb-3'>
                    <label htmlFor='ingredientFilter' className='form-label'>Filter by Ingredients:</label>
                    <input
                        type='text'
                        id='ingredientFilter'
                        className='form-control w-50'
                        placeholder='Enter an ingredient(e.g. Chicken)'
                        onChange={(e) => setFilterIngredient(e.target.value)}
                    />
                </div>
                <div className='mb-3'>
                    <label htmlFor='allergenFilter' className='form-label'>Exclude Allergens:</label>
                    <input
                        type='text'
                        id='allergenFilter'
                        className='form-control w-50'
                        placeholder='Enter an allergen ingredient(e.g. Nuts)'
                        onChange={(e) => setfilterAllergen(e.target.value)}
                    />
                </div>

                {/*the list*/}
                {loading ? (
                    <p className='text-center'>Loading...</p>
                ) : (
                    <ul className='list-group'>
                        {filteredFavorites.length > 0 ? (
                            filteredFavorites.map((item) => (
                                <li key={item.id} className='list-rgoup-item d-flex justify-content-between align-items-center'>
                                    <div>
                                        <Link to ={`/recipe/${item.id}`} className='text-decoration-none text-dark'>
                                            <strong>{item.title}</strong>
                                        </Link>
                                        <p className='mb-0'>
                                            Ingredients: {item.ingredients} | Calories: {item.calories}
                                        </p>
                                    </div>
                                    <button className='btn btn-sm btn-info' onClick={() => handleRemove(item.id)}>
                                        <i className='bi bi-trash fs-3'></i>
                                    </button>
                                </li>
                            ))
                        ) : (
                            <li className='list-group-item text-center'>
                                No recipes match the filter
                            </li>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Favorites;
