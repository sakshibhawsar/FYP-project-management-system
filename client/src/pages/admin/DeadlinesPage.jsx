import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createDeadlne } from "../../store/slices/deadlineSlice";
import { X } from "lucide-react";

const DeadlinesPage = () => {
  const [showModel, setShowModel] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    projectTitle: "",
    studentName: "",
    supervisor: "",
    deadlineDate: "",
    description: "",
  });
  const [selectedProject, setSelectedProject] = useState(null);
  const [query, setQuery] = useState("");

  const dispatch = useDispatch();

  const { projects } = useSelector((state) => state.admin);
  const [viewProjects, setViewProjects] = useState(projects || []);

  useEffect(() => {
    setViewProjects(projects || []);
  }, [projects]);

  const projectRows = useMemo(() => {
    return (viewProjects || []).map((p) => ({
      _id: p._id,
      title: p.title,
      studentName: p.student?.name || "",
      studentEmail: p.student?.email || "",
      studentDept: p.student?.department || "",
      supervisor: p.supervisor?.name || "",
      deadline: p.deadline
        ? new Date(p.deadline).toISOString().slice(0, 10)
        : "-",
      name: p.deadlineName || "",
      updatedAt: p.updatedAt ? new Date(p.updatedAt).toLocaleString() : "-",
    }));
  }, [viewProjects]);
  console.log(projectRows);

  const filteredProjects = projectRows.filter((row) => {
    const matchesSearch =
      (row.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (row.studentName || "").toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProject || !formData.deadlineDate || !formData.name) {
      alert("All fields are required");
      return;
    }

    let deadlineData = {
      name: formData.name,
      dueDate: formData.deadlineDate,
      project: selectedProject?._id,
    };

    try {
      const updated = await dispatch(
        createDeadlne({ id: selectedProject._id, data: deadlineData }),
      ).unwrap();

      const updatedProject = updated; //

      if (updatedProject?._id) {
        setViewProjects((prev) =>
          prev.map((p) =>
            p._id === updatedProject._id
              ? {
                  ...p,
                  ...updatedProject,
                }
              : p,
          ),
        );

        console.log(updatedProject);
      }
    } finally {
      setShowModel(false);
      setFormData({
        name: "",
        projectTitle: "",
        studentName: "",
        supervisor: "",
        deadlineDate: "",
        description: "",
      });
      setSelectedProject(null);
      setQuery("");
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* header */}
        <div className="card">
          <div className="card-header flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="card-title">Manage Deadlines</h1>
              <p className="card-subtitle">
                Create and monitor project deadlines
              </p>
            </div>
            <button
              onClick={() => setShowModel(true)}
              className="btn-primary mt-4 md:mt-8">
              Create/Update Deadline
            </button>
          </div>
        </div>

        {/* filters */}
        <div className="card">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Search Deadlines
              </label>
              <input
                type="text"
                placeholder="Search by project or student..."
                className="input-field w-full outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Project Deadlines</h2>
          </div>
          <div className="overflow-y-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Project Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Supervisor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Deadline
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Updated
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-slate-200">
                {filteredProjects.map((row) => {
                  return (
                    <tr className="hover:bg-slate-50" key={row._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-slate-900">
                            {row.studentName}
                          </div>
                          <div className="text-sm text-slate-500">
                            {row.studentEmail}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">{row.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {row.supervisor !== "-" ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {row.supervisor}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Not Assigned
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {row.deadline ? (
                          <div>
                            <div className="text-sm font-semibold text-slate-800">
                              {row.name}
                            </div>
                            <div className="text-xs text-slate-500">
                              {row.deadline}
                            </div>
                          </div>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-6 py-4">{row.updatedAt}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              No projects found matching your criteria.
            </div>
          )}
        </div>

        {/* model */}
        {showModel && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-3xl mx-4 max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-slate-900">
                  Create or Update Deadline
                </h3>
                <button
                  className="text-slate-400 hover:text-slate-600"
                  onClick={() => setShowModel(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">Project Title</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Start trying to search projects..."
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setSelectedProject(null);
                      setFormData({
                        ...formData,
                        projectTitle: e.target.value,
                      });
                    }}
                  />
                  {query && !selectedProject && (
                    <div className="mt-2 border border-slate-200 rounded-md max-h-56 overflow-y-auto">
                      {(projects || [])
                        .filter((p) =>
                          (p.title || "")
                            .toLowerCase()
                            .includes(query.toLowerCase()),
                        )
                        .slice(0, 8)
                        .map((p) => (
                          <button
                            type="button"
                            key={p._id}
                            className="w-full text-left px-5 py-2 hover:bg-slate-50"
                            onClick={() => {
                              setSelectedProject(p);
                              setQuery(p.title);
                              setFormData({
                                ...formData,
                                projectTitle: p.title,
                                deadlineDate: p.deadline
                                  ? new Date(p.deadline)
                                      .toISOString()
                                      .slice(0, 10)
                                  : "",
                              });
                            }}
                            title={p.title}>
                            <div className="text-xs font-medium text-slate-800 truncate">
                              {p.title}
                            </div>
                            <div className="text-xs text-slate-500 truncate">
                              {p.student?.name || "-"}{" "}
                              {p.supervisor?.name || "-"}
                            </div>
                          </button>
                        ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="label">Deadline Type</label>
                  <select
                    className="input-field w-full"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }>
                    <option value="">Select Type</option>
                    <option value="Synopsis">Synopsis</option>
                    <option value="Project Submission">
                      Project Submission
                    </option>
                    <option value="Presentation">Presentation</option>
                    <option value="Viva">Viva</option>
                  </select>
                  <label className="label">Deadline</label>
                  <input
                    type="date"
                    className="input-field w-full"
                    disabled={!selectedProject}
                    value={formData.deadlineDate}
                    onChange={(e) =>
                      setFormData({ ...formData, deadlineDate: e.target.value })
                    }
                  />
                </div>

                {selectedProject && (
                  <div className="mt-4 border border-slate-200 rounded-lg p-4 bg-slate-50">
                    <div className="mb-2">
                      <div className="text-sm font-semibold text-slate-900">
                        Project Details
                      </div>
                      <div
                        className="text-sm truncate text-slate-700"
                        title={selectedProject.description || ""}>
                        {(selectedProject.description || "").length > 160
                          ? `${selectedProject.description.slice(0, 160)}...`
                          : selectedProject.description}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <div className="text-xs text-slate-500">Status</div>
                        <div className="text-sm font-medium text-slate-800">
                          {selectedProject.status || "Unknown"}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Supervisor</div>
                        <div className="text-sm font-medium text-slate-800">
                          {selectedProject.supervisor?.name || "Unknown"}
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <div className="text-xs text-slate-500">Student</div>
                        <div className="text-sm font-medium text-slate-800">
                          {selectedProject.student?.name || "-"}-
                          {selectedProject.student?.email || "-"}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className=" flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModel(false)}
                    className="btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Save Deadline
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DeadlinesPage;
