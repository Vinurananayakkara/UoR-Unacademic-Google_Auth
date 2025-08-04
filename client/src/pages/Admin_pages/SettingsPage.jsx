import { useEffect, useState } from 'react';
import { useUserInfo } from '../../context/UserInfoContext';
import axios from '../../axios';

function SettingsPage() {
  const { formData, setFormData,closingDateFromBackend, setClosingDateFromBackend} = useUserInfo();
  const [loading, setLoading] = useState(false);


  // Fetch posts
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/admin/get-posts');
      if (res.data?.addPosts) {
        setFormData((prev) => ({ ...prev, addPosts: res.data.addPosts }));
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      alert('Could not load posts.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch closing date
  const fetchClosingDate = async () => {
    try {
      const res = await axios.get('/admin/get-closing-date');
      if (res.data?.closingDate) {
        setClosingDate(res.data.closingDate);
      }
    } catch (err) {
      console.error('Failed to fetch closing date:', err);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchClosingDate();
  }, []);

  const addGradeRow = () => {
    const updated = [...(formData.addPosts || [])];
    const hasEmptyRow = updated.some((row) => row.createddate === '');
    if (hasEmptyRow) {
      alert('Please fill the existing empty date before adding a new one.');
      return;
    }
    updated.push({ createddate: '', createdposts: [''] });
    setFormData((prev) => ({ ...prev, addPosts: updated }));
  };

  const updateDate = (index, value) => {
    const updated = [...(formData.addPosts || [])];
    updated[index].createddate = value;
    setFormData((prev) => ({ ...prev, addPosts: updated }));
  };

  const updatePost = (rowIndex, postIndex, value) => {
    const updated = [...(formData.addPosts || [])];
    updated[rowIndex].createdposts[postIndex] = value;
    setFormData((prev) => ({ ...prev, addPosts: updated }));
  };

  const addPostField = (rowIndex) => {
    const updated = [...(formData.addPosts || [])];
    updated[rowIndex].createdposts.push('');
    setFormData((prev) => ({ ...prev, addPosts: updated }));
  };

  const deleteDateRow = async (rowIndex) => {
    const dateToDelete = formData.addPosts[rowIndex].createddate;
    if (!window.confirm(`Are you sure you want to delete posts on ${dateToDelete}?`)) return;

    try {
      await axios.delete(`/admin/delete-post/${dateToDelete}`);
      alert(`Posts on ${dateToDelete} deleted successfully.`);
      fetchPosts();
    } catch (err) {
      console.error('Error deleting date:', err);
      alert('Failed to delete posts for this date.');
    }
  };

  const deletePostField = (rowIndex, postIndex) => {
    const updated = [...(formData.addPosts || [])];
    updated[rowIndex].createdposts.splice(postIndex, 1);
    setFormData((prev) => ({ ...prev, addPosts: updated }));
  };

  const handleSavePosts = async () => {
    try {
      const cleanedPosts = (formData.addPosts || []).filter(
        (group) => group.createddate && group.createdposts.some((post) => post.trim() !== '')
      );

      if (!cleanedPosts.length) {
        alert('Please add at least one valid date with at least one post.');
        return;
      }

      const res = await axios.post('/admin/get-posts', { addPosts: cleanedPosts });

      alert(res.data.message || 'Posts saved successfully!');
      setFormData((prev) => ({ ...prev, addPosts: [] }));
      fetchPosts();
    } catch (err) {
      console.error('Error saving posts:', err);
      alert('Failed to save posts.');
    }
  };

  const handleClosingDate = async () => {
    try {
      const res = await axios.post('/admin/closing-date', { closingDate: formData.closingDate });
      alert(res.data.message || 'Closing date saved!');
      setFormData((prev) => ({ ...prev, closingDate: '' }));
      fetchClosingDate();
    } catch (err) {
      alert('Failed to save closing date');
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 px-4 py-8">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-4xl">
        <h1 className="text-lg font-bold mb-4">Add Posts by Date</h1>

        {(formData.addPosts || []).map((row, rowIndex) => (
          <div key={rowIndex} className="border p-4 rounded-lg bg-gray-50 mb-4 relative">
            <div className="absolute top-2 right-2">
              <button
                onClick={() => deleteDateRow(rowIndex)}
                className="text-red-500 text-sm hover:underline"
              >
                🗑 Delete Date
              </button>
            </div>

            <div className="mb-2">
              <label className="font-semibold">Date:</label>
              <input
                type="date"
                value={row.createddate}
                onChange={(e) => updateDate(rowIndex, e.target.value)}
                className="w-full px-2 py-1 border rounded"
              />
            </div>

            <div className="mb-2">
              <label className="font-semibold">Posts:</label>
              {row.createdposts.map((post, postIndex) => (
                <div key={postIndex} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={post}
                    onChange={(e) => updatePost(rowIndex, postIndex, e.target.value)}
                    className="w-full px-2 py-1 border rounded"
                  />
                  <button
                    onClick={() => deletePostField(rowIndex, postIndex)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    ✖
                  </button>
                </div>
              ))}
              <button
                onClick={() => addPostField(rowIndex)}
                className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
              >
                + Add Another Post
              </button>
            </div>
          </div>
        ))}

        <button
          onClick={addGradeRow}
          className="bg-blue-500 text-white px-6 py-2 rounded mt-4 hover:bg-blue-600"
        >
          + Add New Date Row
        </button>
      </div>

      <button
        onClick={handleSavePosts}
        className="bg-purple-500 text-white px-6 py-2 rounded mt-6 hover:bg-purple-700"
      >
        💾 Save Posts to Backend
      </button>

      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-2xl mt-10">
        <h3 className="text-lg font-bold mb-4">Closing Date</h3>
        <input
          type="date"
          value={formData.closingDate}
          onChange={(e) => setFormData({ ...formData, closingDate: e.target.value })}
          className="border px-4 py-2 rounded mb-3 w-full"
        />
        <button
          onClick={handleClosingDate}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Save Closing Date
        </button>
      </div>
    </div>
  );
}

export default SettingsPage;
