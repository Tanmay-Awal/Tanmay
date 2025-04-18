import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import Register from "./Register";
import Login from "./Login";
import Home from "./Home";
import TasksPage from "./TasksPage";
import ProfilePage from "./ProfilePage";
import AddTaskPage from "./AddTaskPage";
import AboutPage from "./AboutPage";



import "./App.css";

function App() {
  return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/TasksPage" element={<TasksPage />} />
        <Route path="/AddTaskPage" element={<AddTaskPage />} />
        <Route path="/ProfilePage" element={<ProfilePage />} />
        <Route path="/AboutPage" element={<AboutPage />} />






      </Routes>
  );
}

export default App;
