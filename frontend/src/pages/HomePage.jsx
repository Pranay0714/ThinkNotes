import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import RateLimiteUi from "../components/RateLimiteUi";
import api from "../lib/axios";
import toast from "react-hot-toast";
import NoteCard from "../components/NoteCard";
import NotesNotFound from "../components/NotesNotFound";
import { LoaderIcon, RefreshCwIcon, AlertCircleIcon } from "lucide-react";

const HomePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Separate normal API error state
  const [error, setError] = useState("");

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError("");
      setIsRateLimited(false);

      const res = await api.get("/notes");

      setNotes(res.data);
    } catch (error) {
      console.log("Error fetching notes:", error);

      if (error.response?.status === 429) {
        setIsRateLimited(true);
        setNotes([]);
      } else {
        setError(
          error.response?.data?.message ||
            "Failed to fetch your notes. Please try again."
        );

        toast.error("Failed to fetch notes");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch notes when page loads
  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto p-4 mt-6">

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <LoaderIcon className="size-10 animate-spin text-primary" />

            <p className="mt-4 text-base-content/70">
              Loading your notes...
            </p>
          </div>
        )}

        {/* Rate Limited State */}
        {!loading && isRateLimited && (
          <RateLimiteUi />
        )}

        {/* Normal Error State */}
        {!loading && error && !isRateLimited && (
          <div className="flex flex-col items-center justify-center py-20 text-center">

            <AlertCircleIcon className="size-14 text-error" />

            <h2 className="mt-4 text-xl font-bold">
              Something went wrong
            </h2>

            <p className="mt-2 text-base-content/70 max-w-md">
              {error}
            </p>

            <button
              onClick={fetchNotes}
              className="btn btn-primary mt-6"
            >
              <RefreshCwIcon className="size-5" />
              Try Again
            </button>

          </div>
        )}

        {/* Empty Notes State */}
        {!loading &&
          !error &&
          !isRateLimited &&
          notes.length === 0 && (
            <NotesNotFound />
          )}

        {/* Notes Grid */}
        {!loading &&
          !error &&
          !isRateLimited &&
          notes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.map((note) => (
                <NoteCard
                  key={note._id}
                  note={note}
                  setNotes={setNotes}
                />
              ))}
            </div>
          )}

      </div>
    </div>
  );
};

export default HomePage;