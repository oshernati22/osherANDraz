import React, { useEffect, useState } from "react";
import "./form.css";
import { parse } from "papaparse";
import Dropzone from "react-dropzone";
import PatternsProcessor from "../PatternsProcessor.js";

function Form() {
  const [highlighted, setHighlighted] = useState(false);
  const [fileData, setFileData] = useState();

  useEffect(() => {
    if (fileData) {
      setHighlighted(false);
    }
  }, [fileData]);

  return (
    <>
      <div className="form_container">
        <div className="form_head">Shoting Stars || Hammers Processor </div>
        <Dropzone
          onDragEnter={() => setHighlighted(true)}
          onDragLeave={() => setHighlighted(false)}
          onDrop={async (acceptedFiles) => {
            setFileData(
              parse(await acceptedFiles[0].text(), { header: true }).data
            );
          }}
        >
          {({ getRootProps, getInputProps }) => (
            <section>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <p className={highlighted ? "highlighted" : "drag_area"}>
                  Drag 'n' drop some files here, or click to select files
                </p>
              </div>
            </section>
          )}
        </Dropzone>
      </div>
      {fileData ? (
        <PatternsProcessor fileData={fileData} />
      ) : (
        console.log("here")
      )}
    </>
  );
}

export default Form;
