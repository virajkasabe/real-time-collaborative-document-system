import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function DocumentEditor() {
  const [value, setValue] = useState("");

  return (
    <div style={{ padding: "20px" }}>
      <h1>Document Editor Page</h1>
      <p>Main real-time collaborative editor.</p>

      <ReactQuill
        theme="snow"
        value={value}
        onChange={setValue}
        style={{ height: "300px", marginTop: "20px" }}
      />
    </div>
  );
}