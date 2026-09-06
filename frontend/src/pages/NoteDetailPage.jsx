import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import {
  ArrowLeftIcon,
  LoaderIcon,
  Trash2Icon,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../lib/axios";

const NoteDetailPage = () => {
  const [note, setNote] = useState(null);

  // Page loading
  const [loading, setLoading] = useState(true);

  // Save note loading
  const [saving, setSaving] = useState(false);

  // Delete note loading
  const [deleting, setDeleting] = useState(false);

  // AI states
  const [improving, setImproving] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [aiMode, setAiMode] = useState("improve");

  const navigate = useNavigate();
  const { id } = useParams();

  // --------------------------------
  // Fetch Single Note
  // --------------------------------
  useEffect(() => {
    const fetchNote = async () => {
      try {
        setLoading(true);

        const res = await api.get(`/notes/${id}`);

        setNote(res.data);
      } catch (error) {
        console.log("Error fetching note:", error);

        if (error.response?.status === 401) {
          toast.error("Your session has expired. Please login again.");
          navigate("/login");
          return;
        }

        if (error.response?.status === 404) {
          toast.error("Note not found or you don't have access.");
          navigate("/notes");
          return;
        }

        toast.error(
          error.response?.data?.message ||
            "Failed to fetch note details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id, navigate]);

  // --------------------------------
  // Delete Note
  // --------------------------------
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this note?")) {
      return;
    }

    setDeleting(true);

    try {
      await api.delete(`/notes/${id}`);

      toast.success("Note deleted successfully");

      navigate("/notes");
    } catch (error) {
      console.log("Error deleting note:", error);

      if (error.response?.status === 401) {
        toast.error("Your session has expired. Please login again.");
        navigate("/login");
      } else if (error.response?.status === 404) {
        toast.error("Note not found or you don't have access.");
      } else {
        toast.error(
          error.response?.data?.message ||
            "Failed to delete note"
        );
      }
    } finally {
      setDeleting(false);
    }
  };

  // --------------------------------
  // Improve Note With AI
  // --------------------------------
  const handleImprove = async () => {
    if (!note?.content?.trim()) {
      toast.error("Please write some content first");
      return;
    }

    setImproving(true);
    setAiResult(null);

    try {
      const res = await api.post("/ai/enhance", {
        text: note.content.trim(),
        mode: aiMode,
      });

      // Safety check
      if (!res.data?.improvedText) {
        toast.error("AI did not return an improved version");
        return;
      }

      setAiResult(res.data);

      toast.success("Your note has been improved!");
    } catch (error) {
      console.log("Error improving note:", error);

      if (error.response?.status === 401) {
        toast.error("Please login again to use AI features");
        navigate("/login");
      } else if (error.response?.status === 429) {
        toast.error(
          "Too many AI requests. Please try again later."
        );
      } else {
        toast.error(
          error.response?.data?.message ||
            "Failed to improve note with AI"
        );
      }
    } finally {
      setImproving(false);
    }
  };

  // --------------------------------
  // Apply AI Improved Version
  // --------------------------------
  const handleUseAiVersion = () => {
    if (!aiResult?.improvedText) {
      return;
    }

    setNote({
      ...note,
      content: aiResult.improvedText,
    });

    setAiResult(null);

    toast.success("Improved version applied");
  };

  // --------------------------------
  // Discard AI Result
  // --------------------------------
  const handleDiscardAiResult = () => {
    setAiResult(null);

    toast.success("AI result discarded");
  };

  // --------------------------------
  // Update Note
  // --------------------------------
  const handleSave = async () => {
    const trimmedTitle = note?.title?.trim();
    const trimmedContent = note?.content?.trim();

    if (!trimmedTitle || !trimmedContent) {
      toast.error("Please add a title and content");
      return;
    }

    setSaving(true);

    try {
      await api.put(`/notes/${id}`, {
        title: trimmedTitle,
        content: trimmedContent,
      });

      toast.success("Note updated successfully");

      navigate("/notes");
    } catch (error) {
      console.log("Error updating note:", error);

      if (error.response?.status === 401) {
        toast.error("Your session has expired. Please login again.");
        navigate("/login");
      } else if (error.response?.status === 404) {
        toast.error("Note not found or you don't have access.");
      } else {
        toast.error(
          error.response?.data?.message ||
            "Failed to update note"
        );
      }
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------
  // Loading UI
  // --------------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center">
        <LoaderIcon className="animate-spin size-10 text-primary" />

        <p className="mt-4 text-base-content/70">
          Loading your note...
        </p>
      </div>
    );
  }

  // Safety check
  if (!note) {
    return null;
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">

          {/* Top Buttons */}
          <div className="flex items-center justify-between mb-6">
            <Link
              to="/notes"
              className="btn btn-ghost"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              Back to Notes
            </Link>

            <button
              onClick={handleDelete}
              className="btn btn-error btn-outline"
              disabled={
                saving ||
                improving ||
                deleting
              }
            >
              <Trash2Icon className="h-5 w-5" />

              {deleting
                ? "Deleting..."
                : "Delete Note"}
            </button>
          </div>

          {/* Note Form */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">

              <h2 className="card-title text-2xl mb-4">
                Edit Note
              </h2>

              {/* Title */}
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">
                    Title
                  </span>
                </label>

                <input
                  type="text"
                  placeholder="Note title"
                  className="input input-bordered w-full"
                  value={note.title}
                  disabled={
                    saving ||
                    improving ||
                    deleting
                  }
                  onChange={(e) => {
                    setNote({
                      ...note,
                      title: e.target.value,
                    });
                  }}
                />
              </div>

              {/* Content */}
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">
                    Content
                  </span>
                </label>

                <textarea
                  placeholder="Write your note here..."
                  className="textarea textarea-bordered h-40 w-full"
                  value={note.content}
                  disabled={
                    saving ||
                    improving ||
                    deleting
                  }
                  onChange={(e) => {
                    setNote({
                      ...note,
                      content: e.target.value,
                    });

                    // Content changed,
                    // old AI result is now stale
                    setAiResult(null);
                  }}
                />
              </div>

              {/* AI Mode Selector */}
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">
                    AI Improvement Mode
                  </span>
                </label>

                <select
                  className="select select-bordered w-full"
                  value={aiMode}
                  disabled={
                    saving ||
                    improving ||
                    deleting
                  }
                  onChange={(e) => {
                    setAiMode(e.target.value);

                    // Mode changed,
                    // clear previous AI result
                    setAiResult(null);
                  }}
                >
                  <option value="improve">
                    ✨ General Improve
                  </option>

                  <option value="grammar">
                    📝 Grammar & Spelling
                  </option>

                  <option value="professional">
                    💼 Professional
                  </option>

                  <option value="concise">
                    ⚡ Concise
                  </option>

                  <option value="clarity">
                    👁️ Improve Clarity
                  </option>
                </select>
              </div>

              {/* Improve Button */}
              <div className="flex justify-end mb-4">
                <button
                  type="button"
                  onClick={handleImprove}
                  disabled={
                    improving ||
                    saving ||
                    deleting ||
                    !note.content.trim()
                  }
                  className="btn btn-secondary"
                >
                  {improving
                    ? "Improving..."
                    : "✨ Improve with AI"}
                </button>
              </div>

              {/* AI Result */}
              {aiResult && (
                <div className="mt-6 rounded-xl border border-primary p-4">

                  {/* AI Result Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">

                    <h3 className="font-bold text-lg">
                      ✨ AI Improved Version
                    </h3>

                    <div className="flex gap-2">

                      {/* Discard */}
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={handleDiscardAiResult}
                        disabled={
                          saving ||
                          deleting
                        }
                      >
                        Discard
                      </button>

                      {/* Apply AI Version */}
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={handleUseAiVersion}
                        disabled={
                          saving ||
                          deleting
                        }
                      >
                        Use This Version
                      </button>

                    </div>
                  </div>

                  {/* Improved Text */}
                  <div className="rounded-lg bg-base-200 p-4">
                    <p className="whitespace-pre-wrap">
                      {aiResult.improvedText}
                    </p>
                  </div>

                  {/* AI Suggestions */}
                  {Array.isArray(
                    aiResult.suggestions
                  ) &&
                    aiResult.suggestions.length > 0 && (
                      <div className="mt-5">

                        <h4 className="font-semibold mb-3">
                          AI Suggestions
                        </h4>

                        <div className="space-y-3">

                          {aiResult.suggestions.map(
                            (suggestion, index) => (
                              <div
                                key={index}
                                className="rounded-lg bg-base-200 p-3"
                              >
                                {suggestion.type && (
                                  <p className="font-medium">
                                    {suggestion.type}
                                  </p>
                                )}

                                {suggestion.original && (
                                  <p className="text-sm mt-1">
                                    <span className="font-semibold">
                                      Original:
                                    </span>{" "}
                                    {suggestion.original}
                                  </p>
                                )}

                                {suggestion.replacement && (
                                  <p className="text-sm mt-1">
                                    <span className="font-semibold">
                                      Suggested:
                                    </span>{" "}
                                    {suggestion.replacement}
                                  </p>
                                )}

                                {suggestion.explanation && (
                                  <p className="text-sm opacity-70 mt-1">
                                    {suggestion.explanation}
                                  </p>
                                )}
                              </div>
                            )
                          )}

                        </div>
                      </div>
                    )}

                </div>
              )}

              {/* Save Button */}
              <div className="card-actions justify-end mt-6">

                <button
                  className="btn btn-primary"
                  disabled={
                    saving ||
                    improving ||
                    deleting
                  }
                  onClick={handleSave}
                >
                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>

              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default NoteDetailPage;