import React from "react";
import "../../styles/clerk/ui.css";

export default function Button({ children, onClick, type="button", variant="primary" }) {
  return <button className={`clerk-btn ${variant}`} type={type} onClick={onClick}>{children}</button>;
}
