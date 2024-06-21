import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./FrontDashboard.module.css";

const FrontDashboard = ({ onItemSelect, onZoom, onPrint, activeContent }) => { // Add activeContent prop
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("headnotes"); // Default to "headnotes"

  const items = [
    { name: "Headnotes", key: "headnotes" },
    { name: "Judgements", key: "judgment" },
    { name: "Status", key: "status" },
    { name: "Equals", key: "equals" },
    { name: "Cited", key: "cited" },
    { name: "Notes", key: "notes" },
    { name: "-", key: "minus" },
    { name: "+", key: "plus" },
    { name: "Bookmark", key: "bookmark" },
    { name: "Pad", key: "pad" },
    { name: "Print", key: "print" },
    { name: "True Print", key: "truePrint" },
  ];

  const handleClick = (key) => {
    if (key === "plus" || key === "minus") {
      onZoom(key);
    } else if (key === "print") {
      onPrint();
    } else if (key === "pad") {
      navigate("/pad");
    } else {
      onItemSelect(key);
    }
    setActiveItem(key); // Set the active item on click
  };

  // Update activeItem when activeContent changes
  React.useEffect(() => {
    setActiveItem(activeContent);
  }, [activeContent]);

  return (
    <div className={styles.dashboard}>
      <div className={styles.content}>
        {items.map((item, index) => (
          <button
            key={index}
            className={`${styles.textButton} ${activeItem === item.key ? styles.active : ""}`}
            onClick={() => handleClick(item.key)}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FrontDashboard;
