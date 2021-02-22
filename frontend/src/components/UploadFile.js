import React, { useState } from "react";
import { storage } from "../firebase";
import Api from "../helpers/Api.js";
var uuid = require("uuid");

export default function UploadFile() {
  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [url, setUrl] = useState("");
  const [progress, setProgress] = useState(0);

  const getNewUUID = () => {
    var oldName = selectedFile.name;
    var suffix = oldName.split(".")[1];
    var randomId = uuid.v4();
    var newName = randomId.toString() + "." + suffix;
    return newName;
  };

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsFilePicked(true);
  };

  const handleSubmission = () => {
    const newName = getNewUUID();
    const uploadTask = storage.ref(`images/${newName}`).put(selectedFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref("images")
          .child(newName)
          .getDownloadURL()
          .then((url) => {
            setUrl(url);
            Api.saveFileUrl(url);
            console.log(url);
          });
      }
    );
  };

  return (
    <div className="container">
      <div className="row">
        <input type="file" name="file" onChange={changeHandler} />
      </div>
      <div className="row">
        {isFilePicked ? (
          <div>
            <p>Filename: {selectedFile.name}</p>
            <p>Filetype: {selectedFile.type}</p>
            <p>Size in bytes: {selectedFile.size}</p>
          </div>
        ) : (
          <p>Select a file to show details</p>
        )}
      </div>
      <div className="row">
        <div>
          <button onClick={handleSubmission}>Submit</button>
        </div>
      </div>
      <div className="row">
        <progress value={progress} max="100" />
      </div>
      <div className="row">
        <img
          src={url || "http://via.placeholder.com/300"}
          alt="firebase-image"
        />
      </div>
    </div>
  );
}
