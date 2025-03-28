import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

export default function HomePage() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="text-center py-16 px-4">
        <h1 className="text-4xl md:text-5xl font-bold">
          Welcome to <span className="text-[var(--text-color)]">LearningGo</span>
        </h1>
        <p className="mt-3 text-lg text-gray-300">
          The ultimate platform to enhance your learning experience, connect with friends, 
          and track your progress efficiently.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link to="/signup">
            <button className="gradient px-6 py-3 text-white font-semibold rounded-lg shadow-lg hover:bg-red-600 transition">
              Get Started
            </button>
          </Link>
          <Link to="/questions">
            <button className="bg-gray-700 px-6 py-3 text-white font-semibold rounded-lg shadow-lg hover:bg-gray-600 transition">
              Explore Questions
            </button>
          </Link>
        </div>
      </header>

      {/* Key Features Section */}
      <section className="py-16 bg-gray-800 px-4 flex-1">
        <h2 className="text-center text-3xl font-bold" data-aos="fade-up">Key Features</h2>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            { title: "Question Bank", desc: "Access a wide range of coding questions, bookmark favorites, and track progress." },
            { title: "Real-time Chat", desc: "Connect with your friends and discuss problems in real-time using our chat feature." },
            { title: "Friend System", desc: "Send friend requests, accept invites, and collaborate with like-minded learners." },
            { title: "Custom Themes", desc: "Choose from different themes to personalize your experience." },
            { title: "Secure Authentication", desc: "Sign up and log in securely with Google, GitHub, or manually." },
            { title: "Profile Customization", desc: "Update your profile, set themes, and personalize your learning dashboard." },
          ].map((feature, index) => (
            <div key={index} className="bg-gray-700 p-6 rounded-lg shadow-lg" data-aos="flip-right">
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="mt-2 text-gray-300">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 text-center bg-gray-900 px-4">
        <h2 className="text-3xl font-bold">Ready to Start?</h2>
        <p className="text-gray-300 mt-2">Join LearningGo today and take your learning to the next level.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link to="/signup">
            <button className="gradient px-6 py-3 text-white font-semibold rounded-lg shadow-lg hover:bg-green-600 transition">
              Sign Up Now
            </button>
          </Link>
          <Link to="/login">
            <button className="gradient-2 px-6 py-3 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600 transition">
              Login
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
