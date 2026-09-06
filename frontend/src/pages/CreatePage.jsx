import { ArrowLeftIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import api from "../lib/axios";
const CreatePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [improving, setImproving] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  const navigate = useNavigate();
  const handleImprove = async () => {
  if (!content.trim()) {
    toast.error("Please write some content first");
    return;
  }

  setImproving(true);
  setAiResult(null);

  try {
    const res = await api.post("/ai/enhance", {
      text: content,
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
  const handelSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await api.post("/notes", {
        title,
        content,
      });

     
      toast.success("Note created successfully");
      navigate("/notes");
    } catch (error) {
      console.log("Error creating note", error);
       if (error.response?.status === 429) {
        toast.error("Slow down! You're creating notes too fast", {
          duration: 4000,
          icon: "💀",
        });
      } else {
        toast.error("Failed to create note");
      }
    }finally{
      setLoading(false);
    }

  };
  return (
    <div className= "min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Link to={"/notes"} className="btn btn-ghost mb-6">
            <ArrowLeftIcon className="size-5" />
            Back to Notes
          </Link>
          <div className="card bg-base-100">
            <div className="card-body">
              <h2 className='card-title text-2xl mb-4'>Create New Note</h2>
              <form onSubmit={handelSubmit}>
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Title</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Note Title"
                    className="input input-bordered"
                    value={title}
                    onChange={(e) => {
  setContent(e.target.value);
  setAiResult(null);
}}
                    />
                  </div>

                  <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Content</span>
                  </label>
                  <textarea
                    placeholder="Write your note here..."
                    className="textarea textarea-bordered h-32"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>
<div className="flex justify-end mb-4">
  <button
    type="button"
    onClick={handleImprove}
    disabled={improving || !content.trim()}
    className="btn btn-secondary"
  >
    {improving ? "Improving..." : "✨ Improve with AI"}
  </button>
</div>
{aiResult && (
  <div className="mt-6 rounded-xl border border-primary p-4">

    <div className="flex items-center justify-between mb-3">
      <h3 className="font-bold text-lg">
        ✨ AI Improved Version
      </h3>

      <button
        type="button"
        className="btn btn-primary btn-sm"
        onClick={() => {
          setContent(aiResult.improvedText);
          toast.success("Improved version applied");
        }}
      >
        Use This Version
      </button>
    </div>

    <p className="whitespace-pre-wrap opacity-80">
      {aiResult.improvedText}
    </p>

    {aiResult.suggestions?.length > 0 && (
      <div className="mt-5">
        <h4 className="font-semibold mb-3">
          Suggestions
        </h4>

        <div className="space-y-3">
          {aiResult.suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="rounded-lg bg-base-200 p-3"
            >
              <div className="flex flex-wrap items-center gap-2">

                <span className="badge badge-outline">
                  {suggestion.type}
                </span>

                <span className="line-through opacity-60">
                  {suggestion.original}
                </span>

                <span>→</span>

                <span className="font-semibold text-primary">
                  {suggestion.replacement}
                </span>

              </div>

              <p className="text-sm opacity-70 mt-2">
                {suggestion.explanation}
              </p>

            </div>
          ))}
        </div>
      </div>
    )}

  </div>
)}
                <div className="card-actions justify-end">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Creating..." : "Create Note"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}

export default CreatePage
