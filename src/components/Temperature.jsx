import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Temperature = () => {
  const [tempCity, setTempCity] = useState("");
  const [city, setCity] = useState("");
  const [food, setFood] = useState("");

  const [temperature, setTemperature] = useState(null);
  const [population, setPopulation] = useState(null);
  const [malePop, setMalePop] = useState(null);
  const [femalePop, setFemalePop] = useState(null);
  const [recipes, setRecipes] = useState([]); // Array for multiple recipes

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Get temperature
  const getTemperature = async () => {
    if (!tempCity.trim()) return;
    try {
      const geoRes = await axios.get(
        "https://geocoding-api.open-meteo.com/v1/search",
        { params: { name: tempCity, count: 1 } }
      );
      if (!geoRes.data.results) throw new Error();
      const { latitude, longitude } = geoRes.data.results[0];
      const weatherRes = await axios.get(
        "https://api.open-meteo.com/v1/forecast",
        { params: { latitude, longitude, current_weather: true } }
      );
      setTemperature(weatherRes.data.current_weather.temperature);
    } catch {
      alert("Temperature not found");
    }
  };

  // Get population
  const getCityData = async () => {
    if (!city.trim()) return;

    setLoading(true);
    setError("");
    setPopulation(null);
    setMalePop(null);
    setFemalePop(null);

    try {
      const geoRes = await axios.get(
        "https://geocoding-api.open-meteo.com/v1/search",
        { params: { name: city, count: 1 } }
      );
      if (!geoRes.data.results) throw new Error();
      const { population } = geoRes.data.results[0];
      setPopulation(population || "Not Available");
      if (population) {
        setMalePop(Math.round(population * 0.52));
        setFemalePop(Math.round(population * 0.48));
      }
    } catch {
      setError("City data not found");
    } finally {
      setLoading(false);
    }
  };

  // Get recipes
  const getRecipes = async () => {
    if (!food.trim()) return;
    try {
      const res = await axios.get(
        "https://www.themealdb.com/api/json/v1/1/search.php",
        { params: { s: food } }
      );
      setRecipes(res.data.meals || []); // Store all matching recipes
    } catch {
      alert("Recipe not found");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <Link to="/" style={styles.link}>Main</Link>
        <h2 style={styles.headerTitle}>City Info & Temperature</h2>
        <Link to="/temperature" style={styles.link}>Weather</Link>
      </div>

      <div style={styles.card}>
        {/* Temperature */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>🌡 Temperature</h3>
          <input
            placeholder="Enter city for temperature"
            value={tempCity}
            onChange={(e) => setTempCity(e.target.value)}
            style={styles.input}
          />
          <button onClick={getTemperature} style={styles.button}>
            Get Temperature
          </button>
          {temperature !== null && (
            <div style={styles.resultBox}>{temperature} °C</div>
          )}
        </div>

        {/* Population */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>👥 Population</h3>
          <input
            placeholder="Enter city for population"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={styles.input}
          />
          <button onClick={getCityData} style={styles.button}>
            {loading ? "Loading..." : "Get Population"}
          </button>
          {error && <p style={styles.error}>{error}</p>}
          {population && (
            <div style={styles.resultBox}>
              <p>Total: {population}</p>
              <p>Male: {malePop}</p>
              <p>Female: {femalePop}</p>
            </div>
          )}
        </div>

        {/* Recipes */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>🍽 Recipes</h3>
          <input
            placeholder="Enter food name"
            value={food}
            onChange={(e) => setFood(e.target.value)}
            style={styles.input}
          />
          <button onClick={getRecipes} style={styles.button}>
            Find Recipes
          </button>

          {recipes.length > 0 ? (
            recipes.map((recipe, index) => (
              <div key={index} style={styles.resultBox}>
                <h4>{recipe.strMeal}</h4>
                <p>{recipe.strInstructions}</p>
                {recipe.strMealThumb && (
                  <img
                    src={recipe.strMealThumb}
                    alt={recipe.strMeal}
                    style={{ width: "100%", marginTop: "10px", borderRadius: "6px" }}
                  />
                )}
              </div>
            ))
          ) : (
            food && <p style={styles.error}>No recipes found</p>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f0f4ff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontFamily: "Arial",
    padding: "20px",
  },
  header: {
    width: "100%",
    padding: "15px",
    backgroundColor: "#1f2933",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#fff",
    borderRadius: "6px",
  },
  headerTitle: { color: "#4ade80" },
  link: { color: "#38bdf8", textDecoration: "none", fontWeight: "bold" },
  card: {
    marginTop: "20px",
    width: "400px",
    background: "#fff",
    padding: "25px",
    borderRadius: "14px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
  },
  section: { marginBottom: "20px" },
  sectionTitle: {
    marginBottom: "10px",
    color: "#2563eb",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginBottom: "10px",
  },
  resultBox: {
    marginTop: "10px",
    padding: "10px",
    background: "#f0f9ff",
    borderRadius: "6px",
    textAlign: "center",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
  error: {
    color: "red",
    fontWeight: "bold",
    textAlign: "center",
  },
};

export default Temperature;
