// ProfileContext.js
import { createContext, useEffect, useState } from "react";
import { getProfile } from "../UserService";

export const ProfileContext = createContext();

const defaultProfile = {
  shopName: "",
  number1: "",
  number2: "",
  location: "",
  description: "",
};

export const ProfileProvider = ({ children }) => {
  const [ProfileData, setProfileData] = useState(defaultProfile);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const result = await getProfile();
      if (result && Object.keys(result).length > 0) {
        setProfileData(result);
      } else {
        setProfileData(defaultProfile);
      }
    } catch (err) {
      console.error("Failed to load profile", err);
      setProfileData(defaultProfile);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <ProfileContext.Provider
      value={{ ProfileData, setProfileData, fetchProfile, loading }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
