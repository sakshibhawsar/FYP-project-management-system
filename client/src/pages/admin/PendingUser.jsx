import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPendingUsers, approveUser } from "../../store/slices/adminSlice";

const PendingUser = () => {
  const dispatch = useDispatch();
  const { pendingUsers, loading } = useSelector((state) => state.admin);

  const [roles, setRoles] = useState({});

  useEffect(() => {
    dispatch(getPendingUsers());
  }, [dispatch]);

  const handleApprove = (userId) => {
    const role = roles[userId] || "Student";
    dispatch(approveUser({ userId, role }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <h1 className="text-xl font-bold text-slate-800">
          Pending Users Approval
        </h1>
        <p className="text-slate-500 text-sm">
          Approve new users and assign roles
        </p>
      </div>

      {/* Table */}
      <div className="card overflow-x-auto">
        {loading ? (
          <p className="text-center py-6">Loading...</p>
        ) : pendingUsers?.length === 0 ? (
          <p className="text-center py-6 text-slate-500">
            No pending users found
          </p>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm">Name</th>
                <th className="px-6 py-3 text-left text-sm">Email</th>
                <th className="px-6 py-3 text-left text-sm">Select Role</th>
                <th className="px-6 py-3 text-left text-sm">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {pendingUsers.map((user) => (
                <tr key={user._id} className="hover:bg-slate-50">
                  {/* Name */}
                  <td className="px-6 py-3">{user.name}</td>

                  {/* Email */}
                  <td className="px-6 py-3">{user.email}</td>

                  {/* Role dropdown */}
                  <td className="px-6 py-3">
                    <select
                      className="input"
                      value={roles[user._id] || "Student"}
                      onChange={(e) =>
                        setRoles({
                          ...roles,
                          [user._id]: e.target.value,
                        })
                      }>
                      <option value="Student">Student</option>
                      <option value="Teacher">Teacher</option>
                    </select>
                  </td>

                  {/* Approve button */}
                  <td className="px-6 py-3">
                    <button
                      onClick={() => handleApprove(user._id)}
                      className="btn-primary">
                      Approve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PendingUser;
