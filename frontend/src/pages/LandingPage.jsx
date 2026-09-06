import React from "react";
import { Link } from "react-router";

const LandingPage = () => {
  return (
    <div className="min-h-screen text-base-content">

      {/* Navbar */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link to="/" className="text-2xl font-bold">
          Think<span className="text-primary">Notes</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link to="/login" className="btn btn-ghost">
            Login
          </Link>

          <Link to="/register" className="btn btn-primary">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="mx-auto flex max-w-7xl flex-col items-center px-6 py-20 text-center">

        <div className="mb-6 badge badge-primary badge-outline p-4">
          Smart Note Taking
        </div>

        <h1 className="max-w-4xl text-5xl font-bold leading-tight md:text-7xl">
          Organize Your Thoughts.
          <br />

          <span className="text-primary">
            Think Better.
          </span>
        </h1>

        <p className="mt-8 max-w-2xl text-lg opacity-70 md:text-xl">
          ThinkNotes helps you capture your ideas, organize your thoughts,
          and keep your notes secure in one place.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            to="/register"
            className="btn btn-primary btn-lg"
          >
            Start Taking Notes
          </Link>

          <Link
            to="/login"
            className="btn btn-outline btn-lg"
          >
            Login to Your Account
          </Link>
        </div>

      </main>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 py-20">

        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            Everything you need for your notes
          </h2>

          <p className="mt-4 opacity-70">
            Simple, secure and designed to keep your thoughts organized.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">

          {/* Feature 1 */}
          <div className="rounded-2xl bg-base-100 p-8 shadow-xl">
            <div className="mb-4 text-4xl">
              📝
            </div>

            <h3 className="text-xl font-bold">
              Create Notes Easily
            </h3>

            <p className="mt-3 opacity-70">
              Capture your thoughts quickly and keep all your important
              ideas organized.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="rounded-2xl bg-base-100 p-8 shadow-xl">
            <div className="mb-4 text-4xl">
              🔐
            </div>

            <h3 className="text-xl font-bold">
              Secure Authentication
            </h3>

            <p className="mt-3 opacity-70">
              Your account and notes are protected using secure
              authentication.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="rounded-2xl bg-base-100 p-8 shadow-xl">
            <div className="mb-4 text-4xl">
              ⚡
            </div>

            <h3 className="text-xl font-bold">
              Fast and Simple
            </h3>

            <p className="mt-3 opacity-70">
              Focus on your thoughts without unnecessary complexity.
            </p>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-6 py-20 text-center">

        <div className="rounded-3xl bg-base-100 p-12 shadow-xl">

          <h2 className="text-3xl font-bold md:text-5xl">
            Ready to organize your thoughts?
          </h2>

          <p className="mt-5 opacity-70">
            Create your account and start writing today.
          </p>

          <Link
            to="/register"
            className="btn btn-primary btn-lg mt-8"
          >
            Get Started for Free
          </Link>

        </div>

      </section>

      {/* Footer */}
      <footer className="border-t border-base-300 py-8 text-center opacity-60">
        © 2026 ThinkNotes. Built for better thinking.
      </footer>

    </div>
  );
};

export default LandingPage;