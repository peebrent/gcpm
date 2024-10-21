import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const ImageUpload = ({ onUploadSuccess }) => {
  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onUploadSuccess(response.data.imageUrl);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }, [onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} style={dropzoneStyles}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the image here ...</p> :
          <p>Drag 'n' drop an image here, or click to select one</p>
      }
    </div>
  );
};

const dropzoneStyles = {
  border: '2px dashed #cccccc',
  borderRadius: '4px',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer'
};

export default ImageUpload;