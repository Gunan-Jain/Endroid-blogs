// import React from "react";
// import { Cloudinary } from "@cloudinary/url-gen";
// import { auto } from "@cloudinary/url-gen/actions/resize";
// import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import { AdvancedImage } from "@cloudinary/react";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./Signup.jsx";
import Dashboard from "./Dashboard.jsx";
import Login from "./Login.jsx";
import Home from "./Home.jsx";
import Blog from "./blog.jsx"; // Correctly capitalized import
import Comment from "./comment.jsx";
// import FileUpload from "./fileupload.jsx";
// import Gallery from "./gallery.jsx";
import Adminblog from "./Adminblog.jsx";
function App() {
  // const cld = new Cloudinary({ cloud: { cloudName: "dnpaktlwa" } });

  // // Use this sample image or upload your own via the Media Explorer
  // const img = cld
  //   .image("cld-sample-5")
  //   .format("auto") // Optimize delivery by resizing and applying auto-format and auto-quality
  //   .quality("auto")
  //   .resize(auto().gravity(autoGravity()).width(500).height(500)); // Transform the image: auto-crop to square aspect_ratio

  const [count, setCount] = useState(0);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/comment" element={<Comment />} />
          <Route path="/blog" element={<Blog />} />{" "}
          <Route path="adminblogs" element={<Adminblog />} />
          {/* <Route path="/files" element={<FileUpload />} />
          <Route path="/gallery" element={<Gallery />} /> */}
          {/* Correct capitalization */}
        </Routes>
      </Router>
      {/* <AdvancedImage cldImg={img} /> */}
    </>
  );
}

export default App;
