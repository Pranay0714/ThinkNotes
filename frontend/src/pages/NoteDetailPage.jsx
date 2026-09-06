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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // AI States
  const [improving, setImproving] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch single note
  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/${id}`);
        setNote(res.data);
      } catch (error) {
        console.log("Error in fetchNote", error);

        if (error.response?.status === 404) {
          toast.error("Note not found or you don't have access");

          navigate("/notes");
          return;
        }

        toast.error("Failed to fetch note details");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id, navigate]);

  // Delete note
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this note?")) {
      return;
    }

    try {
      await api.delete(`/notes/${id}`);

      toast.success("Note deleted");
      navigate("/notes");
    } catch (error) {
      console.log("Error deleting the note:", error);

      if (error.response?.status === 404) {
        toast.error("Note not found or you don't have access");
      } else {
        toast.error("Failed to delete note");
      }
    }
  };

  // Improve note using WordGlow AI
  const handleImprove = async () => {
    if (!note?.content.trim()) {
      toast.error("Please write some content first");
      return;
    }

    setImproving(true);
    setAiResult(null);

    try {
      const res = await api.post("/ai/enhance", {
        text: note.content,
      });

      setAiResult(res.data);

      toast.success("Your note has been improved!");
    } catch (error) {
      console.log("Error improving note:", error);

      toast.error("Failed to improve note with AI");
    } finally {
      setImproving(false);
    }
  };

  // Update note
  const handleSave = async () => {
    if (!note.title.trim() || !note.content.trim()) {
      toast.error("Please add a title and content");
      return;
    }

    setSaving(true);

    try {
      await api.put(`/notes/${id}`, {
        title: note.title,
        content: note.content,
      });

      toast.success("Note updated successfully");

      navigate("/notes");
    } catch (error) {
      console.log("Error saving the note:", error);

      if (error.response?.status === 404) {
        toast.error("Note not found or you don't have access");
      } else {
        toast.error("Failed to update note");
      }
    } finally {
      setSaving(false);
    }
  };

  // Loading UI
  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <LoaderIcon className="animate-spin size-10" />
      </div>
    );
  }

  // Extra safety
  if (!note) {
    return null;
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">

          {/* Top Buttons */}
          <div className="flex items-center justify-between mb-6">
            <Link to="/notes" className="btn btn-ghost">
              <ArrowLeftIcon className="h-5 w-5" />
              Back to Notes
            </Link>

            <button
              onClick={handleDelete}
              className="btn btn-error btn-outline"
            >
              <Trash2Icon className="h-5 w-5" />
              Delete Note
            </button>
          </div>

          {/* Note Form */}
          <div className="card bg-base-100">
            <div className="card-body">

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
                  className="input input-bordered"
                  value={note.title}
                  onChange={(e) => {
                    setNote({
                      ...note,
                      title: e.target.value,
                    });

                    // Old AI result is no longer relevant
                    setAiResult(null);
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
                  className="textarea textarea-bordered h-32"
                  value={note.content}
                  onChange={(e) => {
                    setNote({
                      ...note,
                      content: e.target.value,
                    });

                    // Remove old AI result when user changes content
                    setAiResult(null);
                  }}
                />
              </div>

              {/* Improve with AI Button */}
              <div className="flex justify-end mb-4">
                <button
                  type="button"
                  onClick={handleImprove}
                  disabled={improving || !note?.content.trim()}
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
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <h3 className="font-bold text-lg">
                      ✨ AI Improved Version
                    </h3>

                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        setNote({
                          ...note,
                          content: aiResult.improvedText,
                        });

                        // Hide result after applying it
                        setAiResult(null);

                        toast.success("Improved version applied");
                      }}
                    >
                      Use This Version
                    </button>
                  </div>

                  {/* Improved Text */}
                  <p className="whitespace-pre-wrap opacity-80">
                    {aiResult.improvedText}
                  </p>

                  {/* AI Suggestions */}
                  {aiResult.suggestions?.length > 0 && (
                    <div className="mt-5">

                      <h4 className="font-semibold mb-3">
                        Suggestions
                      </h4>

                      <div className="space-y-3">
                        {aiResult.suggestions.map(
                          (suggestion, index) => (
                            <div
                              key={index}
                              className="rounded-lg bg-base-200 p-3"
                            >
                              <div className="flex flex-wrap items-center gap-2">

                                {/* Suggestion Type */}
                                <span className="badge badge-outline">
                                  {suggestion.type}
                                </span>

                                {/* Original Text */}
                                <span className="line-through opacity-60">
                                  {suggestion.original}
                                </span>

                                <span>→</span>

                                {/* Replacement */}
                                <span className="font-semibold text-primary">
                                  {suggestion.replacement}
                                </span>

                              </div>

                              {/* Explanation */}
                              <p className="text-sm opacity-70 mt-2">
                                {suggestion.explanation}
                              </p>
                            </div>
                          )
                        )}
                      </div>

                    </div>
                  )}

                </div>
              )}

              {/* Save Changes */}
              <div className="card-actions justify-end mt-4">
                <button
                  className="btn btn-primary"
                  disabled={saving}
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