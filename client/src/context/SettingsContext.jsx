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

  const [settings, setSettings] = useState(defaultValues[role]);

  useEffect(() => {
    if (user?.settings) {
      setSettings(user.settings[role] || defaultValues[role]);
    }
  }, [user, role]);

  const updateSettings = async (newSettings) => {
    const updated = {
      ...user.settings,
      [role]: newSettings,
    };

    setSettings(newSettings);
    const updatedUser = { ...user, settings: updated };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));

    await axiosClient.put("/auth/settings", newSettings);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
