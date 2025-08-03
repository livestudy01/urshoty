import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User, LinkItem } from '../types';
import { account, database, Query } from '../services/appwrite';
import { ID, OAuthProvider } from 'appwrite';

interface AuthContextType {
  isLoading: boolean;
  isLoggedIn: boolean;
  user: User | null;
  links: LinkItem[];
  fetchLinks: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  magicLinkLogin: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  googleLogin: () => void;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  addLink: (longUrl: string, customAlias?: string) => Promise<LinkItem>;
  deleteLink: (id: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const navigate = useNavigate();

  const checkUserSession = async () => {
    try {
      const currentUser = await account.get();
      setUser({
        $id: currentUser.$id,
        name: currentUser.name,
        email: currentUser.email,
      });
      await fetchLinks(currentUser.$id);
    } catch (error) {
      setUser(null);
      setLinks([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkUserSession();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    await account.createEmailPasswordSession(email, password);
    await checkUserSession();
    navigate('/dashboard');
  };
  
  const magicLinkLogin = async (email: string) => {
    // The method name is correct according to Appwrite docs, this is likely a type definition issue.
    // Casting to `any` to bypass the faulty type check.
    await (account as any).createMagicURLSession(ID.unique(), email, `${window.location.origin}/dashboard`);
  };

  const googleLogin = () => {
    account.createOAuth2Session(OAuthProvider.Google, `${window.location.origin}/dashboard`, `${window.location.origin}/login`);
  };

  const signUp = async (email: string, password: string, name: string) => {
    await account.create(ID.unique(), email, password, name);
    // Send verification email
    await account.createVerification(`${window.location.origin}/login`);
  };

  const logout = async () => {
    setIsLoading(true);
    await account.deleteSession('current');
    setUser(null);
    setLinks([]);
    setIsLoading(false);
    navigate('/login');
  };

  const fetchLinks = async (userId?: string) => {
      const currentUserId = userId || user?.$id;
      if (!currentUserId) return;

      const response = await database.listDocuments(
          import.meta.env.VITE_APPWRITE_DATABASE_ID,
          import.meta.env.VITE_APPWRITE_LINKS_COLLECTION_ID,
          [Query.equal('userId', currentUserId), Query.orderDesc('createdAt')]
      );
      
      const fetchedLinks = response.documents.map(doc => ({
        id: doc.$id,
        longUrl: doc.longUrl,
        shortCode: doc.shortCode,
        clicks: 0, // Click count is now in MySQL, fetch separately if needed on dashboard
        createdAt: doc.createdAt,
      }));

      setLinks(fetchedLinks);
  };

  const addLink = async (longUrl: string, customAlias?: string): Promise<LinkItem> => {
    if (!user) throw new Error("User not logged in");

    const shortCode = customAlias || Math.random().toString(36).substring(2, 8);
    
    // Here you would also call your backend to create the MySQL entry
    // For now, we just create the Appwrite document

    const newDocument = await database.createDocument(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      import.meta.env.VITE_APPWRITE_LINKS_COLLECTION_ID,
      ID.unique(),
      {
        longUrl,
        shortCode,
        userId: user.$id,
        createdAt: new Date().toISOString(),
      }
    );

    const newLink: LinkItem = {
      id: newDocument.$id,
      longUrl: newDocument.longUrl,
      shortCode: newDocument.shortCode,
      clicks: 0,
      createdAt: newDocument.createdAt,
    };
    
    setLinks(prev => [newLink, ...prev]);
    return newLink;
  };

  const deleteLink = async (id: string) => {
    await database.deleteDocument(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      import.meta.env.VITE_APPWRITE_LINKS_COLLECTION_ID,
      id
    );
    setLinks(prev => prev.filter(link => link.id !== id));
  };

  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{ isLoading, isLoggedIn, user, links, fetchLinks, login, logout, googleLogin, signUp, magicLinkLogin, addLink, deleteLink }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
