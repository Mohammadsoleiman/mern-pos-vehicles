import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import axiosClient from "../api/axiosClient";

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const { user, setUser } = useAuth();
  const role = (user?.role || "clerk").toLowerCase();

  const defaultValues = {
    admin: { theme: "light", layout: "list", profilePic: "" },
    clerk: { theme: "light", layout: "list", profilePic: "" },
    accounting: { theme: "light", layout: "list", profilePic: "" },
  };

  // ✅ من البداية settings = default (مش null)
  const [settings, setSettings] = useState(defaultValues[role]);

  useEffect(() => {
    if (!user) return;

    const role = (user.role || "clerk").toLowerCase();

    // ✅ لو كان عنده settings → استخدمها
    if (user.settings?.[role]) {
      setSettings(user.settings[role]);
    } 
    // ✅ غير هيك → عطيني default
    else {
      setSettings(defaultValues[role]);
    }
  }, [user]);

  const updateSettings = async (newSettings) => {
    const role = (user?.role || "clerk").toLowerCase();

    const updatedSettings = {
      ...(user.settings || {}),
      [role]: newSettings,
    };

    setSettings(newSettings);

    const updatedUser = { ...user, settings: updatedSettings };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));

    await axiosClient.put("/auth/settings", { role, ...newSettings });
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
