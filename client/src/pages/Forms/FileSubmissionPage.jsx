import React, { useEffect, useState } from 'react';
import axios from '../../axios.js';
import FileUpload from './FileUpload';
import FileList from './FileList';
import { useNavigate } from 'react-router-dom';

const FileSubmissionPage = () => {
  const [nic, setNic] = useState('');
  const [selectedPost, setSelectedPost] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/auth/user-info', { withCredentials: true })
      .then(res => {
        setNic(res.data.nic);
        setSelectedPost(res.data.selectedPost);
      });
  }, []);

  useEffect(() => {
    if (uploadSuccess) {
      navigate('/');
    }
  }, [uploadSuccess, navigate]);

  if (!nic || !selectedPost) return <div>Loading...</div>;

  return (
    <div>
      <FileUpload
        nic={nic}
        selectedPost={selectedPost}
        onUpload={() => {
          setRefresh(r => !r);
          setUploadSuccess(true);
        }}
      />
      <FileList nic={nic} selectedPost={selectedPost} refresh={refresh} />
    </div>
  );
};

export default FileSubmissionPage;