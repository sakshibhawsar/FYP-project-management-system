import {  useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddTeacher from "../../components/modal/AddTeacher";
import {
  deleteTeacher,
  updateTeacher,
} from "../../store/slices/adminSlice";
import { toggleTeacherModal } from "../../store/slices/popupSlice";
import { AlertTriangle, BadgeCheck, Plus, TriangleAlert, Users, X } from "lucide-react";

const ManageTeachers = () => {
  const { users } = useSelector((state) => state.admin);
  const { isCreateTeacherModalOpen } = useSelector((state) => state.popup);

  const [showModel, setShowModel] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [showDeleteModel, setShowDeleteModel] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    experties: "",
    maxStudents: 10,
  });

  const dispatch = useDispatch();

  const teachers = useMemo(() => {
   return (users || []).filter((user) => user.role?.toLowerCase() === "teacher");
  }, [users]);

  

  const departments = useMemo(() => {
    const set = new Set(
      (teachers || []).map((teacher) => teacher.department).filter(Boolean),
    );
    return Array.from(set);
  }, [teachers]);

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      (teacher.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (teacher.email || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterDepartment === "all" || teacher.department === filterDepartment;
    return matchesSearch && matchesFilter;
  });

  const handleCloseModal = () => {
    setShowModel(false);
    setEditingTeacher(null);
    setFormData({
      name: "",
      email: "",
      department: "",
      experties: "",
      maxStudents: 10,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingTeacher) {
      // dispatch update teacher action
      dispatch(updateTeacher({ id: editingTeacher._id, data: formData }));
    }

    handleCloseModal();

    console.log(formData);
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.name || "",
      email: teacher.email || "",
      department: teacher.department || "",
      experties: Array.isArray(teacher.experties)
        ? teacher.experties[0]
        : teacher.experties || "",
      maxStudents:
        typeof teacher.maxStudents === "number" ? teacher.maxStudents : 10,
    });
    setShowModel(true);
  };

  const handleDelete = (teacher) => {
    setTeacherToDelete(teacher);
    setShowDeleteModel(true);
  };

  const confirmDelete = () => {
    // dispatch delete teacher action
    if (teacherToDelete) {
      dispatch(deleteTeacher(teacherToDelete._id));
      setTeacherToDelete(null);
      setShowDeleteModel(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModel(false);
    setTeacherToDelete(null);
  };

  return (
    <>
      <div className="space-y-6">
        {/* header */}
        <div className="card">
          <div className="card-header flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="card-title">Manage Teachers</h1>
              <p className="card-subtitle">
                Add, edit, and manage teacher accounts
              </p>
            </div>

            <button
              onClick={() => dispatch(toggleTeacherModal())}
              className="btn-primary flex items-center space-x-2 mt-4 md:mt-0">
              <Plus className="w-5 h-5" />
              <span>Add New Teacher</span>
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
                <p className="text-sm text-slate-600">Total Teachers</p>
                <p className="text-lg text-slate-800 font-semibold">
                  {teachers.length}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center ">
              <div className="bg-blue-100 rounded-lg p-3">
                <BadgeCheck className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-slate-600">Assigned Students</p>
                <p className="text-lg text-slate-800 font-semibold">
                  {teachers.reduce(
                    (sum, t) => sum + (t.assignedStudents?.length || 0),
                    0,
                  )}
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
                <p className="text-sm text-slate-600">Departments</p>
                <p className="text-lg text-slate-800 font-semibold">
                  {departments.length}
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
                Search Teachers
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

        {/* teacher table */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Teachers List</h2>
          </div>
          <div className="overflow-x-auto">
            {filteredTeachers && filteredTeachers.length > 0 ? (
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                      Teacher Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                      Expertise
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                      Join Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-slate-200">
                  {filteredTeachers.map((teacher) => {
                    return (
                      <tr key={teacher._id} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-slate-900">
                              {teacher.name}
                            </div>
                            <div className="text-sm text-slate-500">
                              {teacher.email}
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-900 ">
                            {teacher.department || "-"}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          {Array.isArray(teacher.experties)
                            ? teacher.experties.join(", ")
                            : teacher.experties}
                        </td>

                        <td className="px-6 py-4">
                          <div className="text-sm text-slate-900">
                            {teacher.createdAt
                              ? new Date(teacher.createdAt).toLocaleString()
                              : "-"}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(teacher)}
                              className="text-blue-600 hover:text-blue-900">
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(teacher)}
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
              filteredTeachers.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-sm text-slate-500">
                    No teachers found matching your criteria.
                  </p>
                </div>
              )
            )}
          </div>

          {/* Edit teacher modal */}

          {showModel && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 ">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Edit Teacher
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

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Expertise
                    </label>

                    <select
                      className="input-field w-full py-1 border-b border-slate-600 focus:outline-none"
                      value={formData.experties}
                      onChange={(e) =>
                        setFormData({ ...formData, experties: e.target.value })
                      }>
                      <option value="Artificial Intelligence">
                        Artificial Intelligence
                      </option>
                      <option value="Machine Learning">Machine Learning</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Cybersecurity">Cybersecurity</option>
                      <option value="Cloud Computing">Cloud Computing</option>
                      <option value="Software Engineering">
                        Software Engineering
                      </option>
                      <option value="Web Development">Web Development</option>
                      <option value="Mobile App Development">
                        Mobile App Development
                      </option>
                      <option value="Database Systems">Database Systems</option>
                      <option value="Computer Network">Computer Network</option>
                      <option value="Operating Systems">Operating Systems</option>
                      <option value="Human-Computer Interaction">
                        Human-Computer Interaction
                      </option>
                      <option value="Big Data Analytics">Big Data Analytics</option>
                      <option value="Blockchain Technology">Blockchain Technology</option>
                      <option value="Internet of Things (IoT)">Internet of Things (IoT)</option>

                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Max Students
                    </label>
                    <input
                      type="number"
                      required
                      max={10}
                      min={1}
                      value={formData.maxStudents}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          maxStudents: e.target.value,
                        })
                      }
                      className="input-field w-full py-1 border-b border-slate-600 focus:outline-none"
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      className="btn-danger"
                      onClick={handleCloseModal}
                      type="button">
                      Cancel
                    </button>
                    <button className="btn-primary" type="submit">
                      Update Teacher
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {showDeleteModel && teacherToDelete && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-4 shadow-xl ">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 w-10 h-10 mx-auto flex items-center justify-center rounded-full bg-red-100">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="text-lg font-medium text-slate-900 mb-2">
                    Delete Teacher
                  </h3>
                  <p className="text-sm text-slate-500 mb-4">
                    Are you sure you want to delete{""}
                    <span className="font-semibold">
                      {" "}
                      {teacherToDelete.name}? This action cannot be undone.
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

          {isCreateTeacherModalOpen && <AddTeacher />}
        </div>
      </div>
    </>
  );
};

export default ManageTeachers;
