import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Notification from '../components/Notification';

function DailyRecommendations() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [expandedRecipe, setExpandedRecipe] = useState(null);

    useEffect(() => {
        fetchDailyRecipes();
    }, []);

    const fetchDailyRecipes = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/recipes/daily-recommendations');
            setRecipes(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching recipes:", err.message);
            setError("Failed to load daily recommendations. Please try again later.");
            setLoading(false);
        }
    };

    const addToFavorites = (recipe) => {
        const existingFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const updatedFavorites = [...existingFavorites, recipe];
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));

        // Add a success notification
        setNotifications((prevNotifications) => [
            ...prevNotifications,
            { id: Date.now(), message: `${recipe.title} has been added to your favorites!`, type: 'success' },
        ]);
    };

    const removeNotification = (id) => {
        setNotifications((prevNotifications) =>
            prevNotifications.filter((notification) => notification.id !== id)
        );
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger text-center" role="alert">
                {error}
            </div>
        );
    }

    return (
        <div className="container my-5">
            <h1 className="text-center mb-4 text-success fw-bold">
                Daily Recommendations
            </h1>
            <div className="row">
                {recipes.map((recipe) => (
                    <div key={recipe.id} className="col-md-4 mb-4">
                        <div className="card border-0 shadow-sm h-100">
                            <img
                                src={recipe.image}
                                className="card-img-top rounded-top"
                                alt={recipe.title}
                            />
                            <div className="card-body">
                                <h5 className="card-title text-dark fw-bold">{recipe.title}</h5>
                                {expandedRecipe === recipe.id ? (
                                    <p className="card-text text-secondary">
                                        {recipe.summary.replace(/<[^>]*>?/gm, "")}
                                    </p>
                                ) : (
                                    <p className="card-text text-secondary">
                                        {recipe.summary.replace(/<[^>]*>?/gm, "").substring(0, 150)}...
                                    </p>
                                )}
                                <button
                                    className="btn btn-outline-primary btn-sm mt-2"
                                    onClick={() =>
                                        setExpandedRecipe(expandedRecipe === recipe.id ? null : recipe.id)
                                    }
                                >
                                    {expandedRecipe === recipe.id ? "Show Less" : "Read More"}
                                </button>
                                <button
                                    className="btn btn-outline-warning btn-sm mt-2"
                                    onClick={() => addToFavorites(recipe)}
                                >
                                    Add to Favorites
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Render Notifications */}
            {notifications.map((notification) => (
                <Notification
                    key={notification.id}
                    message={notification.message}
                    type={notification.type}
                    onClose={() => removeNotification(notification.id)}
                />
            ))}
        </div>
    );
}

export default DailyRecommendations;
