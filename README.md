//1. Weather
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../components/styles.css";

const Users = () => {

    const [temp, setTemp] = useState(null);

    useEffect(() => {
        const city = "ooty";

        // Step 1: City → Lat/Lon
        axios.get(
            "https://geocoding-api.open-meteo.com/v1/search",
            { params: { name: city, count: 1 } }
        )
            .then(res => {
                const { latitude, longitude } = res.data.results[0];

                // Step 2: Weather
                return axios.get(
                    "https://api.open-meteo.com/v1/forecast",
                    {
                        params: {
                            latitude,
                            longitude,
                            current_weather: true
                        }
                    }
                );
            })
            .then(res => {
                setTemp(res.data.current_weather.temperature);
            })
            .catch(err => console.error(err));

    }, []);

    return (
        <div>
            <div className="head">
                <Link to="/">Main Page</Link>
                <Link to="/Users">Users Page</Link>
                <br />
                <h3>Welcome to API access via Axios - Users Page!</h3>
            </div>

            <br />

            <h1>Temperature is {temp} °C</h1>
        </div>
    );
};

export default Users;



//2.Food Receipe
import React, { useEffect, useState } from "react";
import axios from "axios";

const Recipes = () => {

  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const food = "chicken";

    axios.get(
      "https://www.themealdb.com/api/json/v1/1/search.php",
      {
        params: { s: food }
      }
    )
    .then(res => {
      setRecipe(res.data.meals[0]);
    })
    .catch(err => console.error(err));

  }, []);

  return (
    <div>
      <h1>Recipe Search</h1>

      {recipe && (
        <>
          <h2>{recipe.strMeal}</h2>
          <img src={recipe.strMealThumb} width="300" />
          <p><b>Category:</b> {recipe.strCategory}</p>
          <p><b>Area:</b> {recipe.strArea}</p>
          <p><b>Instructions:</b> {recipe.strInstructions}</p>
        </>
      )}
    </div>
  );
};

export default Recipes;


1) Location-Wise Water Resources
2) Educational Institutions by Region
3) Population by Gender (Location-Based)
4) Age-Wise Population by Area
5) Accident Statistics by Location
