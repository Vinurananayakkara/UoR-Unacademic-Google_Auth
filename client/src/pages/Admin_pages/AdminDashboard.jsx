import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../axios';
import { toast } from 'react-toastify';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('all');

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/admin/users', { withCredentials: true });
      setUsers(res.data);
    } catch (err) {
      toast.error('Failed to fetch users');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateUser = (id, updatedUser) => {
    setUsers(prev => prev.map(u => (u._id === id ? updatedUser : u)));
  };

  const removeUser = (id) => {
    setUsers(prev => prev.filter(u => u._id !== id));
  };

  const toggleAdmin = async (id, isAdmin) => {
    try {
      const res = await axios.put(`/admin/users/${id}`, { isAdmin }, { withCredentials: true });
      updateUser(id, res.data.user);
      toast.success('Admin status updated');
    } catch (err) {
      toast.error('Failed to update admin status');
    }
  };

  const approveUser = async (id) => {
    try {
      const res = await axios.post(`/admin/users/${id}/approve`, {}, { withCredentials: true });
      updateUser(id, res.data.user);
      toast.success('User approved');
    } catch (err) {
      toast.error('Failed to approve user');
    }
  };

  const finalizeUser = async (id) => {
    try {
      const res = await axios.post(`/admin/users/${id}/finalize`, {}, { withCredentials: true });
      updateUser(id, res.data.user);
      toast.success('User finalized');
    } catch (err) {
      toast.error('Failed to finalize user');
    }
  };

  const softDelete = async (id) => {
    if (!window.confirm('Soft delete this user?')) return;
    try {
      await axios.post(`/admin/users/${id}/soft-delete`, {}, { withCredentials: true });

      updateUser(id, res.data.user);
      toast.success('User soft-deleted');
    } catch (err) {
      toast.error('Soft delete failed');
    }
  };

  const restoreUser = async (id) => {
    try {
      const res = await axios.post(`/admin/users/${id}/restore`, {}, { withCredentials: true });
      updateUser(id, res.data.user);
      toast.success('User restored');
    } catch (err) {
      toast.error('Restore failed');
    }
  };

  const permanentDelete = async (id) => {
    if (!window.confirm('Permanently delete this user?')) return;
    try {
      await axios.delete(`/admin/users/${id}/permanent`, { withCredentials: true });
      removeUser(id);
      toast.success('User permanently deleted');
    } catch (err) {
      toast.error('Permanent delete failed');
    }
  };

  const filteredUsers = users.filter(user => {
    if (filter === 'all') return !user.isDeleted && !user.isApproved && !user.isFinal;
    if (filter === 'approved') return user.isApproved && !user.isDeleted;
    if (filter === 'final') return user.isFinal && !user.isDeleted;
    if (filter === 'deleted') return user.isDeleted;
    return true;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

      <nav className="mb-6 flex space-x-6 border-b pb-2 text-sm font-semibold">
        {['all', 'approved', 'final', 'deleted'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`pb-1 ${
              filter === tab ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            {tab === 'all' ? 'Users' : tab === 'approved' ? 'Approved Users' : tab === 'final' ? 'Final Users' : 'Deleted Users'}
          </button>
        ))}
      </nav>

      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="border px-2 py-1">Email</th>
            <th className="border px-2 py-1 text-center">Admin</th>
            <th className="border px-2 py-1 text-center">Approved</th>
            <th className="border px-2 py-1 text-center">Final</th>
            <th className="border px-2 py-1 text-center">Deleted</th>
            <th className="border px-2 py-1 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-4 text-gray-500">
                No users to display
              </td>
            </tr>
          ) : (
            filteredUsers.map(user => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="border px-2 py-1">
                  <Link
                    to={`/admin/user/${user._id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {user.email}
                  </Link>
                </td>
                <td className="border px-2 py-1 text-center">
                  <input
                    type="checkbox"
                    checked={!!user.isAdmin}
                    disabled={user.isDeleted}
                    onChange={() => toggleAdmin(user._id, !user.isAdmin)}
                  />
                </td>
                <td className="border px-2 py-1 text-center">
                  {user.isApproved ? '✅' : filter === 'all' && !user.isDeleted ? (
                    <button
                      onClick={() => approveUser(user._id)}
                      className="text-blue-600 hover:underline text-xs"
                    >
                      Approve
                    </button>
                  ) : '—'}
                </td>
                <td className="border px-2 py-1 text-center">
                  {user.isFinal ? '✅' : filter !== 'deleted' && !user.isDeleted ? (
                    <button
                      onClick={() => finalizeUser(user._id)}
                      className="text-purple-600 hover:underline text-xs"
                    >
                      Finalize
                    </button>
                  ) : '—'}
                </td>
                <td className="border px-2 py-1 text-center">{user.isDeleted ? '🗑️' : '—'}</td>
                <td className="border px-2 py-1 text-center space-x-2">
                  {!user.isDeleted ? (
                    <button
                      onClick={() => softDelete(user._id)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded text-xs"
                    >
                      Soft Delete
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => restoreUser(user._id)}
                        className="bg-green-600 text-white px-2 py-1 rounded text-xs"
                      >
                        Restore
                      </button>
                      <button
                        onClick={() => permanentDelete(user._id)}
                        className="bg-red-600 text-white px-2 py-1 rounded text-xs"
                      >
                        Delete Forever
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
