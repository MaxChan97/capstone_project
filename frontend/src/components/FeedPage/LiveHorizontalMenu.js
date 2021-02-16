import React, { useEffect, useState } from "react";
import ScrollMenu from "react-horizontal-scrolling-menu";
import "./LiveHorizontalMenu.css";
import defaultDP from "../../assets/Default Dp logo.svg";

// One item component
// selected prop will be passed
const MenuItem = ({ data, selected }) => {
  return (
    <div className={`menu-item ${selected ? "active" : ""}`}>
      <div className="container">
        <div className="row">
          <div className="col-6 align-self-center">
            <img className="img-fluid" src={defaultDP} alt="defaultDP" />
          </div>
          <div className="col-6">
            <p className="m-0">
              <strong>{data.name}</strong>
            </p>
            <span>
              <i
                className="fas fa-circle fa-xs mt-2 mx-1"
                style={{ color: "red", float: "left" }}
              ></i>
              <p className="m-0">{data.viewers}</p>
            </span>
            <p className="m-0">{data.category}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Menu = (data, selected) =>
  data.map((item) => {
    return <MenuItem key={item.name} data={item} selected={selected} />;
  });

const Arrow = ({ text, className }) => {
  return <div className={className}>{text}</div>;
};

const ArrowLeft = Arrow({ text: "<", className: "arrow-prev" });
const ArrowRight = Arrow({ text: ">", className: "arrow-next" });

export default function LiveHorizontalMenu({ data }) {
  const [selection, setSelection] = useState("item1");

  var onSelect = (key) => {
    setSelection(key);
  };

  return (
    <div>
      <ScrollMenu
        data={Menu(data, selection)}
        arrowLeft={ArrowLeft}
        arrowRight={ArrowRight}
        selected={selection}
        onSelect={onSelect}
      />
    </div>
  );
}
