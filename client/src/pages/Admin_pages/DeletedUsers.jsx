import React, { useEffect, useState } from 'react';
import axios from '../../axios.js';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

function DeletedUsers() {
  const [deletedUsers, setDeletedUsers] = useState([]);

  const fetchDeleted = async () => {
    try {
      const res = await axios.get('/admin/users', { withCredentials: true });
      const filtered = res.data.filter(user => user.isDeleted);
      setDeletedUsers(filtered);
    } catch (err) {
      toast.error('Failed to fetch deleted users');
    }
  };

  useEffect(() => {
    fetchDeleted();
  }, []);

  const handleRestore = async (id) => {
    try {
      await axios.post(`/admin/users/${id}/restore`, {}, { withCredentials: true });
      toast.success('User restored');
      setDeletedUsers(deletedUsers.filter(user => user._id !== id));
    } catch (err) {
      toast.error('Restore failed');
    }
  };

  const handlePermanentDelete = async (id) => {
    if (!window.confirm('This will permanently delete the user. Continue?')) return;
    try {
      await axios.delete(`/admin/users/${id}/permanent`, { withCredentials: true });
      toast.success('User permanently deleted');
      setDeletedUsers(deletedUsers.filter(user => user._id !== id));
    } catch (err) {
      toast.error('Permanent deletion failed');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Deleted Users</h2>
      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Email</th>
            <th className="border px-2 py-1 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {deletedUsers.map(user => (
            <tr key={user._id}>
              <td className="border px-2 py-1">
                <Link to={`/admin/user/${user._id}`} className="text-blue-600 hover:underline">{user.name}</Link>
              </td>
              <td className="border px-2 py-1">
                <Link to={`/admin/user/${user._id}`} className="text-blue-600 hover:underline">{user.email}</Link>
              </td>
              <td className="border px-2 py-1 text-center">
                <button
                  onClick={() => handleRestore(user._id)}
                  className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                >
                  Restore
                </button>
                <button
                  onClick={() => handlePermanentDelete(user._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete Permanently
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DeletedUsers;
