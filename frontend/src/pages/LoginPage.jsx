import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import api from "../lib/axios";

const LoginPage = () => {
  const navigate = useNavigate();

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await api.post("/auth/login", {
        loginId,
        password,
      });

      const data = response.data;

      // Save JWT token
      localStorage.setItem("token", data.token);

      // Save user information
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      navigate("/notes");
    } catch (error) {
      console.error("Login error:", error);

      setError(
        error.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl bg-base-100 p-8 shadow-xl">
        <h1 className="mb-6 text-center text-3xl font-bold">
          Login to ThinkNotes
        </h1>

        {error && (
          <div className="mb-4 rounded-lg bg-error p-3 text-error-content">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          {/* Username or Email */}
          <div className="mb-4">
            <label className="mb-2 block font-medium">
              Username or Email
            </label>

            <input
              type="text"
              placeholder="Enter username or email"
              className="input input-bordered w-full"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="mb-2 block font-medium">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              className="input input-bordered w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="link link-primary"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;