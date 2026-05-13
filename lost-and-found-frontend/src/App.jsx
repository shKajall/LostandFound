import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PostItem from "./pages/PostItem";
import Feed from "./pages/Feed";
import Responses from "./pages/Responses";
import MyListings from "./pages/MyListings";
import EditItem from "./pages/EditItem"; // adjust path according to your folder structure

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-100">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/post-item" element={<PostItem />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/responses" element={<Responses all={true} />} />       {/* global */}
          <Route path="/responses/:itemId" element={<Responses all={false} />} />
          <Route path="/mylistings" element={<MyListings />} />
          <Route path="/edit-item/:id" element={<EditItem />} />  
        </Routes>
      </div>
    </Router>
  );
}

export default App;
