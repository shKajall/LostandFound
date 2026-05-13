import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.jpeg";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!fullName || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const username = fullName; // using fullName as username

      const res = await fetch("http://lostandfound-1-eyvw.onrender.com/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          username,
          password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Signup failed");
        setLoading(false);
        return;
      }

      setSuccess("Signup successful! Redirecting to login...");

      // clear fields
      setFullName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      setLoading(false);

      // redirect after 1.5 sec
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      console.error(err);
      setError("Server error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#030f27ff" }}
    >
      {/* Card */}
      <div className="relative max-w-md w-full rounded-2xl p-[2px] 
                      bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 shadow-xl">

        <div className="bg-white rounded-2xl p-8">

          {/* Logo */}
          <img
            src={Logo}
            alt="Lost N Found Logo"
            className="mx-auto mb-6 w-24 h-24 rounded-3xl object-contain"
          />

          {/* Title */}
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-1">
            Create an Account
          </h2>

          <p className="text-sm text-center text-gray-600 mb-6">
            Join us and explore amazing features
          </p>

          {/* Error / Success */}
          {error && (
            <p className="mb-4 text-sm text-red-600 text-center">{error}</p>
          )}

          {success && (
            <p className="mb-4 text-sm text-green-600 text-center">{success}</p>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg 
                           bg-white text-black focus:outline-none 
                           focus:ring-2 focus:ring-purple-500"
              />
            </div>

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
                           focus:ring-2 focus:ring-purple-500"
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
                           focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg 
                           bg-white text-black focus:outline-none 
                           focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 mt-4 text-white rounded-lg 
                         bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 
                         hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}