import { Link } from "react-router-dom"
import "../components/styles.css"

function Master() {
    return (
        <>
            <div className="head">
                <Link to="/" >Main</Link>
                <Link to="/temperature" >Weather Page</Link>
                
                <br></br>
                <h3>Welcome to API access via axias!!!!</h3>
            </div>
        </>
    )
}

export default Master