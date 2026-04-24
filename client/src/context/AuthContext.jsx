import { useEffect, useState } from "react";
import { getCurrentUser, signOut as amplifySignOut } from "aws-amplify/auth";
import { ensureStarterRecipesSeeded } from "../features/recipes/recipeStorage";
import { clearCurrentUserStorageScope, setCurrentUserStorageScope } from "../lib/userStorage";
import { AuthContext } from "./useAuth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadUser() {
      try {
        const currentUser = await getCurrentUser();
        if (isMounted) {
          setUser(currentUser);
        }
      } catch {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsAuthLoading(false);
        }
      }
    }

    loadUser();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (isAuthLoading) return;

    let isMounted = true;

    async function bootstrapUserData() {
      if (!user) {
        clearCurrentUserStorageScope();
        if (isMounted) {
          setIsDataLoading(false);
        }
        return;
      }

      setCurrentUserStorageScope(user);

      try {
        await ensureStarterRecipesSeeded();
      } catch (error) {
        console.error("Failed to seed starter recipes:", error);
      } finally {
        if (isMounted) {
          setIsDataLoading(false);
        }
      }
    }

    setIsDataLoading(true);
    bootstrapUserData();

    return () => {
      isMounted = false;
    };
  }, [isAuthLoading, user]);

  async function logout() {
    await amplifySignOut();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading: isAuthLoading || isDataLoading,
        setUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
