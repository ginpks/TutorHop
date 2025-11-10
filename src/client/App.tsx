import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/landing";
import Results from "./pages/results";
import Survey from "./pages/survey";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Profile from "./pages/profile";
import StudentProfile from "./pages/studentprofile";
import { Box } from "@mui/material";
import DefaultBanner from "./components/main_banner/banner";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/results" element={<Results />} />
        <Route path="/survey" element={<Survey />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/studentprofile" element={<StudentProfile />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
