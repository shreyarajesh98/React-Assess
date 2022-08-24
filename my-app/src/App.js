import Login from './Login';
import Register from './Register'
import Dashboard from './Dashboard'
import {
  Routes,
  Route,
} from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  )
}
export default App