import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import axiosClient from "../api/axiosClient";

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const { user, setUser } = useAuth();
  const role = user?.role || "clerk";

  const defaultValues = {
    admin: { theme: "light", layout: "list", profilePic: "" },
    clerk: { theme: "light", layout: "list", profilePic: "" },
    accountant: { theme: "light", layout: "list", profilePic: "" },
  };

  // ✅ always have a safe starting value
const [settings, setSettings] = useState(null);

 useEffect(() => {
  if (user?.settings) {
    setSettings(user.settings[role] || defaultValues[role]);
  } else {
    setSettings(defaultValues[role]);
  }
}, [user, role]);

  const updateSettings = async (newSettings) => {
    const role = user?.role || "clerk";

    // ✅ ensure settings object exists
    const updatedSettings = {
      ...(user.settings || {}), // fallback if undefined
      [role]: newSettings,
    };

    // ✅ update UI instantly
    setSettings(newSettings);

    const updatedUser = { ...user, settings: updatedSettings };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));

    // ✅ send to backend with role information
    await axiosClient.put("/auth/settings", { role, ...newSettings });
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
