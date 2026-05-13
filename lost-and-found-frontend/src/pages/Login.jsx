import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.jpeg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5001/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      // Save JWT token
      localStorage.setItem("token", data.token);

      // Save user info
      localStorage.setItem("lostUser", JSON.stringify(data.user));

      setLoading(false);

      // Redirect to dashboard
      navigate("/dashboard");

    } catch (err) {
      console.error(err);
      setError("Server error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      
      {/* Background */}
      <div className="absolute inset-0 z-0" style={{ background: "#030f27ff" }}></div>

      {/* Card */}
      <div className="relative max-w-md w-full rounded-2xl p-[2px] 
                      bg-gradient-to-r from-pink-500 via-red-500 via-yellow-400 to-pink-400 shadow-xl z-10">

        <div className="bg-white rounded-2xl p-8">

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img
              src={Logo}
              alt="Logo"
              className="w-24 h-24 rounded-3xl object-contain"
            />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-1">
            Login to Your Account
          </h2>

          <p className="text-sm text-center text-gray-600 mb-6">
            Welcome back! Please login to continue
          </p>

          {/* Error */}
          {error && (
            <p className="mb-4 text-sm text-red-600 text-center">
              {error}
            </p>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg 
                           bg-white text-black focus:outline-none 
                           focus:ring-2 focus:ring-pink-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg 
                           bg-white text-black focus:outline-none 
                           focus:ring-2 focus:ring-pink-500"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 mt-4 text-white rounded-lg 
                         bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 
                         hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}