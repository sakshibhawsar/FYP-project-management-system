import { useState } from "react";
import { useDispatch } from "react-redux";
import { submitProjectProposal } from "../../store/slices/studentSlice";

const SubmitProposal = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      dispatch(submitProjectProposal(formData));
      setIsLoading(false);
    } catch {
      setIsLoading(false);
    }
    setFormData({
      title: "",
      description: "",
    });
  };

  return (
    <>
      <div className="space-y-6">
        <div className="card">
          <div className="card-header">
            <h1 className="card-title">Submit Proposal</h1>
            <p className="card-subtitle">
              Please fill out all sections of your project proposal. Make sure
              to be detailed and cleared about your project goals.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="label">Project Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input"
                placeholder="Enter your project title"
              />
            </div>
            <div>
              <label className="label">Project Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input min-h-[120px]"
                required
                placeholder="Provide a detailed description of your project..."
              />
            </div>
            <div className="flex justify-end space-x-4 pt-4 border-t border-slate-200 ">
              <button
                type="submit"
                disabled={isLoading}
                className=" btn-primary disabled:opacity-50">
                {isLoading ? "Submitting..." : "Submit Proposal"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SubmitProposal;
