import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

const RecipeDetails = () => {
    const { id } = useParams();
    const[recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecipeDetails = async () => {
            try {
                const response = await axios.get(
                    `https://api.spoonacular.com/recipes/{id}/analyzedInstructions`
                );
                setRecipe(response.data[0]);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching recipe instructions', error);
                setLoading(false);
            }
        };

        fetchRecipeDetails();
    }, [id]);

    return (
        <div>
            <Navbar />
            <div className="container mt-4">
                {loading ? (
                    <p className="text-center">Loading...</p>
                ) : recipe ? (
                    <div>
                        <h2 className="text-center">Recipe Instructions</h2>
                        <ol>
                            {recipe.steps.map((step) => (
                                <li key={step.number} className="mb-3">
                                    {step.step}
                                </li>
                            ))}
                        </ol>
                    </div>
                ) : (
                    <p className="text-center">No recipe details available.</p>
                )}
            </div>
        </div>
    );
};

export default RecipeDetails;