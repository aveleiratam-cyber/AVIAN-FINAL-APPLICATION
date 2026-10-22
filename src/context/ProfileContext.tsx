import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabase'; 

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
  const [fullName, setFullName] = useState('User');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const updateProfileFromUser = (user: any) => {
    const firstName = user.user_metadata?.first_name || '';
    const lastName = user.user_metadata?.last_name || '';
    
    if (firstName || lastName) {
      setFullName(`${firstName} ${lastName}`.trim());
    } else if (user.email) {
      setFullName(user.email.split('@')[0]);
    } else {
      setFullName('User');
    }

    if (user.email) {
      setEmail(user.email);
    }

    setProfileImage(user.user_metadata?.avatar_url || null);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (session?.user) {
          updateProfileFromUser(session.user);
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
      }
    };

    fetchUserData();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        updateProfileFromUser(session.user);
      } else {
        // Clear state completely on sign out
        setFullName('User');
        setEmail('');
        setProfileImage(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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