import { useState } from "react";
import { submitProjectLinks } from "../../store/slices/studentSlice";
import { useDispatch } from "react-redux";
import { Github, Globe, Loader2 } from "lucide-react";

const ProjectLinksForm = ({ projectId, closeModal }) => {
  const dispatch = useDispatch();

  const [links, setLinks] = useState({
    githubRepo: "",
    liveLink: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!links.githubRepo || !links.liveLink) {
      alert("Both links required");
      return;
    }

    setLoading(true);

    await dispatch(submitProjectLinks({ projectId, ...links }));

    setLoading(false);
    closeModal();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* GitHub Input */}
      <div>
        <label className="text-sm font-medium text-slate-600 flex items-center gap-2 mb-1">
          <Github className="w-4 h-4" />
          GitHub Repository
        </label>

        <input
          type="url"
          placeholder="https://github.com/your-repo"
          className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
          value={links.githubRepo}
          onChange={(e) => setLinks({ ...links, githubRepo: e.target.value })}
        />
      </div>

      {/* Live Link Input */}
      <div>
        <label className="text-sm font-medium text-slate-600 flex items-center gap-2 mb-1">
          <Globe className="w-4 h-4" />
          Live Project URL
        </label>

        <input
          type="url"
          placeholder="https://yourproject.vercel.app"
          className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
          value={links.liveLink}
          onChange={(e) => setLinks({ ...links, liveLink: e.target.value })}
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={closeModal}
          className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 transition">
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium shadow hover:scale-95 transition disabled:opacity-50 flex items-center gap-2">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Links"
          )}
        </button>
      </div>
    </form>
  );
};

export default ProjectLinksForm;
