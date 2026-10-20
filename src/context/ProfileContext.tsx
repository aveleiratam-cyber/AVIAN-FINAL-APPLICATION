import React, { createContext, useContext, useState } from 'react';

interface ProfileContextType {
  fullName: string;
  setFullName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  profileImage: string | null;
  setProfileImage: (uri: string | null) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [fullName, setFullName] = useState('John Doe');
  const [email, setEmail] = useState('johndoe2@gmail.com');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  return (
    <ProfileContext.Provider value={{ fullName, setFullName, email, setEmail, profileImage, setProfileImage }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}