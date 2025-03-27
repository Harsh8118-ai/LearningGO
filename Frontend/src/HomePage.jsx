import React from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

// Initialize AOS for animations
AOS.init();

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      {/* Hero Section */}
      <section className="text-center py-20 px-4 md:px-10">
        <h1
          className="text-4xl md:text-6xl font-bold"
          data-aos="fade-down"
          data-aos-duration="1000"
        >
          Welcome to <span className="text-blue-500">LearningGo</span>
        </h1>
        <p
          className="mt-4 text-lg md:text-xl max-w-2xl mx-auto"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          The ultimate platform to enhance your learning experience, connect
          with friends, and track your progress efficiently.
        </p>

        {/* CTA Buttons */}
        <div className="mt-6 flex justify-center gap-4">
          <Link
            to="/signup"
            className="px-6 py-3 gradient text-white rounded-lg shadow-lg  transition-all"
            data-aos="zoom-in"
            data-aos-duration="1000"
          >
            Get Started
          </Link>
          <Link
            to="/questions"
            className="px-6 py-3 bg-gray-800 text-white rounded-lg shadow-lg hover:bg-gray-900 transition-all"
            data-aos="zoom-in"
            data-aos-duration="1000"
          >
            Explore Questions
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 md:px-10 bg-white dark:bg-gray-800">
        <h2
          className="text-3xl md:text-4xl font-bold text-center"
          data-aos="fade-right"
        >
          Key Features
        </h2>
        <div className="mt-10 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <div
            className="p-6 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-lg"
            data-aos="flip-left"
            data-aos-duration="1000"
          >
            <h3 className="text-xl font-semibold">Question Bank</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Access a wide range of coding questions, bookmark your favorites,
              and track your progress.
            </p>
          </div>

          {/* Feature 2 */}
          <div
            className="p-6 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-lg"
            data-aos="flip-right"
            data-aos-duration="1000"
          >
            <h3 className="text-xl font-semibold">Real-time Chat</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Connect with your friends and discuss problems in real-time using
              our chat feature.
            </p>
          </div>

          {/* Feature 3 */}
          <div
            className="p-6 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-lg"
            data-aos="flip-left"
            data-aos-duration="1000"
          >
            <h3 className="text-xl font-semibold">Friend System</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Send friend requests, accept invites, and collaborate with
              like-minded learners.
            </p>
          </div>

          {/* Feature 4 */}
          <div
            className="p-6 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-lg"
            data-aos="flip-right"
            data-aos-duration="1000"
          >
            <h3 className="text-xl font-semibold">Custom Themes</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Choose from different themes to personalize your experience.
            </p>
          </div>

          {/* Feature 5 */}
          <div
            className="p-6 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-lg"
            data-aos="flip-left"
            data-aos-duration="1000"
          >
            <h3 className="text-xl font-semibold">Secure Authentication</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Sign up and log in securely with Google, GitHub, or manually.
            </p>
          </div>

          {/* Feature 6 */}
          <div
            className="p-6 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-lg"
            data-aos="flip-right"
            data-aos-duration="1000"
          >
            <h3 className="text-xl font-semibold">Profile Customization</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Update your profile, set themes, and personalize your learning
              dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-16 bg-gray-200 dark:bg-gray-900">
        <h2
          className="text-3xl font-bold"
          data-aos="zoom-in"
          data-aos-duration="1000"
        >
          Ready to Start?
        </h2>
        <p
          className="mt-4 text-lg"
          data-aos="zoom-in"
          data-aos-duration="1000"
        >
          Join LearningGo today and take your learning to the next level.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Link
            to="/signup"
            className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transition-all"
            data-aos="zoom-in"
            data-aos-duration="1000"
          >
            Sign Up Now
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-all"
            data-aos="zoom-in"
            data-aos-duration="1000"
          >
            Login
          </Link>
        </div>
      </section>
    </div>
  );
}
