import { Link } from "react-router-dom";
import LostImage from "../assets/Lost.jpeg";
import FoundImage from "../assets/found.jpeg";
import SignupImage from "../assets/signup.jpg";
import PostImage from "../assets/post.webp";
import MatchImage from "../assets/match.jpeg";
import Logo from "../assets/logo.jpeg";

export default function LandingPage() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#030f27ff" }}
    >
      {/* Navbar */}
    <header className="w-full sticky top-0 z-50">
  <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
      {/* Logo + Site Name */}
    <div className="flex items-center space-x-3">
      <img
        src={Logo} // import Logo at the top
        alt="Lost N Found Logo"
        className="w-10 h-10 object-contain rounded-2xl " // no bg-white here
      />
      <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 tracking-wide">
        Lost N Found
      </h1>
    </div>

    <div className="space-x-4">
      <Link
        to="/signup"
        className="px-4 py-2 text-white rounded-xl bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 hover:opacity-90 transition no-underline"
      >
        Sign Up
      </Link>

      <Link
        to="/login"
        className="px-4 py-2 text-white rounded-xl bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 hover:opacity-90 transition no-underline"
      >
        Login
      </Link>
    </div>
  </nav>
</header>

      {/* Hero Section */}
      <main className="px-4 py-12 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
          {/* Lost Section */}
          <div className="text-center bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
            <img
              src={LostImage}
              alt="Lost Something"
              className="mx-auto mb-4 w-40 h-40 object-cover rounded-xl shadow"
            />
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Lost Something?
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed text-sm">
              Post details of what you lost and let others help you find it.
            </p>
            <Link
              to="/signup"
              className="px-4 py-2 text-white rounded-xl bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 hover:opacity-90 transition no-underline text-sm"
            >
              Report Lost Item
            </Link>
          </div>

          {/* Found Section */}
          <div className="text-center bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
            <img
              src={FoundImage}
              alt="Found Something"
              className="mx-auto mb-4 w-40 h-40 object-cover rounded-xl shadow"
            />
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Found Something?
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed text-sm">
              Share what you found so the owner can reclaim it easily.
            </p>
            <Link
              to="/login"
              className="px-4 py-2 text-white rounded-xl bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 hover:opacity-90 transition no-underline text-sm"
            >
              Report Found Item
            </Link>
          </div>
        </div>
      </main>

    <section className="py-12" style={{ backgroundColor: "#030f27ff" }}>
  <div className="max-w-5xl mx-auto px-4 text-center">
    <h2 className="text-2xl font-extrabold text-white mb-8">
      How It Works
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Step 1 */}
      <div className="bg-gray-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition border-2 border-transparent hover:border-gradient-to-r hover:from-pink-500 hover:via-red-500 hover:to-yellow-400">
        <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 rounded-full flex items-center justify-center">
          <img src={SignupImage} alt="Sign Up" className="w-10 h-10 object-cover rounded-full" />
        </div>
        <h3 className="text-lg font-semibold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400">
          1. Sign Up
        </h3>
        <p className="text-gray-600 text-sm">
          Create your free account to start posting items.
        </p>
      </div>

      {/* Step 2 */}
      <div className="bg-gray-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition border-2 border-transparent hover:border-gradient-to-r hover:from-pink-500 hover:via-red-500 hover:to-yellow-400">
        <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 rounded-full flex items-center justify-center">
          <img src={PostImage} alt="Post Item" className="w-10 h-10 object-cover rounded-full" />
        </div>
        <h3 className="text-lg font-semibold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400">
          2. Post an Item
        </h3>
        <p className="text-gray-600 text-sm">
          Add item details to help others identify it.
        </p>
      </div>

      {/* Step 3 */}
      <div className="bg-gray-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition border-2 border-transparent hover:border-gradient-to-r hover:from-pink-500 hover:via-red-500 hover:to-yellow-400">
        <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 rounded-full flex items-center justify-center">
          <img src={MatchImage} alt="Get Matched" className="w-10 h-10 object-cover rounded-full" />
        </div>
        <h3 className="text-lg font-semibold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400">
          3. Get Matched
        </h3>
        <p className="text-gray-600 text-sm">
          Connect with people and return lost belongings.
        </p>
      </div>
    </div>
  </div>
</section>
    </div>
  );
}
