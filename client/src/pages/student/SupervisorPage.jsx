import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllSupervisors,
  getSupervisor,
  fetchProject,
  requestSupervisor,
} from "../../store/slices/studentSlice";
import { X } from "lucide-react";

const SupervisorPage = () => {
  const dispatch = useDispatch();
  const { authUser } = useSelector((state) => state.auth);
  const { project, supervisors, supervisor } = useSelector(
    (state) => state.student,
  );

  const [showRequestModel, setShowRequestModel] = useState(false);
  const [selectedSupervisor, setSelectedSupervisor] = useState(null);
  const [requestMessage, setRequestMessage] = useState("");

  useEffect(() => {
    dispatch(getSupervisor());
    dispatch(fetchAllSupervisors());
    dispatch(fetchProject());
  }, [dispatch]);

  const hasSupervisor = useMemo(
    () => !!(supervisor && supervisor._id),
    [supervisor],
  );

  const hasProject = useMemo(() => !!(project && project._id), [project]);

  const formatDeadline = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "-";
    const day = date.getDate();
    const j = day % 10;
    const k = day % 100;
    const suffix =
      j === 1 && k !== 11
        ? "st"
        : j === 2 && k !== 12
          ? "nd"
          : j === 3 && k !== 13
            ? "rd"
            : "th";
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();
    return `${day}${suffix} ${month}, ${year}`;
  };

  const handleOpenRequest = (supervisor) => {
    setSelectedSupervisor(supervisor);
    setShowRequestModel(true);
  };

  const submitRequest = () => {
    if (!selectedSupervisor) return;
    const message =
      requestMessage.trim() ||
      `${authUser.name || "Student"} has request ${selectedSupervisor.name} to be their supervisor.`;
    dispatch(
      requestSupervisor({ teacherId: selectedSupervisor._id, message }),
    ).then((res) => {
      if (res.type === "student/requestSupervisor/fulfilled") {
        setShowRequestModel(false);
      }
    });
  };

  return (
    <>
      <div className="space-y-6">
        {/* Current supervisor */}
        <div className="card">
          <div className="card-header">
            <h1 className="card-title">Current Supervisor</h1>
            {hasSupervisor && (
              <span className="badge badge-approved">Assigned</span>
            )}
          </div>
          {/* supervisor details */}
          {hasSupervisor ? (
            <div className="space-y-6">
              <div className="flex items-center space-x-6">
                <img
                  src="/placeholder.jpg"
                  alt="Supervisor Avatar"
                  className="h-20 w-20 rounded-full object-cover shadow-md"
                />
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800">
                      {supervisor?.name || "-"}
                    </h3>
                    <p className="text-lg text-slate-600">
                      {supervisor?.department || "-"}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                        Email
                      </label>
                      <p className="text-slate-800 font-medium">
                        {supervisor?.email || "-"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                        Expertise
                      </label>
                      <p className="text-slate-800 font-medium">
                        {Array.isArray(supervisor?.experties)
                          ? supervisor?.experties.join(", ")
                          : supervisor?.experties || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-500">No supervisor assigned yet.</p>
            </div>
          )}
        </div>

        {/* project details - only show if project exists */}
        {hasProject && (
          <div className="card">
            <div className="card-header">
              <h1 className="card-title">Project Details</h1>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                      Project title
                    </label>
                    <p className="text-slate-800 text-lg font-semibold mt-1">
                      {project?.title || "-"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                      Status
                    </label>
                    <div className="mt-1">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full font-medium capitalize text-sm 
                         ${project.status === "approved" ? "bg-green-100 text-green-800" : project.status === "pending" ? "bg-yellow-100 text-yellow-800" : project.status === "rejected" ? "bg-red-100 text-red-800" : project.status === "completed" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}>
                        {project?.status || "Invalid"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                      Deadline
                    </label>
                    <p className="text-slate-800 text-lg font-semibold mt-1">
                      {project?.deadline
                        ? formatDeadline(project.deadline)
                        : "No deadline set"}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                      CreatedAt
                    </label>
                    <p className="text-slate-800 text-lg font-semibold mt-1">
                      {project.createdAt
                        ? formatDeadline(project.createdAt)
                        : "Unknown"}
                    </p>
                  </div>
                </div>
              </div>

              {project?.description && (
                <div>
                  <label className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                    Description
                  </label>
                  <p className="text-slate-700 mt-2 leading-relaxed font-semibold ">
                    {project.description || "-"}
                  </p>
                </div>
              )}
              {/* GitHub Repo */}
              {project?.githubRepo && (
                <div>
                  <label className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                    GitHub Repository
                  </label>

                  <div className="mt-2 flex items-center justify-between bg-slate-50 border rounded-lg p-3">
                    <p className="text-blue-600 text-sm break-all">
                      {project.githubRepo}
                    </p>

                    <a
                      href={project.githubRepo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-4 text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                      Open
                    </a>
                  </div>
                </div>
              )}

              {/* Team Members */}
              {project?.members?.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                    Team Members
                  </label>

                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {project.members.map((member, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-slate-50 border rounded-lg p-3 hover:shadow-sm transition">
                        <div>
                          <p className="text-slate-800 font-medium">
                            {member.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {member.email}
                          </p>
                        </div>

                        <div className="w-8 h-8 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full text-sm font-bold">
                          {member.name?.charAt(0)?.toUpperCase()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* No project */}
        {!hasProject && (
          <div className="card">
            <div className="card-header">
              <h1 className="card-title">Project Required</h1>
            </div>
            <div className="p-6 text-center">
              <p className="text-slate-600">
                You haven't submitted any project yet, so you can not request
                for a supervisor. Please submit your project proposal first.
              </p>
            </div>
          </div>
        )}

        {/* Available supervisors | only when project exists and no supervisor assigned */}

        {hasProject && !hasSupervisor && (
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Available Supervisors</h2>
              <p className="card-subtitle">
                Browse and request supervision from available faculty members.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {supervisors &&
                supervisors.map((sup) => (
                  <div
                    key={sup._id}
                    className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-slate-300 rounded-full flex items-center justify-center">
                        <span className="text-xs text-center font-bold text-slate-600">
                          {sup.name.slice(0, 1).toUpperCase() || "Anonymous"}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-800">
                          {sup.name}
                        </h4>
                        <p className="text-sm text-slate-600">
                          {sup.department}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div>
                        <label className="text-xs font-medium text-slate-500 ">
                          Email
                        </label>
                        <p className="text-sm text-slate-700 ">
                          {sup.email || "-"}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-500 ">
                          Expertise
                        </label>
                        <p className="text-sm text-slate-700 ">
                          {Array.isArray(sup?.experties)
                            ? sup?.experties.join(", ")
                            : sup?.experties || "-"}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenRequest(sup)}
                      className=" btn-primary w-full">
                      Request Supervisor
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Request supervisor modal */}
        {showRequestModel && selectedSupervisor && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-800">
                    Request Supervision
                  </h3>
                  <button
                    className="text-slate-400 hover:text-slate-600"
                    onClick={() => {
                      setShowRequestModel(false);
                      setRequestMessage("");
                      setSelectedSupervisor(null);
                    }}>
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-md">
                    <p className="text-sm text-slate-600">
                      {selectedSupervisor.name}
                    </p>
                  </div>
                  <div>
                    <label className="label">Message to Supervisor</label>
                    <textarea
                      className="input min-h-[120px]"
                      required
                      value={requestMessage}
                      onChange={(e) => setRequestMessage(e.target.value)}
                      placeholder="Introduce yourself and explain why you'd like this professor to supervise your project..."
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
                    <button
                      onClick={() => {
                        setShowRequestModel(false);
                        setSelectedSupervisor(null);
                        setRequestMessage("");
                      }}
                      className="btn-outline">
                      Cancel
                    </button>
                    <button
                      onClick={submitRequest}
                      className="btn-primary"
                      disabled={!requestMessage.trim()}>
                      Send Request
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SupervisorPage;
