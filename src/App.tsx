// src/App.tsx
import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import Register from "./pages/Register"

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
