import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddStudent from "../../components/modal/AddStudent";
import { deleteStudent, updateStudent } from "../../store/slices/adminSlice";
import {
  AlertTriangle,
  CheckCircle,
  Plus,
  TriangleAlert,
  Users,
  X,
} from "lucide-react";
import { toggleStudentModal } from "../../store/slices/popupSlice";

const ManageStudents = () => {
  const { users, projects } = useSelector((state) => state.admin);
  const { isCreateStudentModalOpen } = useSelector((state) => state.popup);

  const [showModel, setShowModel] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [showDeleteModel, setShowDeleteModel] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
  });

  const dispatch = useDispatch();

  const students = useMemo(() => {
    const studentUsers = (users || []).filter(
      (user) => user.role?.toLowerCase() === "student",
    );
    return studentUsers.map((student) => {
      const studentProject = (projects || []).find(
        (p) =>
          p.student === student._id ||
          p.student?._id === student._id ||
          String(p.student) === String(student._id),
      );

      return {
        ...student,
        projectTitle: studentProject?.title || null,
        supervisor: studentProject?.supervisor || null,
        projectStatus: studentProject?.status || null,
      };
    });
  }, [users, projects]);

  const departments = useMemo(() => {
    const set = new Set(
      (students || [])
        .map((student) => student.academicDetails?.department)
        .filter(Boolean),
    );
    return Array.from(set);
  }, [students]);

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      (student.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.email || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterDepartment === "all" ||
      student.academicDetails?.department === filterDepartment;
    return matchesSearch && matchesFilter;
  });

  const handleCloseModal = () => {
    setShowModel(false);
    setEditingStudent(null);
    setFormData({
      name: "",
      email: "",
      department: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingStudent) {
      // dispatch update student action
      dispatch(updateStudent({ id: editingStudent._id, data: formData }));
    }
    handleCloseModal();
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name || "",
      email: student.email || "",
      department: student.academicDetails?.department || "",
    });
    setShowModel(true);
  };

  const handleDelete = (student) => {
    setStudentToDelete(student);
    setShowDeleteModel(true);
  };

  const confirmDelete = () => {
    // dispatch delete student action
    if (studentToDelete) {
      dispatch(deleteStudent(studentToDelete._id));
      setStudentToDelete(null);
      setShowDeleteModel(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModel(false);
    setStudentToDelete(null);
  };

  return (
    <>
      <div className="space-y-6">
        {/* header */}
        <div className="card">
          <div className="card-header flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="card-title">Manage Students</h1>
              <p className="card-subtitle">
                Add, edit, and manage student accounts
              </p>
            </div>

            <button
              onClick={() => dispatch(toggleStudentModal())}
              className="btn-primary flex items-center space-x-2 mt-4 md:mt-0">
              <Plus className="w-5 h-5" />
              <span>Add New Student</span>
            </button>
          </div>
        </div>

        {/* stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <div className="flex items-center ">
              <div className="bg-blue-100 rounded-lg p-3">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-slate-600">Total Students</p>
                <p className="text-lg text-slate-800 font-semibold">
                  {students.length}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center ">
              <div className="bg-blue-100 rounded-lg p-3">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-slate-600">Completed Projects</p>
                <p className="text-lg text-slate-800 font-semibold">
                  {
                    students.filter((s) => s.projectStatus === "completed")
                      .length
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center ">
              <div className="bg-blue-100 rounded-lg p-3">
                <TriangleAlert className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-slate-600">Unassigned</p>
                <p className="text-lg text-slate-800 font-semibold">
                  {students.filter((s) => !s.supervisor).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* filter */}
        <div className="card">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Search Students
              </label>
              <input
                type="text"
                className="input-field w-full outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or email..."
              />
            </div>

            <div className="w-full md:w-48 ">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Filter Status
              </label>
              <select
                className="input-field w-full"
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}>
                <option value="all">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* students table */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Students List</h2>
          </div>
          <div className="overflow-x-auto">
            {filteredStudents && filteredStudents.length > 0 ? (
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                      Student Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                      Department & Year
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                      Supervisor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                      Project Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-slate-200">
                  {filteredStudents.map((student) => {
                    return (
                      <tr key={student._id} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-slate-900">
                              {student.name}
                            </div>
                            <div className="text-sm text-slate-500">
                              {student.email}
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-900 ">
                            {student.academicDetails?.department || "-"}
                          </div>
                          <div className="text-sm text-slate-500">
                            {student.createdAt
                              ? new Date(student.createdAt).getFullYear()
                              : "-"}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          {student.supervisor ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-green-800 bg-gray-100 text-xs font-medium">
                              {student.supervisor.name}
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-red-800 bg-red-100 text-xs font-medium">
                              {student.projectStatus === "rejected"
                                ? "Rejected"
                                : "Not Assigned"}
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <div className="text-sm text-slate-900">
                            {student?.projectTitle || "-"}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(student)}
                              className="text-blue-600 hover:text-blue-900">
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(student)}
                              className="text-red-600 hover:text-red-900">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              filteredStudents.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-sm text-slate-500">
                    No students found matching your criteria.
                  </p>
                </div>
              )
            )}
          </div>

          {/* Edit student modal */}

          {showModel && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 ">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Edit Student
                  </h3>
                  <button
                    className="text-slate-400 hover:to-slate-600"
                    onClick={handleCloseModal}>
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="input-field w-full py-1 border-b border-slate-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="input-field w-full py-1 border-b border-slate-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Department
                    </label>

                    <select
                      className="input-field w-full py-1 border-b border-slate-600 focus:outline-none"
                      value={formData.department}
                      onChange={(e) =>
                        setFormData({ ...formData, department: e.target.value })
                      }>
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
                      <option value="Civil Engineering">
                        Civil Engineering
                      </option>
                      <option value="Business Administration">
                        Business Administration
                      </option>
                      <option value="Economics">Economics </option>
                      <option value="Psychology">Psychology</option>
                    </select>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      className="btn-danger"
                      onClick={handleCloseModal}
                      type="button">
                      Cancel
                    </button>
                    <button className="btn-primary" type="submit">
                      Update Student
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {showDeleteModel && studentToDelete && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-4 shadow-xl ">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 w-10 h-10 mx-auto flex items-center justify-center rounded-full bg-red-100">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="text-lg font-medium text-slate-900 mb-2">
                    Delete Student
                  </h3>
                  <p className="text-sm text-slate-500 mb-4">
                    Are you sure you want to delete{""}
                    <span className="font-semibold">
                      {" "}
                      {studentToDelete.name}? This action cannot be undone.
                    </span>
                  </p>

                  <div className="flex justify-center space-x-3">
                    <button className="btn-secondary" onClick={cancelDelete}>
                      Cancel
                    </button>
                    <button className="btn-danger" onClick={confirmDelete}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isCreateStudentModalOpen && <AddStudent />}
        </div>
      </div>
    </>
  );
};

export default ManageStudents;
