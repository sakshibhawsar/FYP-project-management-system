import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardStats } from "../../store/slices/studentSlice";
import { Link } from "react-router-dom";
import { Bell, MessageCircle, MessageCircleWarning } from "lucide-react";
import { updateProfile } from "../../store/slices/authSlice";

const StudentDashboard = () => {
  const dispatch = useDispatch();
  const { authUser } = useSelector((state) => state.auth);
  const { dashboardStats } = useSelector((state) => state.student);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState({
    department: "",
    semester: "",
    year: "",
    projectType: "",
  });

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  useEffect(() => {
    if (authUser?.academicDetails) {
      setProfileData({
        department: authUser.academicDetails.department || "",
        semester: authUser.academicDetails.semester || "",
        year: authUser.academicDetails.year || "",
        projectType: authUser.academicDetails.projectType || "",
      });
    }
  }, [authUser]);

  const handleProfileSubmit = (e) => {
    e.preventDefault();

    if (
      !profileData.department ||
      !profileData.semester ||
      !profileData.year ||
      !profileData.projectType
    ) {
      alert("All fields required");
      return;
    }

    dispatch(updateProfile(profileData));
    setShowProfileModal(false);
  };
  const project = dashboardStats?.project || {};
  const supervisorName = dashboardStats?.supervisorName || "N/A";
  const upcomingDeadline = dashboardStats?.upcomingDeadline || [];
  const topNotifications = dashboardStats?.topNotifications || [];
  const feedbackList =
    dashboardStats?.feedbackNotifications?.slice(-2).reverse() || [];

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // const getStatusColor = (status) => {
  //   switch (status) {
  //     case "upcoming":
  //       return "badge-pending";

  //     case "completed":
  //       return "badge-approved";

  //     case "overduo":
  //       return "badge-rejected";

  //     default:
  //       return "badge-pending";
  //   }
  // };

  return (
    <>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-500 flex justify-between items-center to-blue-600 rounded-lg p-6 text-white">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome back, {authUser?.name || "Student"}
            </h1>
            <p className="text-blue-100">
              Here's your project overview and recent updates.
            </p>
          </div>
          <button
            className="mt-4 bg-white text-blue-600 px-4 py-2 rounded-md font-medium hover:bg-blue-100"
            onClick={() => setShowProfileModal(true)}>
            {authUser?.academicDetails?.isProfileComplete
              ? "Edit Profile"
              : "Complete Profile"}
          </button>
        </div>

        {/* quick stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">📘</div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">
                  Project Title
                </p>
                <p className="text-lg font-semibold text-slate-800">
                  {project?.title || "No Project"}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">👨‍🏫</div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Supervisor</p>
                <p className="text-lg font-semibold text-slate-800">
                  {supervisorName || "N/A"}
                </p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">⏰</div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">
                  Next Deadline
                </p>
                <p className="text-lg font-semibold text-slate-800">
                  {formatDate(project?.deadline)}
                </p>
                <p className="text-lg font-semibold text-slate-800">
                  {project?.deadlineName}
                </p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">💬</div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">
                  Recent Feedback
                </p>
                <p className="text-lg font-semibold text-slate-800">
                  {feedbackList?.length
                    ? formatDate[0]?.createdAt
                    : "No feedback yet"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* project overview */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Project Overview</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-600">
                  Title
                </label>
                <p className="text-slate-800 font-medium">
                  {project?.title || "N/A"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">
                  Description
                </label>
                <p className="text-slate-800 font-medium">
                  {project?.description || "No description provided"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-slate-600">
                  Status
                </label>
                <span
                  className={`inline-flex items-center px-2 py-[2px] rounded-full text-sm font-medium capitalize ${project?.status === "approved" ? "bg-green-100 text-green-800" : project?.status === "pending" ? "bg-yellow-100 text-yellow-800" : project?.status === "rejected" ? "bg-red-100 text-red-800" : project?.status === "completed" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}>
                  {project?.status || "Unknown"}
                </span>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-600">
                  Submission Deadline
                </label>
                <p className="text-slate-800 font-medium ">
                  {formatDate(project?.deadline)}
                </p>
              </div>
            </div>
            <div>
              <div className="mt-4 border rounded-lg p-4 bg-slate-50">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-slate-800">
                    Academic Details
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-slate-500">Department</p>
                    <p className="font-medium text-slate-800">
                      {authUser?.academicDetails?.department || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-500">Semester</p>
                    <p className="font-medium text-slate-800">
                      {authUser?.academicDetails?.semester || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-500">Year</p>
                    <p className="font-medium text-slate-800">
                      {authUser?.academicDetails?.year || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-500">Project Type</p>
                    <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 font-medium">
                      {authUser?.academicDetails?.projectType || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* latest feedback */}
          <div className="card">
            <div className="card-header flex items-center justify-between">
              <h2 className="card-title">Latest feedback</h2>
              <Link
                to={"/student/feedback"}
                className="text-sm bg-blue-500 text-white px-3 py-1 rounded-full font-medium hover:bg-blue-600 transition-all duration-300">
                View All
              </Link>
            </div>

            {feedbackList && feedbackList.length > 0 ? (
              <div className="space-y-4 p-4">
                {feedbackList.map((feedback, index) => {
                  return (
                    <div
                      key={index}
                      className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <MessageCircle className="w-5 h-5 text-blue-500" />
                          <h3 className="font-medium text-slate-800">
                            {feedback.title || "Supervisor Feedback"}
                          </h3>
                        </div>
                        <p className="text-xs text-slate-500">
                          {formatDate(feedback.createdAt)}
                        </p>
                      </div>

                      <div className="text-slate-50 rounded-lg p-3">
                        <p className="text-slate-700 text-sm leading-relaxed">
                          {feedback.message}
                        </p>
                      </div>

                      <div className="flex justify-between items-center mt-3">
                        <p className="text-xs text-slate-500">
                          {supervisorName || "Supervisor"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">
                  No feedback available yet
                </p>
              </div>
            )}
          </div>
        </div>

        {/* upcoming deadlines and notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <div className=" card-header">
              <h2 className="card-title">Upcoming Deadlines</h2>
            </div>
            {upcomingDeadline && upcomingDeadline.length > 0 ? (
              <div className="space-y-3">
                {upcomingDeadline.map((d, i) => {
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between p-5 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-800">{d.title}</p>{" "}
                        <p className="font-medium text-sm text-slate-600">
                          {formatDate(d.deadline)}
                        </p>
                        <p className="font-medium text-sm text-slate-600">
                          {d.deadlineName}
                        </p>
                      </div>

                      <div
                        className={`badge badge-pending capitalize font-bold `}>
                        upcoming
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageCircleWarning className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">
                  No upcoming deadlines yet
                </p>
              </div>
            )}
          </div>

          {/* recent notifications */}
          <div className="card">
            <div className=" card-header">
              <h2 className="card-title">Recent Notification</h2>
            </div>
            {topNotifications && topNotifications.length > 0 ? (
              <div className="space-y-3">
                {topNotifications.map((n, i) => {
                  return (
                    <div
                      key={i}
                      className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <div>
                        <p className="font-medium text-slate-800">
                          {n.message}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {formatDate(n.createdAt)}
                        </p>
                      </div>

                      <div className={`badge badge-pending `}>upcoming</div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Bell className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">No notifications yet</p>
              </div>
            )}
          </div>
        </div>

        {showProfileModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-fadeIn">
              {/* Close Button */}
              <button
                onClick={() => setShowProfileModal(false)}
                className="absolute top-3 right-3 text-slate-400 hover:text-red-500 text-lg">
                ✕
              </button>

              {/* Header */}
              <div className="mb-5">
                <h2 className="text-xl font-bold text-slate-800">
                  Complete Your Profile
                </h2>
                <p className="text-sm text-slate-500">
                  Add your academic details for better experience
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                {/* Department */}
                <div>
                  <label className="text-xs text-slate-500">Department</label>
                  <select
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-400 outline-none transition"
                    value={profileData.department}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        department: e.target.value,
                      })
                    }>
                    <option value="">Select Department</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Software Engineering">
                      Software Engineering
                    </option>
                    <option value="Information Technology">
                      Information Technology
                    </option>
                    <option value="Data Science">Data Science</option>
                    <option value="Electrical Engineering">
                      Electrical Engineering
                    </option>
                    <option value="Mechanical Engineering">
                      Mechanical Engineering
                    </option>
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="Business Administration">
                      Business Administration
                    </option>
                    <option value="Economics">Economics</option>
                    <option value="Psychology">Psychology</option>
                  </select>
                </div>

                {/* Semester + Year */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-500">Semester</label>
                    <input
                      type="text"
                      placeholder="e.g. 8th Sem"
                      className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-400 outline-none"
                      value={profileData.semester}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          semester: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-500">Year</label>
                    <input
                      type="text"
                      placeholder="e.g. 4th Year"
                      className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-400 outline-none"
                      value={profileData.year}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          year: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                {/* Project Type */}
                <div>
                  <label className="text-xs text-slate-500">Project Type</label>
                  <select
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-400 outline-none"
                    value={profileData.projectType}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        projectType: e.target.value,
                      })
                    }>
                    <option value="">Select Type</option>
                    <option value="minor">Minor Project</option>
                    <option value="major">Major Project</option>
                  </select>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowProfileModal(false)}
                    className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 transition">
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium shadow hover:scale-105 transition">
                    Save Details
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

export default StudentDashboard;
