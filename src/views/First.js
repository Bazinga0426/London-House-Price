import React from "react";
import  './home.css'
function First() {
  return (
    <>
      <div
        style={{
          backgroundImage: "url('./Home.jpg')",
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          height: "100vh",
        }}
      >
        <section className="title">
          <p className="p1">
            Thoughtful London House Price Assistant
          </p>
          <p className="p2">
            Use the map to search the surrounding area in real time. Estimated
            prices of various types of houses. London housing price forecast.
          </p>
          <p></p>
        </section>
      </div>
      <div
        style={{
          backgroundImage: "url('./House.jpg')",
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          height: "100vh",
        }}
      ></div>
      <div
        style={{
          backgroundImage: "url('./City.jpg')",
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          height: "100vh",
        }}
      ></div>
    </>
  );
}

export default First;
