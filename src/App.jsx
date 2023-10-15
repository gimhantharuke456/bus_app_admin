import "antd/dist/reset.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginForm from "./views/Login";
import Dashboard from "./views/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<LoginForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
