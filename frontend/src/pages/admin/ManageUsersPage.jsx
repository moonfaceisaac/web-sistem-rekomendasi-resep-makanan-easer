import { useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import ConfirmModal from "../../components/common/Modal";
import { useEffect } from "react";
import { getUsers } from "../../services/adminService";
import { deleteUser } from "../../services/adminService";
import { useToast } from "../../hooks/useToast";
import { getFriendlyApiError } from "../../utils/httpError";
import Pagination from "../../components/common/Pagination";

export default function ManageUsersPage() {
  const [query, setQuery] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [deletingUser, setDeletingUser] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const toast = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     fetchUsers();
  //   }, 300);

  //   return () => clearTimeout(timeout);
  // }, [query]);

  async function fetchUsers() {
    try {
      const data = await getUsers(query, currentPage, 10);

      setUsers(data.users);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(timeout);
  }, [query, currentPage]);

  const handleConfirmDelete = async() => {
    if (deletingUser){
      return
    }
    setDeletingUser(true);
    try{
      await deleteUser(deleteTarget.user_id);
      setUsers(users.filter((u) => u.user_id !== deleteTarget.user_id))
      setDeleteTarget(null);
      toast.success("User deleted successfully.");
    }catch(err){
      toast.error(getFriendlyApiError(err, "Failed to delete user."));
    }finally{
      setDeletingUser(false);
    }
    // setUsers(users.filter((u) => u.id !== deleteTarget.id));
    // setDeleteTarget(null);
    // // TODO: userService.deleteUser(deleteTarget.id)
  };

  return (
    <AdminLayout>
      {deleteTarget && (
        <ConfirmModal
          message="Are you sure you want to delete this user?"
          title={deleteTarget.namaLengkap}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-800">Users</h1>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <div className="relative mb-4">
          <svg
            className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Find your user"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-gray-500 text-left">
              <th className="py-2 px-3 font-medium w-12">ID</th>
              <th className="py-2 px-3 font-medium">Nama Lengkap</th>
              <th className="py-2 px-3 font-medium text-center">E-mail</th>
              <th className="py-2 px-3 font-medium text-center w-24">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.user_id}
                className="border-b border-gray-50 hover:bg-gray-50 transition"
              >
                <td className="py-3 px-3 text-gray-400">{user.user_id}</td>
                <td className="py-3 px-3 text-gray-700">{user.namaLengkap}</td>
                <td className="py-3 px-3 text-center">
                  <a
                    href={`mailto:${user.email}`}
                    className="text-blue-500 hover:underline"
                  >
                    {user.email}
                  </a>
                </td>
                <td className="py-3 px-3 text-center">
                  <button
                    onClick={() => setDeleteTarget(user)}
                    className="bg-gray-900 text-white text-xs px-4 py-1.5 rounded-lg hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="py-8 text-center text-gray-300 text-sm"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="mt-4 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
