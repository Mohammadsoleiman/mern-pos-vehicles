// src/pages/clerk/ClerkSettings.jsx
import React, { useState, useContext } from 'react';
import { ClerkAuthContext } from '../../context/clerk/ClerkAuthContext';
import { 
  Settings, 
  User, 
  Bell, 
  Lock, 
  Palette,
  Save,
  Eye,
  EyeOff,
  Check,
  Shield,
  Mail,
  Phone,
  Briefcase
} from 'lucide-react';
import '../../styles/clerk/ClerkSettings.css';

const ClerkSettings = () => {
  const { clerk } = useContext(ClerkAuthContext);
  
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: clerk?.name || 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    role: clerk?.role || 'clerk',
    employeeId: 'CLK-001'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    lowStockAlerts: true,
    newSaleNotifications: true,
    dailyReports: false,
    weeklyReports: true,
    emailNotifications: true,
    pushNotifications: false
  });

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'light',
    compactView: false,
    showAnimations: true
  });

  const handleProfileSave = () => {
    console.log('Saving profile:', profileData);
    showSaveSuccess();
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters!');
      return;
    }
    console.log('Changing password');
    setPasswordData({ currentPassword:'', newPassword:'', confirmPassword:'' });
    showSaveSuccess();
  };

  const handleNotificationsSave = () => {
    console.log('Saving notifications:', notificationSettings);
    showSaveSuccess();
  };

  const handleAppearanceSave = () => {
    console.log('Saving appearance:', appearanceSettings);
    showSaveSuccess();
  };

  const showSaveSuccess = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const TabButton = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`tab-button ${activeTab === id ? 'active' : ''}`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );

  // Custom Toggle Switch Component
  const ToggleSwitch = ({ checked, onChange, label, description }) => (
    <div className="toggle-switch-container">
      <div className="toggle-switch-content">
        <div className="toggle-switch-text">
          <span className="toggle-switch-label">{label}</span>
          {description && <span className="toggle-switch-description">{description}</span>}
        </div>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
          />
          <span className="toggle-slider"></span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="settings-page">
      <div className="settings-container">
        {/* Header */}
        <div className="settings-header">
          <h1>
            <Settings size={36} className="settings-icon"/>
            Settings
          </h1>
          <p className="settings-subtitle">Manage your account and preferences</p>
        </div>

        {/* Success Message */}
        {saveSuccess && (
          <div className="save-success">
            <div className="save-icon">
              <Check size={20} />
            </div>
            <p>Settings saved successfully!</p>
          </div>
        )}

        {/* Main Content */}
        <div className="settings-content">
          {/* Sidebar */}
          <div className="settings-sidebar">
            <TabButton id="profile" icon={User} label="Profile" />
            <TabButton id="security" icon={Lock} label="Security" />
            <TabButton id="notifications" icon={Bell} label="Notifications" />
            <TabButton id="appearance" icon={Palette} label="Appearance" />
          </div>

          {/* Content Area */}
          <div className="settings-main">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="tab-content">
                <div className="tab-header">
                  <User size={28} className="tab-icon" />
                  <div>
                    <h2>Profile Information</h2>
                    <p>Update your personal details and contact information</p>
                  </div>
                </div>

                <div className="form-section">
                  <div className="form-group">
                    <label htmlFor="name">
                      <User size={16} />
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">
                      <Mail size={16} />
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">
                      <Phone size={16} />
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="employeeId">
                        <Briefcase size={16} />
                        Employee ID
                      </label>
                      <input 
                        id="employeeId"
                        type="text" 
                        value={profileData.employeeId} 
                        disabled 
                        className="disabled-input"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="role">
                        <Shield size={16} />
                        Role
                      </label>
                      <input 
                        id="role"
                        type="text" 
                        value={profileData.role} 
                        disabled 
                        className="disabled-input"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-actions">
                  <button className="btn-save" onClick={handleProfileSave}>
                    <Save size={18}/>
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="tab-content">
                <div className="tab-header">
                  <Lock size={28} className="tab-icon" />
                  <div>
                    <h2>Security Settings</h2>
                    <p>Manage your password and security preferences</p>
                  </div>
                </div>

                <div className="form-section">
                  <div className="form-group">
                    <label htmlFor="currentPassword">
                      <Lock size={16} />
                      Current Password
                    </label>
                    <div className="password-input-wrapper">
                      <input
                        id="currentPassword"
                        type={showPassword ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                        placeholder="Enter current password"
                        className="password-input"
                      />
                      <button 
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="newPassword">
                      <Lock size={16} />
                      New Password
                    </label>
                    <input
                      id="newPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      placeholder="Enter new password"
                    />
                    <span className="input-hint">Must be at least 6 characters</span>
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword">
                      <Lock size={16} />
                      Confirm New Password
                    </label>
                    <input
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      placeholder="Confirm new password"
                    />
                  </div>

                  {passwordData.newPassword && passwordData.confirmPassword && (
                    <div className={`password-match ${passwordData.newPassword === passwordData.confirmPassword ? 'match' : 'nomatch'}`}>
                      {passwordData.newPassword === passwordData.confirmPassword ? (
                        <>
                          <Check size={16} /> Passwords match
                        </>
                      ) : (
                        <>
                          <X size={16} /> Passwords do not match
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div className="form-actions">
                  <button className="btn-save" onClick={handlePasswordChange}>
                    <Save size={18}/>
                    <span>Change Password</span>
                  </button>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="tab-content">
                <div className="tab-header">
                  <Bell size={28} className="tab-icon" />
                  <div>
                    <h2>Notification Preferences</h2>
                    <p>Choose what notifications you want to receive</p>
                  </div>
                </div>

                <div className="notifications-section">
                  <h3 className="section-title">Alert Notifications</h3>
                  <div className="toggles-group">
                    <ToggleSwitch
                      checked={notificationSettings.lowStockAlerts}
                      onChange={(e) => setNotificationSettings({...notificationSettings, lowStockAlerts: e.target.checked})}
                      label="Low Stock Alerts"
                      description="Get notified when vehicle inventory is running low"
                    />
                    <ToggleSwitch
                      checked={notificationSettings.newSaleNotifications}
                      onChange={(e) => setNotificationSettings({...notificationSettings, newSaleNotifications: e.target.checked})}
                      label="New Sale Notifications"
                      description="Receive alerts for new vehicle sales"
                    />
                  </div>
                </div>

                <div className="notifications-section">
                  <h3 className="section-title">Report Notifications</h3>
                  <div className="toggles-group">
                    <ToggleSwitch
                      checked={notificationSettings.dailyReports}
                      onChange={(e) => setNotificationSettings({...notificationSettings, dailyReports: e.target.checked})}
                      label="Daily Reports"
                      description="Receive daily summary reports"
                    />
                    <ToggleSwitch
                      checked={notificationSettings.weeklyReports}
                      onChange={(e) => setNotificationSettings({...notificationSettings, weeklyReports: e.target.checked})}
                      label="Weekly Reports"
                      description="Receive weekly performance reports"
                    />
                  </div>
                </div>

                <div className="notifications-section">
                  <h3 className="section-title">Delivery Methods</h3>
                  <div className="toggles-group">
                    <ToggleSwitch
                      checked={notificationSettings.emailNotifications}
                      onChange={(e) => setNotificationSettings({...notificationSettings, emailNotifications: e.target.checked})}
                      label="Email Notifications"
                      description="Send notifications to your email"
                    />
                    <ToggleSwitch
                      checked={notificationSettings.pushNotifications}
                      onChange={(e) => setNotificationSettings({...notificationSettings, pushNotifications: e.target.checked})}
                      label="Push Notifications"
                      description="Show browser push notifications"
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button className="btn-save" onClick={handleNotificationsSave}>
                    <Save size={18}/>
                    <span>Save Preferences</span>
                  </button>
                </div>
              </div>
            )}

            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <div className="tab-content">
                <div className="tab-header">
                  <Palette size={28} className="tab-icon" />
                  <div>
                    <h2>Appearance Settings</h2>
                    <p>Customize how the application looks and feels</p>
                  </div>
                </div>

                <div className="appearance-section">
                  <h3 className="section-title">Theme</h3>
                  <div className="theme-selector">
                    <button 
                      className={`theme-option ${appearanceSettings.theme === 'light' ? 'active' : ''}`}
                      onClick={() => setAppearanceSettings({...appearanceSettings, theme: 'light'})}
                    >
                      <div className="theme-preview light-theme">
                        <div className="theme-preview-bar"></div>
                        <div className="theme-preview-content"></div>
                      </div>
                      <span>Light</span>
                    </button>
                    <button 
                      className={`theme-option ${appearanceSettings.theme === 'dark' ? 'active' : ''}`}
                      onClick={() => setAppearanceSettings({...appearanceSettings, theme: 'dark'})}
                    >
                      <div className="theme-preview dark-theme">
                        <div className="theme-preview-bar"></div>
                        <div className="theme-preview-content"></div>
                      </div>
                      <span>Dark</span>
                    </button>
                  </div>
                </div>

                <div className="appearance-section">
                  <h3 className="section-title">Display Options</h3>
                  <div className="toggles-group">
                    <ToggleSwitch
                      checked={appearanceSettings.compactView}
                      onChange={(e) => setAppearanceSettings({...appearanceSettings, compactView: e.target.checked})}
                      label="Compact View"
                      description="Use a more condensed layout"
                    />
                    <ToggleSwitch
                      checked={appearanceSettings.showAnimations}
                      onChange={(e) => setAppearanceSettings({...appearanceSettings, showAnimations: e.target.checked})}
                      label="Show Animations"
                      description="Enable smooth transitions and animations"
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button className="btn-save" onClick={handleAppearanceSave}>
                    <Save size={18}/>
                    <span>Save Settings</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClerkSettings;