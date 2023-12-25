import React, { useState } from 'react';
import axios from 'axios';

function FUpload() {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('fileinput', file);

        try {
            const response = await axios.post('http://localhost:3001/file.upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Success:', response);
        } catch (error) {
            console.error('Error:', error);
        }
    };
    const bodyStyle = {
        backgroundColor: "#17171e",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        paddingTop: 70,
        paddingBottom: 0,
      };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    return (
        <form style={bodyStyle} onSubmit={handleSubmit}>
            <label>
                제목:
                <input type="text" value={title} onChange={handleTitleChange} />
            </label>
            <label>
                파일:
                <input type="file" onChange={handleFileChange} />
            </label>
            <button type="submit">업로드</button>
        </form>
    );
}

export default FUpload;
