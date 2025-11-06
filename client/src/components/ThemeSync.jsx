import { useEffect } from "react";
import { useSettings } from "../context/SettingsContext";

export default function ThemeSync({ children }) {
  const { settings } = useSettings();

  useEffect(() => {
    if (!settings?.theme) return;
    document.documentElement.setAttribute("data-theme", settings.theme);
  }, [settings?.theme]);

  return children;
}
