import React from "react";
import "animate.css";

const NavBar = () => {
  return (
    <div className="row bg-dark">
      <div className="col-5">
        <h3 className="text-danger p-2">bipinmsit</h3>
      </div>
      <div className="col-7">
        <h3 className="text-light p-2 animate__animated animate__headShake animate__infinite animate__slower">
          WebGIS Application
        </h3>
      </div>
    </div>
  );
};
export default NavBar;
