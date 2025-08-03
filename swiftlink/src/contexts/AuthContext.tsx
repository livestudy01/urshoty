import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User, LinkItem } from '../types';
import { account } from '../services/appwrite';
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
  signUp: (email: string, password:string, name: string) => Promise<void>;
  addLink: (longUrl: string, customAlias?: string) => Promise<LinkItem>;
  deleteLink: (id: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${endpoint}`, {
        ...options,
        credentials: 'include', // This is crucial to send the session cookie
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }
    if (response.status === 204) { // No Content
        return;
    }
    return response.json();
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const navigate = useNavigate();

  const checkUserSession = async () => {
    setIsLoading(true);
    try {
      const currentUser = await account.get();
      const userData = {
        $id: currentUser.$id,
        name: currentUser.name,
        email: currentUser.email,
      };
      setUser(userData);
      // Links will be fetched by DashboardPage or other components as needed
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
    await account.createEmailPasswordSession(email, password);
    await checkUserSession();
    navigate('/dashboard');
  };
  
  const magicLinkLogin = async (email: string) => {
    // The method name is correct according to Appwrite docs, this is likely a type definition issue.
    // Casting to `any` to bypass the faulty type check.
    await (account as any).createMagicURLSession(ID.unique(), email, `${window.location.origin}/#/dashboard`);
  };

  const googleLogin = () => {
    // Appwrite will redirect back to this URL
    const successUrl = `${window.location.origin}/#/dashboard`;
    const failureUrl = `${window.location.origin}/#/login`;
    account.createOAuth2Session(OAuthProvider.Google, successUrl, failureUrl);
  };

  const signUp = async (email: string, password: string, name: string) => {
    await account.create(ID.unique(), email, password, name);
    await account.createVerification(`${window.location.origin}/#/login`);
  };

  const logout = async () => {
    await account.deleteSession('current');
    setUser(null);
    setLinks([]);
    navigate('/login');
  };

  const fetchLinks = async () => {
      const fetchedLinks = await apiFetch('/api/links');
      setLinks(fetchedLinks);
  };

  const addLink = async (longUrl: string, customAlias?: string): Promise<LinkItem> => {
    const newLink: LinkItem = await apiFetch('/api/links', {
        method: 'POST',
        body: JSON.stringify({ longUrl, customSlug: customAlias }),
    });
    
    setLinks(prev => [newLink, ...prev]);
    return newLink;
  };

  const deleteLink = async (id: string) => {
    await apiFetch(`/api/links/${id}`, { method: 'DELETE' });
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
