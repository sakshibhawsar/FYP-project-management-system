import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";

// Auth Pages
import LoginPage from "./pages/auth/LoginPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";

// Dashboard Layouts
import DashboardLayout from "./components/layout/DashboardLayout";

// Student Pages
import StudentDashboard from "./pages/student/StudentDashboard";
import SubmitProposal from "./pages/student/SubmitProposal";
import UploadFiles from "./pages/student/UploadFiles";
import SupervisorPage from "./pages/student/SupervisorPage";
import FeedbackPage from "./pages/student/FeedbackPage";
import NotificationsPage from "./pages/student/NotificationsPage";

// Teacher Pages
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import PendingRequests from "./pages/teacher/PendingRequests";
import AssignedStudents from "./pages/teacher/AssignedStudents";
import TeacherFiles from "./pages/teacher/TeacherFiles";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageStudents from "./pages/admin/ManageStudents";
import ManageTeachers from "./pages/admin/ManageTeachers";
import AssignSupervisor from "./pages/admin/AssignSupervisor";
import DeadlinesPage from "./pages/admin/DeadlinesPage";
import NotFound from "./pages/NotFound";
import ProjectsPage from "./pages/admin/ProjectsPage";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import { Loader } from "lucide-react";
import { getUser } from "./store/slices/authSlice";
import { getAllProjects, getAllUsers } from "./store/slices/adminSlice";
import { fetchDashboardStats } from "./store/slices/studentSlice";

const App = () => {
  const { authUser, isCheckingAuth } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  useEffect(() => {
    if (authUser?.role === "Admin") {
      dispatch(getAllUsers());
      dispatch(getAllProjects());
    }
    if (authUser?.role === "Student") {
      dispatch(fetchDashboardStats());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser]);

  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!authUser) {
      return <Navigate to="/login" replace />;
    }
    if (
      allowedRoles?.length &&
      authUser?.role &&
      !allowedRoles.includes(authUser.role)
    ) {
      const redirectPath =
        authUser.role === "Admin"
          ? "/admin"
          : authUser.role === "Teacher"
            ? "/teacher"
            : "/student";
      return <Navigate to={redirectPath} replace />;
    }
    return children;
  };

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <DashboardLayout userRole={"Admin"} />
            </ProtectedRoute>
          }>
          <Route index element={<AdminDashboard />} />
          <Route path="students" element={<ManageStudents />} />
          <Route path="teachers" element={<ManageTeachers />} />
          <Route path="assign-supervisor" element={<AssignSupervisor />} />
          <Route path="deadlines" element={<DeadlinesPage />} />
          <Route path="projects" element={<ProjectsPage />} />
        </Route>

        {/* Student Routes */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["Student"]}>
              <DashboardLayout userRole={"Student"} />
            </ProtectedRoute>
          }>
          <Route index element={<StudentDashboard />} />
          <Route path="submit-proposal" element={<SubmitProposal />} />
          <Route path="upload-files" element={<UploadFiles />} />
          <Route path="supervisor" element={<SupervisorPage />} />
          <Route path="feedback" element={<FeedbackPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>
        {/* teache routes */}
        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowedRoles={["Teacher"]}>
              <DashboardLayout userRole={"Teacher"} />
            </ProtectedRoute>
          }>
          <Route index element={<TeacherDashboard />} />
          <Route path="pending-requests" element={<PendingRequests />} />
          <Route path="assigned-students" element={<AssignedStudents />} />
          <Route path="files" element={<TeacherFiles />} />
        </Route>

        {/* default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route
          path="/unauthorized"
          element={
            <div className="flex bg-slate-50 items-center justify-center min-h-screen">
              <div className="text-center">
                <h1 className="text-2xl text-slate-800 font-bold mb-4">
                  Unauthorized Access
                </h1>
                <p className="text-slate-600 mb-4">
                  You do not have permission to view this page.
                </p>
                <button
                  className="btn-primary"
                  onClick={() => window.history.back()}>
                  Go Back
                </button>
              </div>
            </div>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer theme="dark" />
    </BrowserRouter>
  );
};

export default App;
