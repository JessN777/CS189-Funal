import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import DOMPurify from 'dompurify';

const RecipeDetails = () => {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecipeDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/recipes/recipe-details/${id}`);
                console.log("API Response:", response.data); // Log the API response
                setRecipe(response.data); // Set the recipe data directly
                setLoading(false);
            } catch (error) {
                console.error('Error fetching recipe instructions:', error);
                setLoading(false);
            }
        };

        fetchRecipeDetails();
    }, [id]);

    return (
        <div>
            <div className="container mt-4">
                {loading ? (
                    <p className="text-center">Loading...</p>
                ) : recipe ? (
                    <div>
                        <h2 className="text-center">{recipe.title}</h2>
                        <img
                            src={recipe.image}
                            alt={recipe.title}
                            className="img-fluid my-3"
                        />
                        <h3>Ingredients</h3>
                        <ul>
                            {recipe.extendedIngredients.map((ingredient) => (
                                <li key={ingredient.id}>
                                    {ingredient.original}
                                </li>
                            ))}
                        </ul>
                        <h3>Instructions</h3>
                        {recipe.instructions ? (
                            <div
                                className="instructions"
                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(recipe.instructions) }}
                            ></div>
                        ) : (
                            <p>No instructions available.</p>
                        )}
                    </div>
                ) : (
                    <p className="text-center">No recipe details available.</p>
                )}
            </div>
        </div>
    );
};

export default RecipeDetails;
