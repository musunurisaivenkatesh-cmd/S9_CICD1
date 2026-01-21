import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../components/styles.css";

const Users = () => {

   
    return (
        <div>
            <div className="head">
                <Link to="/">Main Page</Link>
                <Link to="/temperature">Weather Page</Link>
                <br />
                <h3>Welcome to API access via Axios - Weather Page!</h3>
            </div>

            <br />

            <h1>haha hihi huhu</h1>
        </div>
    );
};

export default Users;
