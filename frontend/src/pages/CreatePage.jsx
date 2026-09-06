import { ArrowLeftIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import api from "../lib/axios";

const CreatePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Normal note creation loading
  const [loading, setLoading] = useState(false);

  // AI improvement loading
  const [improving, setImproving] = useState(false);

  // AI response
  const [aiResult, setAiResult] = useState(null);

  // Selected AI improvement mode
  const [aiMode, setAiMode] = useState("improve");

  const navigate = useNavigate();

  // -------------------------------
  // AI Improve Handler
  // -------------------------------
  const handleImprove = async () => {
    if (!content.trim()) {
      toast.error("Please write some content first");
      return;
    }

    setImproving(true);
    setAiResult(null);

    try {
      const res = await api.post("/ai/enhance", {
        text: content.trim(),
        mode: aiMode,
      });

      // Safety check for backend response
      if (!res.data?.improvedText) {
        toast.error("AI did not return an improved version");
        return;
      }

      setAiResult(res.data);

      toast.success("Your note has been improved!");
    } catch (error) {
      console.log("Error improving note:", error);

      if (error.response?.status === 429) {
        toast.error(
          "Too many AI requests. Please try again later."
        );
      } else if (error.response?.status === 401) {
        toast.error("Please login again to use AI features");
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

  // -------------------------------
  // Apply AI Improved Version
  // -------------------------------
  const handleUseAiVersion = () => {
    if (!aiResult?.improvedText) {
      return;
    }

    setContent(aiResult.improvedText);
    setAiResult(null);

    toast.success("Improved version applied");
  };

  // -------------------------------
  // Discard AI Result
  // -------------------------------
  const handleDiscardAiResult = () => {
    setAiResult(null);

    toast.success("AI result discarded");
  };

  // -------------------------------
  // Create Note Handler
  // -------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle || !trimmedContent) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      await api.post("/notes", {
        title: trimmedTitle,
        content: trimmedContent,
      });

      toast.success("Note created successfully");

      navigate("/notes");
    } catch (error) {
      console.log("Error creating note:", error);

      if (error.response?.status === 429) {
        toast.error(
          "Slow down! You're creating notes too fast",
          {
            duration: 4000,
            icon: "💀",
          }
        );
      } else if (error.response?.status === 401) {
        toast.error("Your session has expired. Please login again.");
        navigate("/login");
      } else {
        toast.error(
          error.response?.data?.message ||
            "Failed to create note"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">

          {/* Back Button */}
          <Link
            to="/notes"
            className="btn btn-ghost mb-6"
          >
            <ArrowLeftIcon className="size-5" />
            Back to Notes
          </Link>

          {/* Main Card */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">

              <h2 className="card-title text-2xl mb-4">
                Create New Note
              </h2>

              <form onSubmit={handleSubmit}>

                {/* Title */}
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">
                      Title
                    </span>
                  </label>

                  <input
                    type="text"
                    placeholder="Note Title"
                    className="input input-bordered w-full"
                    value={title}
                    disabled={loading || improving}
                    onChange={(e) => {
                      setTitle(e.target.value);
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
                    value={content}
                    disabled={loading || improving}
                    onChange={(e) => {
                      setContent(e.target.value);

                      // Content changed, old AI result is now stale
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
                    disabled={loading || improving}
                    onChange={(e) => {
                      setAiMode(e.target.value);

                      // Mode changed, old result may no longer match
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

                {/* AI Improve Button */}
                <div className="flex justify-end mb-4">
                  <button
                    type="button"
                    onClick={handleImprove}
                    disabled={
                      improving ||
                      loading ||
                      !content.trim()
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

                        {/* Discard Button */}
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={handleDiscardAiResult}
                        >
                          Discard
                        </button>

                        {/* Apply AI Version */}
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={handleUseAiVersion}
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
                    {Array.isArray(aiResult.suggestions) &&
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

                {/* Create Button */}
                <div className="card-actions justify-end mt-6">

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading || improving}
                  >
                    {loading
                      ? "Creating..."
                      : "Create Note"}
                  </button>

                </div>

              </form>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CreatePage;