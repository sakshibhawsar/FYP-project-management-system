import { useState } from "react";
import { useDispatch } from "react-redux";
import { submitProjectProposal } from "../../store/slices/studentSlice";

const SubmitProposal = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [members, setMembers] = useState([{ name: "", email: "" }]);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMemberChange = (index, field, value) => {
    const updated = [...members];
    updated[index][field] = value;
    setMembers(updated);
  };

  const addMember = () => {
    setMembers([...members, { name: "", email: "" }]);
  };

  const removeMember = (index) => {
    const updated = members.filter((_, i) => i !== index);
    setMembers(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    await dispatch(
      submitProjectProposal({
        ...formData,
        members,
      }),
    );

    setIsLoading(false);

    setFormData({
      title: "",
      description: "",
    });

    setMembers([{ name: "", email: "" }]);
  };

  return (
    <div className="space-y-6">
      <div className="card">
        {/* Header */}
        <div className="card-header">
          <h1 className="card-title">Submit Proposal</h1>
          <p className="card-subtitle">
            Fill all details carefully and attach your GitHub repo.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="label">Project Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input w-full"
              placeholder="Enter project title"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="label">Project Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input w-full min-h-[120px]"
              placeholder="Explain your project..."
              required
            />
          </div>

          {/* Members */}
          <div>
            <label className="label">Team Members</label>

            <div className="space-y-3">
              {members.map((member, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Name"
                    value={member.name}
                    onChange={(e) =>
                      handleMemberChange(index, "name", e.target.value)
                    }
                    className="input w-full"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={member.email}
                    onChange={(e) =>
                      handleMemberChange(index, "email", e.target.value)
                    }
                    className="input w-full"
                    required
                  />

                  {members.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMember(index)}
                      className="text-red-500 text-lg px-2">
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addMember}
              className="mt-3 text-sm text-blue-600 hover:underline">
              + Add Member
            </button>
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-4 border-t border-slate-200">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary px-6 py-2 disabled:opacity-50">
              {isLoading ? "Submitting..." : "Submit Proposal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitProposal;
