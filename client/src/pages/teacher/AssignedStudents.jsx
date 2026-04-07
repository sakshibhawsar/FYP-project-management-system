import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MessageSquare, CheckCircle, X, Loader } from "lucide-react";
import {
  addFeedback,
  getAssignedStudents,
  markComplete,
} from "../../store/slices/teacherSlice";

const AssignedStudents = () => {
  const [sortBy, setSortBy] = useState("name");
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showCompleteModel, setShowCompleteModel] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [feedbackData, setFeedbackData] = useState({
    title: "",
    message: "",
    type: "general",
  });

  const dispatch = useDispatch();
  const { assignedStudents, loading, error } = useSelector(
    (state) => state.teacher,
  );

  useEffect(() => {
    dispatch(getAssignedStudents());
  }, [dispatch]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 border border-green-300";
      case "approved":
        return "bg-blue-100 text-blue-700 border border-blue-300";
      default:
        return "bg-yellow-100 text-yellow-700 border border-yellow-300";
    }
  };

  const getStatusText = (status) => {
    if (status === "completed") return "Completed";
    if (status === "approved") return "Approved";
    return "Pending";
  };

  const handleFeedback = (student) => {
    setSelectedStudent(student);
    setFeedbackData({ title: "", message: "", type: "general" });
    setShowFeedbackModal(true);
  };

  const handleMarkComplete = (student) => {
    setSelectedStudent(student);
    setShowCompleteModel(true);
  };

  const closeModal = () => {
    setShowFeedbackModal(false);
    setShowCompleteModel(false);
    setSelectedStudent(null);
    setFeedbackData({ title: "", message: "", type: "general" });
  };

  const submitFeedback = () => {
    if (
      selectedStudent?.project?._id &&
      feedbackData.title &&
      feedbackData.message
    ) {
      dispatch(
        addFeedback({
          projectId: selectedStudent.project._id,
          payload: feedbackData,
        }),
      );
      closeModal();
    }
  };

  const confirmMarkComplete = () => {
    if (selectedStudent?.project?._id) {
      dispatch(markComplete(selectedStudent?.project?._id));
      closeModal();
    }
  };

  const sortedStudents = [...(assignedStudents || [])].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "lastActivity":
        return new Date(b.project?.updatedAt) - new Date(a.project.updatedAt);

      default:
        return 0;
    }
  });

  const stats = [
    {
      label: "Total Students",
      value: sortedStudents.length,
      bg: "bg-blue-50",
      text: "text-blue-700",
      sub: "text-blue-600",
    },
    {
      label: "Projects Completed",
      value: sortedStudents.filter((s) => s.project?.status === "completed")
        .length,
      bg: "bg-green-50",
      text: "text-green-700",
      sub: "text-green-600",
    },
    {
      label: "In Progress",
      value: sortedStudents.filter((s) => s.project?.status === "approved")
        .length,
      bg: "bg-yellow-50",
      text: "text-yellow-700",
      sub: "text-yellow-600",
    },
    {
      label: "Total Projects",
      value: sortedStudents.length,
      bg: "bg-purple-50",
      text: "text-purple-700",
      sub: "text-purple-600",
    },
  ];

  if (loading) {
    return <Loader className="animate-spin w-16 h-16" />;
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-600 font-medium">
        Error loading students
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* header */}
        <div className="card">
          <div className="card-header">
            <h1 className="card-title">Assigned Students</h1>
            <p className="card-subtitle">
              Manage your assigned students and their projects
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {stats.map((item) => {
              return (
                <div key={item.label} className={`${item.bg} p-4 rounded-lg`}>
                  <p className={`text-sm ${item.sub}`}>{item.label}</p>
                  <p className={`text-2xl ${item.text} font-bold`}>
                    {item.value}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* students grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedStudents.map((student) => (
            <div
              key={student._id}
              className="card hover:shadow-lg translate-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">
                      {student.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("") || "S"}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">
                      {student.name}
                    </h3>
                    <p className="font-sm text-slate-600">{student.email}</p>
                  </div>
                </div>

                {/* status badge */}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(student.project?.status)}`}>
                  {getStatusText(student.project?.status)}
                </span>
              </div>

              <div className="mb-5">
                <h4 className="font-medium text-slate-700 mb-1">
                  {student.project.title || "No project title"}
                </h4>
                <p className="text-xs text-slate-500">
                  Last Update:{" "}
                  {new Date(
                    student.project?.updatedAt || new Date(),
                  ).toLocaleDateString()}
                </p>
              </div>

              {/* actions  */}
              <div className="flex gap-3">
                <button
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                  onClick={() => handleFeedback(student)}>
                  <MessageSquare className="w-4 h-4" /> Feedback
                </button>
                <button
                  className={`flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg transition ${student?.project?.status === "complete" ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"}`}
                  onClick={() => handleMarkComplete(student)}
                  disabled={student.project?.status === "completed"}>
                  <CheckCircle className="w-4 h-4" /> Mark Complete
                </button>
              </div>
            </div>
          ))}

          {sortedStudents.length === 0 && (
            <div className="card text-center py-10 text-slate-600">
              No Assigned students found
            </div>
          )}
        </div>

        {/* feedback modal */}
        {showFeedbackModal && selectedStudent && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={closeModal}>
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white shadow-2xl rounded-xl w-full max-w-md transform scale-100 transition-all ">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-800">
                    Provide Feedback
                  </h2>
                  <button
                    onClick={closeModal}
                    className="text-slate-400 hover:text-slate-600">
                    <X />
                  </button>
                </div>

                {/* project info */}
                <div className="bg-slate-50 rounded-lg p-4 mb-6">
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-slate-600">
                        Project:
                      </span>
                      <span className="ml-2 text-slate-800">
                        {selectedStudent.project?.title || "No title"}
                      </span>
                    </div>

                    <div>
                      <span className="font-medium text-slate-600">
                        Student:
                      </span>
                      <span className="ml-2 text-slate-800">
                        {selectedStudent.name}
                      </span>
                    </div>

                    {selectedStudent.project?.deadline && (
                      <div>
                        <span className="font-medium text-slate-600">
                          Deadline:
                        </span>
                        <span className="ml-2 text-slate-800">
                          {new Date(
                            selectedStudent.project?.deadline,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    <div>
                      <span className="font-medium text-slate-600">
                        Last Updated:
                      </span>
                      <span className="ml-2 text-slate-800">
                        {new Date(
                          selectedStudent.project?.updatedAt || new Date(),
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* feedback form */}
                  <div className="space-y-4">
                    <div className="mt-5">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Feedback Title
                      </label>
                      <input
                        type="text"
                        value={feedbackData.title}
                        onChange={(e) =>
                          setFeedbackData({
                            ...feedbackData,
                            title: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter Feedback title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Feedback Type
                      </label>

                      <select
                        value={feedbackData.type}
                        onChange={(e) =>
                          setFeedbackData({
                            ...feedbackData,
                            type: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="general">General</option>
                        <option value="positive">Positive</option>
                        <option value="negative">Negative</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Feedback Message
                      </label>
                      <textarea
                        value={feedbackData.message}
                        onChange={(e) =>
                          setFeedbackData({
                            ...feedbackData,
                            message: e.target.value,
                          })
                        }
                        rows={4}
                        placeholder="Enter your feedback mesage... "
                        className="w-full px-3 py-2 resize-none border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button className="btn-danger" onClick={closeModal}>
                      Cancel
                    </button>
                    <button
                      className="btn-primary"
                      onClick={submitFeedback}
                      disabled={!feedbackData.title || !feedbackData.message}>
                      Submit Feedback
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* complete modal */}
        {showCompleteModel && selectedStudent && (
          <div
            className="fixed inset-0 bg-black p-4 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50"
            onClick={closeModal}>
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white shadow-2xl rounded-xl w-full max-w-md transform scale-100 transition-all ">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-800">
                    Mark Project as Completed?
                  </h2>
                  <button
                    onClick={closeModal}
                    className="text-slate-400 hover:text-slate-600">
                    <X />
                  </button>
                </div>

                <div className="bg-slate-50 rounded-lg p-4 mb-6">
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-slate-600">
                        Student
                      </span>
                      <span className="ml-2 text-slate-800">
                        {selectedStudent.name}
                      </span>
                    </div>

                    <div>
                      <span className="font-medium text-slate-600">
                        Project
                      </span>
                      <span className="ml-2 text-slate-800">
                        {selectedStudent.project?.title || "No title"}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-slate-600 mb-6">
                  Are you sure to mark this project as completed? This action
                  cannot be undone.
                </p>

                <div className="flex gap-3 ">
                  <button className="btn-danger" onClick={closeModal}>
                    Cancel
                  </button>
                  <button className="btn-primary" onClick={confirmMarkComplete}>
                    Mark as Completed
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AssignedStudents;
