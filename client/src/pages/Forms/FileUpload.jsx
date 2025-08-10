// FileUpload.jsx
import React, { useState } from 'react';
import axios from '../../axios.js'; // Adjust path to your axios instance

const FileUpload = ({ nic, selectedPost, onUpload }) => {
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState('');

  const handleChange = (e) => {
    setFile(e.target.files[0]);
    setMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setMsg('Please select a file');
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('/auth/submit-file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      setMsg('File uploaded successfully');
      setFile(null);
      if (onUpload) onUpload();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Upload failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto mt-8">
      <input type="file" onChange={handleChange} />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Upload</button>
      {msg && <div className="text-center text-sm mt-2">{msg}</div>}
    </form>
  );
};

export default FileUpload;