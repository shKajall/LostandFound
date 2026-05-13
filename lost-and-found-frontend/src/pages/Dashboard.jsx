import React from "react";
import Navbar from "../components/Navbar";
import { Link, Element } from "react-scroll";

export default function Dashboard({ username }) {
  return (
    <div className="min-h-screen w-screen flex flex-col relative overflow-hidden">
      {/* Navbar */}
      <div className="relative z-20">
        <Navbar />
      </div>

      {/* Blue Background */}
      <div className="absolute inset-0 z-0 bg-[#030f27ff]"></div>

      {/* Main Content */}
      <section className="flex-1 flex flex-col justify-start items-center px-4 relative z-10 text-white max-w-4xl mx-auto">
        {/* Welcome Section with top padding */}
        <div className="text-center mb-8 pt-10">
          <h1 className="text-3xl font-extrabold mb-2">
            Welcome, {username || "User"}!
          </h1>
          <p className="text-lg mb-2">
            Our Lost & Found platform is designed to help you easily find lost items
            or report items you have found. We aim to connect communities and ensure
            that lost belongings find their way back to their owners.
          </p>
          <p className="text-lg">
            Scroll down to explore the main features:{" "}
            <Link
              to="postItem"
              smooth={true}
              duration={500}
              className="underline hover:text-gray-300 cursor-pointer"
            >
              Post Item
            </Link>
            ,{" "}
            <Link
              to="feed"
              smooth={true}
              duration={500}
              className="underline hover:text-gray-300 cursor-pointer"
            >
              Feed
            </Link>
            ,{" "}
            <Link
              to="responses"
              smooth={true}
              duration={500}
              className="underline hover:text-gray-300 cursor-pointer"
            >
              Responses
            </Link>
            , and{" "}
            <Link
              to="myListing"
              smooth={true}
              duration={500}
              className="underline hover:text-gray-300 cursor-pointer"
            >
              My Listings
            </Link>
            .
          </p>
        </div>

        {/* Sections */}
        <Element name="postItem" className="mb-10 w-full">
          <h2 className="text-2xl font-bold mb-3">
            <Link
              to="postItem"
              smooth={true}
              duration={500}
              className="underline hover:text-gray-300 cursor-pointer"
            >
              Post Item
            </Link>
          </h2>
          <p className="mb-2 text-lg">
            The Post Item feature allows you to quickly report a lost or found item.
            You can upload images, add detailed descriptions, and specify the location
            where the item was lost or found. This ensures your post reaches the right audience.
          </p>
          <p className="mb-2 text-lg">
            Each post is timestamped, helping users understand the relevance and urgency
            of the item. Others can interact with your post to provide help or information.
          </p>
          <p className="text-lg">
            With this feature, we make it simple to get your item noticed by the community
            and improve the chances of it being returned.
          </p>
        </Element>

        <Element name="feed" className="mb-10 w-full">
          <h2 className="text-2xl font-bold mb-3">
            <Link
              to="feed"
              smooth={true}
              duration={500}
              className="underline hover:text-gray-300 cursor-pointer"
            >
              Feed
            </Link>
          </h2>
          <p className="mb-2 text-lg">
            The Feed feature displays all recent posts from users in your area.
            You can view lost or found items, check their details, and see images uploaded by others.
          </p>
          <p className="mb-2 text-lg">
            The feed updates in real-time, ensuring you don’t miss any new information or
            opportunities to help someone find their lost item.
          </p>
          <p className="text-lg">
            It’s a dynamic and interactive space where the community can stay informed and
            connected.
          </p>
        </Element>

        <Element name="responses" className="mb-10 w-full">
          <h2 className="text-2xl font-bold mb-3">
            <Link
              to="responses"
              smooth={true}
              duration={500}
              className="underline hover:text-gray-300 cursor-pointer"
            >
              Responses
            </Link>
          </h2>
          <p className="mb-2 text-lg">
            The Responses section allows users to interact with posts.
            If you have found an item or have information about a lost item, you can respond directly to the post.
          </p>
          <p className="mb-2 text-lg">
            This ensures effective communication between users and facilitates the return
            of lost items in a timely manner.
          </p>
          <p className="text-lg">
            Community engagement is at the core of this feature, helping users support each other efficiently.
          </p>
        </Element>

        <Element name="myListing" className="mb-10 w-full">
          <h2 className="text-2xl font-bold mb-3">
            <Link
              to="myListing"
              smooth={true}
              duration={500}
              className="underline hover:text-gray-300 cursor-pointer"
            >
              My Listings
            </Link>
          </h2>
          <p className="mb-2 text-lg">
            My Listings keeps track of all the items you have posted.
            You can edit, delete, or check the status of each item.
          </p>
          <p className="mb-2 text-lg">
            This section gives you an organized overview of your posts and ensures you stay
            updated on any responses or actions from other users.
          </p>
          <p className="text-lg">
            Managing your posts has never been easier, and it allows you to keep control of
            all your lost or found items in one place.
          </p>
        </Element>
      </section>
    </div>
  );
}
