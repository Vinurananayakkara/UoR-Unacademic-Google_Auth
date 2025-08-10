// FileList.jsx
import React, { useEffect, useState } from 'react';
import axios from '../../axios.js';

const FileList = ({ nic, selectedPost, refresh }) => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (!nic || !selectedPost) return;
    axios.get(`/auth/list-files/${nic}/${selectedPost}`, { withCredentials: true })
      .then(res => setFiles(res.data.files || []))
      .catch(() => setFiles([]));
  }, [nic, selectedPost, refresh]);

  if (!nic || !selectedPost) return null;

  return (
    <div className="mt-4">
      <h4 className="font-semibold mb-2">Uploaded Files</h4>
      <ul>
        {files.map(f => (
          <li key={f}>
            <a
              href={`http://localhost:5000/uploads/${nic}/${selectedPost}/${f}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              {f}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileList;