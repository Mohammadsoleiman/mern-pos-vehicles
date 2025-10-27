import React from "react";
import "../../styles/clerk/ui.css";

export default function Spinner({ size="md" }) {
  return <div className={`clerk-spinner ${size}`}></div>;
}
