import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { useDispatch, useSelector } from "react-redux";
import AddStudent from "../../components/modal/AddStudent";
import AddTeacher from "../../components/modal/AddTeacher";
import {
  getAllProjects,
  getDashboardStats,
} from "../../store/slices/adminSlice";
import { getNotifications } from "../../store/slices/notificationSlice";
import { downloadProjectFile } from "../../store/slices/projectSlice";
import {
  AlertCircle,
  AlertTriangle,
  Box,
  FileTextIcon,
  Folder,
  PlusIcon,
  User,
  X,
} from "lucide-react";
import {
  toggleStudentModal,
  toggleTeacherModal,
} from "../../store/slices/popupSlice";

const AdminDashboard = () => {
  const { isCreateStudentModalOpen, isCreateTeacherModalOpen } = useSelector(
    (state) => state.popup,
  );
  const { stats, projects } = useSelector((state) => state.admin);
  // const {  } = useSelector((state) => state.project);
  const notifications = useSelector((state) => state.notification.list);

  const dispatch = useDispatch();

  const [isReportsModelOpen, setIsReportsModelOpen] = useState(false);
  const [reportSearch, setReportSearch] = useState("");

  useEffect(() => {
    dispatch(getDashboardStats());
    dispatch(getNotifications());
    dispatch(getAllProjects());
  }, [dispatch]);

  const nearingDeadlines = useMemo(() => {
    const now = new Date();
    const threeDays = 3 * 24 * 60 * 60 * 1000;
    return (projects || []).filter((p) => {
      if (!p.deadline) return false;
      const d = new Date(p.deadline);
      return d >= now && d.getTime() - now.getTime() <= threeDays;
    }).length;
  }, [projects]);

  const files = useMemo(() => {
    return (projects || []).flatMap((p) =>
      (p.files || []).map((f) => ({
        projectId: p._id,
        originalName: f.originalName,
        fileId: f._id,
        uploadedAt: f.uploadedAt,
        projectTitle: p.title,
        studentName: p.student?.name,
      })),
    );
  }, [projects]);

  const filteredFiles = files.filter(
    (f) =>
      (f.originalName || "")
        .toLowerCase()
        .includes(reportSearch.toLowerCase()) ||
      (f.projectTitle || "")
        .toLowerCase()
        .includes(reportSearch.toLowerCase()) ||
      (f.studentName || "").toLowerCase().includes(reportSearch.toLowerCase()),
  );
  const handleDownload = async (projectId, fileId, name) => {
    const res = await dispatch(downloadProjectFile({ projectId, fileId }));

    const blob = res.payload;

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = name || "download";

    document.body.appendChild(link);
    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);
  };
  const supervisorBucket = useMemo(() => {
    const map = new Map();
    (projects || []).forEach((p) => {
      if (!p?.supervisor?.name) return;
      const name = p.supervisor.name;
      map.set(name, (map.get(name) || 0) + 1);
    });
    const arr = Array.from(map.entries()).map(([name, count]) => ({
      name,
      count,
    }));
    arr.sort((a, b) => b.count - a.count);
    return arr;
  }, [projects]);

  const latestNotifications = useMemo(() => {
    return (notifications || []).slice(0, 6);
  }, [notifications]);

  const getBulletColor = (type, priority) => {
    const t = (type || "").toLowerCase();
    const p = (priority || "").toLowerCase();
    if (p === "high" && (t === "rejection" || t === "reject"))
      return "bg-red-600";
    if (p === "medium" && (t === "deadline" || t === "due"))
      return "bg-orange-500";
    if (p === "high") return "bg-red-500";
    if (p === "medium") return "bg-yellow-500";
    if (p === "low") return "bg-slate-400";
    // type-based fallback
    if (t === "approval" || t === "approved") return "bg-green-600";
    if (t === "request") return "bg-blue-600";
    if (t === "feedback") return "bg-purple-600";
    if (t === "meeting") return "bg-cyan-600";
    if (t === "system") return "bg-slate-600";
    return "bg-slate-400";
  };

  const getBadgeClasses = (kind, value) => {
    const v = (value || "").toLowerCase();
    if (kind === "type") {
      if (["rejection", "reject"].includes(v)) return "bg-red-100 text-red-800";
      if (["approval", "approved"].includes(v))
        return "bg-green-100 text-green-800";
      if (["deadline", "due"].includes(v))
        return "bg-orange-100 text-orange-800";
      if (v === "request") return "bg-blue-100 text-blue-800";
      if (v === "feedback") return "bg-purple-100 text-purple-800";
      if (v === "meeting") return "bg-cyan-100 text-cyan-800";
      if (v === "system") return "bg-slate-100 text-slate-800";
      return "bg-gray-100 text-gray-800";
    }
    // priority
    if (v === "high") return "bg-red-100 text-red-800";
    if (v === "medium") return "bg-yellow-100 text-yellow-800";
    if (v === "low") return "bg-gray-100 text-gray-800";
    return "bg-slate-100 text-slate-800";
  };

  const dashboardStats = [
    {
      title: "Total Students",
      value: stats?.totalStudents ?? 0,
      bg: "bg-blue-100",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      Icon: User,
    },
    {
      title: "Total Teachers",
      value: stats?.totalTeachers ?? 0,
      bg: "bg-green-100",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      Icon: Box,
    },
    {
      title: "Pending Requests",
      value: stats?.pendingRequests ?? 0,
      bg: "bg-orange-100",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      Icon: AlertCircle,
    },
    {
      title: "Active Projects",
      value: stats?.totalProjects ?? 0,
      bg: "bg-yellow-100",
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      Icon: Folder,
    },
    {
      title: "Nearing Deadlines",
      value: nearingDeadlines,
      bg: "bg-red-100",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      Icon: AlertTriangle,
    },
  ];

  const actionButtons = [
    {
      label: "Add Student",
      onClick: () => dispatch(toggleStudentModal()),
      btnClass: "btn-primary",
      Icon: PlusIcon, // lucide-react icon
    },
    {
      label: "Add Teacher",
      onClick: () => dispatch(toggleTeacherModal()),
      btnClass: "btn-secondary",
      Icon: PlusIcon,
    },
    {
      label: "View Reports",
      onClick: () => setIsReportsModelOpen(true),
      btnClass: "btn-outline",
      Icon: FileTextIcon,
    },
  ];

  return (
    <>
      <div className="space-y-6">
        {/* header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-blue-100">
            Manage the entire projects management system and oversee all
            activities.
          </p>
        </div>

        {/* stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {dashboardStats.map((item, i) => {
            return (
              <div className={`${item.bg} rounded-lg p-4`} key={i}>
                <div className="flex items-center ">
                  <div className={`p-2 ${item.iconBg} rounded-lg`}>
                    <item.Icon className={`w-6 h-6 ${item.iconColor}`} />
                  </div>

                  <div className="ml-3">
                    <p className={`text-sm font-medium text-slate-600`}>
                      {item.title}
                    </p>
                    <p className={`text-sm font-medium text-slate-800`}>
                      {item.value}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* charts and activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* vertical bar chart */}
          <div className="lg:col-span-2 card">
            <div className="card-header">
              <h3 className="card-title">Project Distribution by Supervisor</h3>
            </div>
            <div className="p-4">
              {supervisorBucket.length === 0 ? (
                <div className="h-64 flex items-center justify-center bg-slate-50 rounded text-slate-500">
                  No data
                </div>
              ) : (
                <div className="h-72 ">
                  <ResponsiveContainer width={"100%"} height={"100%"}>
                    <BarChart
                      data={supervisorBucket}
                      margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
                      barCategoryGap={"20%"}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis
                        dataKey={"name"}
                        tick={{ fontSize: 12, fill: "#334155" }}
                        axisLine={{ stroke: "#C8D5E1" }}
                        tickLine={{ stroke: "#C8D5E1" }}
                        interval={0}
                        height={50}
                        dy={10}
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fontSize: 12, fill: "#334155" }}
                        axisLine={{ stroke: "#C8D5E1" }}
                        tickLine={{ stroke: "#C8D5E1" }}
                      />
                      <Tooltip
                        cursor={{ fill: "rgba(99,102,241,0.05)" }}
                        contentStyle={{
                          borderRadius: 8,
                          borderColor: "#E2E8F0",
                        }}
                        formatter={(value, name) => {
                          (value,
                            name === "count" ? "Projects Assigned" : name);
                        }}
                        labelFormatter={(label) => `Supervisor: ${label}`}
                      />
                      <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                        {supervisorBucket.map((entry, index) => {
                          const colors = [
                            "#1E3ABA",
                            "#2563EB",
                            "#3B82F6",
                            "#6BA5FA",
                            "#93C5FO",
                          ];
                          return (
                            <Cell
                              key={`cell-${index}`}
                              fill={colors[index % colors.length]}
                            />
                          );
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Recent Activity</h3>
            </div>
            <div className="space-y-3">
              {latestNotifications?.map((n) => {
                return (
                  <div key={n._id} className="flex items-center text-sm">
                    <div
                      className={`mt-1 w-2 h-2 ${getBulletColor(n.type, n.priority)} rounded-full mr-3`}
                    />
                    <div className="flex-1">
                      <p className="font-medium text-slate-800">{n.message}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <span
                          className={`px-2 capitalize py-0.5 rounded text-sm font-medium ${getBadgeClasses("type", n.type)}`}>
                          {n.type}
                        </span>
                        <span
                          className={`px-2 py-0.5 ${getBulletColor(n.type, n.priority)}  capitalize rounded text-sm font-medium`}>
                          {n.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              {latestNotifications?.length === 0 && (
                <div className="text-slate-500 text-sm">
                  No recent notifications
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quick Actions</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {actionButtons.map((btn, index) => {
              return (
                <button
                  key={index}
                  className={`${btn.btnClass} flex items-center justify-center space-x-2`}
                  onClick={btn.onClick}>
                  <btn.Icon className="w-5 h-5 " /> <span>{btn.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {isReportsModelOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-3xl mx-4 max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-slate-900">
                  All Files
                </h3>
                <button
                  className="text-slate-400 hover:text-slate-600"
                  onClick={() => setIsReportsModelOpen(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  className="input w-full"
                  placeholder="Search by file name, project title, or student name"
                  value={reportSearch}
                  onChange={(e) => setReportSearch(e.target.value)}
                />
              </div>
              {filteredFiles.length === 0 ? (
                <div className="text-slate-500">No files found.</div>
              ) : (
                <div className="space-y-2">
                  {filteredFiles.map((f, i) => {
                    return (
                      <div
                        key={i}
                        className="felx items-center justify-between p-3 bg-slate-50 rounded">
                        <div>
                          <div className="font-medium text-slate-800">
                            {f.originalName}
                          </div>
                          <div className="text-sm text-slate-500">
                            {f.projectTitle}-{f.studentName}
                          </div>
                        </div>
                        <button
                          className="btn-outline btn-small"
                          onClick={() =>
                            handleDownload(
                              f.projectId,
                              f.fileId,
                              f.originalName,
                            )
                          }>
                          Download
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {isCreateStudentModalOpen && <AddStudent />}
        {isCreateTeacherModalOpen && <AddTeacher />}
      </div>
    </>
  );
};

export default AdminDashboard;
