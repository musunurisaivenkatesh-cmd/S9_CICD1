import { BrowserRouter, Route, Routes } from "react-router-dom"
import Master from "./components/Master"
import Temperature from "./components/Temperature"

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Master />} />
          <Route path="/temperature" element={<Temperature />} />         
        </Routes>
      </BrowserRouter>
    </>
  )
}
export default App