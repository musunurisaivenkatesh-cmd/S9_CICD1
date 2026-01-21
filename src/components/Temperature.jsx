import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Temperature = () => {
    const [city, setCity] = useState("");
    const [food, setFood] = useState("");

    const [temp, setTemp] = useState(null);
    const [population, setPopulation] = useState(null);
    const [malePop, setMalePop] = useState(null);
    const [femalePop, setFemalePop] = useState(null);

    const [institutions, setInstitutions] = useState([]);
    const [waterResources, setWaterResources] = useState([]);
    const [recipe, setRecipe] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // 🎓 Educational institutions
    const getInstitutions = async (lat, lon) => {
        const query = `
        [out:json];
        (
          node["amenity"="school"](around:10000,${lat},${lon});
          node["amenity"="college"](around:10000,${lat},${lon});
          node["amenity"="university"](around:10000,${lat},${lon});
        );
        out body;
        `;
        const res = await axios.post(
            "https://overpass-api.de/api/interpreter",
            query,
            { headers: { "Content-Type": "text/plain" } }
        );
        setInstitutions(res.data.elements.slice(0, 5));
    };

    // 💧 Water resources
    const getWaterResources = async (lat, lon) => {
        const query = `
        [out:json];
        (
          node["natural"="water"](around:15000,${lat},${lon});
          node["waterway"](around:15000,${lat},${lon});
          node["amenity"="drinking_water"](around:15000,${lat},${lon});
        );
        out body;
        `;
        const res = await axios.post(
            "https://overpass-api.de/api/interpreter",
            query,
            { headers: { "Content-Type": "text/plain" } }
        );
        setWaterResources(res.data.elements.slice(0, 5));
    };

    // 🍽️ Food recipe
    const getRecipe = async () => {
        if (!food.trim()) return;
        const res = await axios.get(
            "https://www.themealdb.com/api/json/v1/1/search.php",
            { params: { s: food } }
        );
        setRecipe(res.data.meals ? res.data.meals[0] : null);
    };

    const getCityData = async () => {
        if (!city.trim()) return;

        setLoading(true);
        setError("");
        setTemp(null);
        setPopulation(null);
        setMalePop(null);
        setFemalePop(null);
        setInstitutions([]);
        setWaterResources([]);

        try {
            const geoRes = await axios.get(
                "https://geocoding-api.open-meteo.com/v1/search",
                { params: { name: city, count: 1 } }
            );

            if (!geoRes.data.results) throw new Error();

            const { latitude, longitude, population } =
                geoRes.data.results[0];

            setPopulation(population || "Not Available");

            if (population) {
                setMalePop(Math.round(population * 0.52));
                setFemalePop(Math.round(population * 0.48));
            }

            const weatherRes = await axios.get(
                "https://api.open-meteo.com/v1/forecast",
                { params: { latitude, longitude, current_weather: true } }
            );

            setTemp(weatherRes.data.current_weather.temperature);

            await getInstitutions(latitude, longitude);
            await getWaterResources(latitude, longitude);

        } catch {
            setError("❌ Data not found");
        } finally {
            setLoading(false);
        }
    };

    const getTempColor = () => {
        if (temp < 20) return "#007bff";
        if (temp <= 30) return "#ff9800";
        return "#e53935";
    };

    return (
        <div style={styles.page}>
            {/* HEADER */}
            <div style={styles.header}>
                <Link to="/" style={styles.link}>Main</Link>
                <h2 style={styles.headerTitle}>City Information System</h2>
                <Link to="/temperature" style={styles.link}>Weather</Link>
            </div>

            {/* CARD */}
            <div style={styles.card}>
                <input
                    placeholder="Enter city name"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    style={styles.input}
                />

                <button onClick={getCityData} style={styles.button}>
                    {loading ? "Loading..." : "Get City Details"}
                </button>

                {error && <p style={styles.error}>{error}</p>}

                {/* WEATHER */}
                {temp !== null && (
                    <h1 style={{ ...styles.temp, color: getTempColor() }}>
                        {temp} °C
                    </h1>
                )}

                {/* POPULATION */}
                {population && (
                    <div style={styles.section}>
                        <h4>👥 Population</h4>
                        <p>Total: {population.toLocaleString?.() || population}</p>
                        <p>👨 Male: {malePop?.toLocaleString()}</p>
                        <p>👩 Female: {femalePop?.toLocaleString()}</p>
                    </div>
                )}

                {/* EDUCATION */}
                {institutions.length > 0 && (
                    <div style={styles.section}>
                        <h4>🎓 Educational Institutions</h4>
                        <ul style={styles.list}>
                            {institutions.map((i, idx) => (
                                <li key={idx}>{i.tags?.name || "Unnamed Institution"}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* WATER */}
                {waterResources.length > 0 && (
                    <div style={styles.section}>
                        <h4>💧 Water Resources</h4>
                        <ul style={styles.list}>
                            {waterResources.map((w, idx) => (
                                <li key={idx}>{w.tags?.name || "Water Body"}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* FOOD */}
                <div style={styles.section}>
                    <input
                        placeholder="Enter food name (e.g. Biryani)"
                        value={food}
                        onChange={(e) => setFood(e.target.value)}
                        style={styles.input}
                    />
                    <button onClick={getRecipe} style={styles.button}>
                        Find Recipe
                    </button>

                    {recipe && (
                        <>
                            <h4>🍽️ {recipe.strMeal}</h4>
                            <p style={styles.recipeText}>
                                {recipe.strInstructions.substring(0, 300)}...
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    page: {
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e0f7fa, #e8eaf6)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
        borderRadius:"10px",
    },
    header: {
        width: "100%",
        padding: "15px 25px",
        backgroundColor: "#1f2933",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        color: "#fff",
        borderRadius:"10px",
    },
    headerTitle: {
        margin: 0,
        fontSize: "20px",
        color: "#4ade80",
        borderRadius:"10px",
    },
    link: {
        color: "#38bdf8",
        textDecoration: "none",
        fontWeight: "bold",
        borderRadius:"10px",
    },
    card: {
        marginTop: "30px",
        width: "380px",
        background: "#fff",
        padding: "25px",
        borderRadius: "14px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
        borderRadius:"10px",
    },
    input: {
        width: "100%",
        padding: "10px",
        marginBottom: "10px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        fontSize: "14px",
        borderRadius:"10px",
    },
    button: {
        width: "100%",
        padding: "10px",
        backgroundColor: "#2563eb",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        fontSize: "15px",
        cursor: "pointer",
        marginBottom: "10px",
        borderRadius:"10px",
    },
    temp: {
        textAlign: "center",
        fontSize: "32px",
        margin: "10px 0",
        borderRadius:"10px",
    },
    section: {
        marginTop: "15px",
        paddingTop: "10px",
        borderTop: "1px solid #e5e7eb",
        fontSize: "14px",
        borderRadius:"10px",
    },
    list: {
        paddingLeft: "18px",
        marginTop: "5px",
        borderRadius:"10px",
    },
    recipeText: {
        fontSize: "13px",
        lineHeight: "1.4",
        borderRadius:"10px",
    },
    error: {
        color: "red",
        fontWeight: "bold",
        textAlign: "center",
        borderRadius:"10px",
    },
};

export default Temperature;
