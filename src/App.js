import imag from './cloud.png';
import './App.css';
import React from 'react';
// import ReactS3 from 'react-s3'
// import S3 from 'react-aws-s3'
import { useEffect, useRef, useState } from 'react';
import { Amplify} from "aws-amplify";
import { Storage } from 'aws-amplify';


// const config = {
//   accessKeyId: 'AKIARP76KWTXZEGRKVXD',
//   secretAccessKey: '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',
//   region: 'ap-south-1',
//   bucketName: 'miniproj1',
// }
function App() {
  var nme = "Madhavan"

  const ref = useRef(null);
  const [files, setFiles] = useState([]);
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState();

  useEffect(() => {
    Amplify.configure({
      Auth: {
        identityPoolId: "ap-south-1:cc9d968c-d933-4224-a5c2-7d7cb70fc6d9",
        region: "ap-south-1",
      },

      Storage: {
        AWSS3: {
          bucket: "miniproj1",
          region: "ap-south-1",
        },
      },
    });
  }, []);

  const loadImages = () => {
    Storage.list("")
      .then((files) => {
        console.log(files);
        setFiles(files);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    loadImages();
  }, []);

  const handleFileLoad = () => {
    const filename = ref.current.files[0].name;
    Storage.put(filename, ref.current.files[0], {
      progressCallback: (progress) => {
        setProgress(Math.round((progress.loaded / progress.total) * 100) + "%");
        setTimeout(() => { setProgress() }, 1000);
      }
    })
      .then(resp => {
        console.log(resp);
        loadImages();
      }).catch(err => { console.log(err); });
  }

  const handleShow = (file) => {
    Storage.get(file).then(resp => {
      console.log(resp);
      setImage(resp)
    }).catch(err => { console.log(err); });
  }

  const handleDelete = (file) => {
    Storage.remove(file).then(resp => {
      console.log(resp);
      loadImages();
    }).catch(err => { console.log(err); });
  }





  // const [file, setFile] = useState()
  // const handleFileInput = (e) => {
  //   setFile(e.target.files[0]);
  // }

  // const uploadfile = async (file) => {
  //   const ReactS3Client = new S3(config);
  //   ReactS3Client.uploadFile(file, file.name).then(data => {
  //     console.log(data.location)
  //   })
  // }
  // function handleSubmit(event) {
  //   event.preventDefault()
  //   const url = 'http://localhost:3000/uploadFile';
  //   const formData = new FormData();
  //   formData.append('file', file);
  //   formData.append('fileName', file.name);
  //   const config = {
  //     headers: {
  //       'content-type': 'multipart/form-data',
  //     },
  //   };
  //   axios.post(url, formData, config).then((response) => {
  //     console.log(response.data);
  //   });
  // }


  return (
    <div className="App">
      <h1>Welcome {nme}</h1>
      <div className='box'>
        <div className="card one">
          <img src={imag} alt="" />
          <div className="container">
            <h4><b>Upload</b></h4>
            <form id="fileform" >
              {/* <input type="file" id="myFile" name="filename" onChange={handleFileInput} /> */}
              <input ref={ref} type="file" onChange={handleFileLoad} />
              {progress}
              <table>
                <thead>
                  <tr>
                    <td></td>
                    <td>Name</td>
                    <td>Action</td>
                  </tr>
                </thead>
                <tbody>
                  {files.map((file, i) => (
                    <tr key={file.key}>
                      <td>{i}</td>
                      <td>{file.key}</td>
                      <td>
                        <button onClick={() => handleShow(file.key)}>Show</button>
                        <button onClick={() => handleDelete(file.key)}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <img src={image} alt="" width="600"/>
              <div className='btn'>
                {/* <input type="submit" id='subbtn' onClick={() => uploadfile(file)} /> */}
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="vertical"></div>
      <div className='boxr'>
        <div className="card two">
          <img src={imag} alt="" />
          <div className="container">
            <h4><b>Retrieve</b></h4>
            <form id=''>
              <p>Link:</p>
              <input type="text" id="txt" />
              <div className='btn'>
                <input type="submit" id='subbtn' />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
export default App;
