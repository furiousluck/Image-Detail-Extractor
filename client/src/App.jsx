import { useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  const [previewURL, setPreviewURL] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isServerReady, setServerReady] = useState(false);


  const checkServerStatus = () => {
    axios.get('https://img-detail-extractor.onrender.com/status')
      .then(() => {
        setServerReady(true);
      })
      .catch(() => {
        setTimeout(checkServerStatus, 1000);
      });
  };

  

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    if(e.target.files[0].size > 20*1024*1024){
      setPreviewURL('')
      setErrorMessage('File is too large to display. Maximum size allowed to display is 20 MB.')
      return;
    }else{
      const previewURL = URL.createObjectURL(e.target.files[0])
      setPreviewURL(previewURL)
      setErrorMessage('')
    }
  };

  const handleStatus = () =>{
    checkServerStatus();
  }


  const handleUpload = () => {
    if (!file) {
      console.log('Please select a file before uploading.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    axios.post('https://img-detail-extractor.onrender.com/upload', formData,{
      onUploadProgress:(progressEvent)=>{
        const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
        setUploadProgress(progress);
      }
    })
      .then(res => {
        console.log(res);
        setUploadResult(res.data); // Assuming the server sends data as JSON
        setUploadProgress(0);
      })
      .catch(err => {
        console.error(err);
        setUploadResult(null);
        setUploadProgress(0);
      });
  };

  return (
    <div>
      <div>
        <h1>Image Details Extractor🖼️</h1>
        <br />
        {!isServerReady ? (
          <div>
            <p>Server is starting, please wait...</p>
            <button onClick={handleStatus}>Refresh Server! Click Me!</button>
          </div>
        )
        :uploadProgress >0 ?(
          <div>
          <p>Uploading... {uploadProgress}%</p>
          {/* You can style the loading bar as needed */}
          <div style={{ width: `${uploadProgress}%`, height: '10px', backgroundColor: 'green' }}></div>
        </div>
        ):(
          <div>
            <input id='upload-name' type='file' onChange={handleFileChange} />
            <br />
            <button onClick={handleUpload}>Upload</button>
          </div>
        )}
      </div>
      <br/>
      <div className='result'>
        <div className='result-1'>
        {previewURL && <img src={previewURL} alt='Preview' style={{ maxWidth: '100%', height: '100%' }} />}
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
        <div className='result-2'>
  {/* Display the upload result */}
  {uploadResult && (
    <div>
      <div className='result-2-p'>
        <p><strong>About Image:</strong></p>
        <p><strong>Lens:</strong> {uploadResult.lens}</p>
        <p><strong>AF Mode:</strong> {uploadResult.lensaf}</p>
        <p><strong>Creation Date:</strong> {uploadResult.creatdate}</p>
        <p><strong>ISO:</strong> {uploadResult.iso}</p>
        <p><strong>Shutter Speed:</strong> {uploadResult.shutterspeed}</p>
        <p><strong>Max Aperture:</strong> {uploadResult.maxaperture}</p>
        <p><strong>Artist:</strong> {uploadResult.artist}</p>
        <p><strong>Image Size:</strong> {uploadResult.imagesize}</p>
        <p><strong>White Balance:</strong> {uploadResult.whitebalance}</p>
        <p><strong>Rating:</strong> {uploadResult.rating}</p>
        <p><strong>Color:</strong> {uploadResult.color}</p>
        <p><strong>Camera:</strong> {uploadResult.camera}</p>
      </div>
    </div>
  )}
</div>

      </div>
    </div>
  );
}

export default App;
