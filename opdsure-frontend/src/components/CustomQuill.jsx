import React, { useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";


// Add sizes to whitelist and register them
const Size = ReactQuill.Quill.import("formats/size");
Size.whitelist = ["extra-small", "small", "medium", "large"];
ReactQuill.Quill.register(Size, true);

// Add fonts to whitelist and register them
const Font = ReactQuill.Quill.import("formats/font");
Font.whitelist = ['arial', 'roboto', 'raleway', 'montserrat', 'lato', 'rubik'];
Quill.register(Font, true);

// Modules object for setting up the Quill editor
// const modules = {
//   toolbar: {
//     // You can optionally define a toolbar here if needed
//     // container: "#toolbar",
//     // Or you can specify a custom toolbar in your JSX
//   },
//   history: {
//     delay: 500,
//     maxStack: 100,
//     userOnly: true
//   }
// };
const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: Font.whitelist }],
    ["bold", "italic", "underline", "strike", "blockquote", "header"],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link"],
    [{ script: "sub" }, { script: "super" }],
  ],
};



// Formats array for setting up the Quill editor
const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "align",
  "strike",
  "script",
  "blockquote",
  "background",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "color",
  "code-block"
];

const CustomQuill = ({ onChange, value, ...props }) => {
  return (
    <ReactQuill
      value={value}
      onChange={onChange}
      modules={modules}
      // formats={formats}
      {...props}
    />
  );
};

export default CustomQuill;
