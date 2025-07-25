import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../axios';
import { toast } from 'react-toastify';

function AdminUserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/admin/users/${id}`, { withCredentials: true });
        setUser(res.data);
      } catch (err) {
        toast.error('Failed to fetch user details');
      }
    };
    fetchUser();
  }, [id]);

  const handleApprove = async () => {
    try {
      await axios.post(`/admin/users/${id}/approve`, {}, { withCredentials: true });
      toast.success('User approved');
      navigate('/admin');
    } catch (err) {
      toast.error('Approval failed');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.post(`/admin/users/${id}/soft-delete`, {}, { withCredentials: true });

      toast.success('User deleted');
      navigate('/admin');
    } catch (err) {
      toast.error('Deletion failed');
    }
  };

  const handleFinalize = async () => {
  try {
    await axios.post(`/admin/users/${id}/finalize`, {}, { withCredentials: true });
    toast.success('User finalized');
    navigate('/admin');
  } catch (err) {
    toast.error('Finalization failed');
  }
};


  if (!user) return <p className="text-center mt-10">Loading user...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">User Details</h2>
      <form className="grid grid-cols-1 gap-4">
        <input type="text" value={user.name || ''} disabled className="p-2 border rounded" />
        <input type="email" value={user.email} disabled className="p-2 border rounded" />
        <input type="number" value={user.age || ''} disabled className="p-2 border rounded" />
        <input type="text" value={user.type || ''} disabled className="p-2 border rounded" />
        <input type="text" value={user.date || ''} disabled className="p-2 border rounded" />
        <div className="flex gap-4 mt-4 flex-wrap">
            {!user.isApproved && (
                <button type="button" onClick={handleApprove} className="bg-green-500 text-white px-4 py-2 rounded">Approve</button>
            )}
            {user.isApproved && !user.isFinal && (
                <button type="button" onClick={handleFinalize} className="bg-blue-500 text-white px-4 py-2 rounded">Finalize</button>
            )}
            <button type="button" onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
            </div>

      </form>
    </div>
  );
}

export default AdminUserDetail;
