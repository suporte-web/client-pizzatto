import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { auth } from "./stores/auth/service";
import type { IUser as User } from "./stores/users/types";

interface UserContextProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isLoading: boolean;
  logout: () => void;
}

interface UserProviderProps {
  children: ReactNode;
}

export const UserContext = createContext<UserContextProps>({
  user: null,
  setUser: () => {},
  isLoading: true,
  logout: () => {},
});

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.replace("/");
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        // console.log(token);
        
        if (!token) {
          setIsLoading(false);
          window.location.replace("/");
          return;
        }
        const response = await auth();
        setUser(response);
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, isLoading, logout }}>
      {children}
    </UserContext.Provider>
  );
};

/**
 * Hook customizado para acessar o contexto do usuário
 *
 * @example
 * ```tsx
 * import { useUser } from './UserContext';
 *
 * function MyComponent() {
 *   const { user, setUser, isLoading, logout } = useUser();
 *
 *   if (isLoading) return <div>Carregando...</div>;
 *   if (!user) return <div>Usuário não autenticado</div>;
 *
 *   return (
 *     <div>
 *       <p>Olá, {user.nome}!</p>
 *       <button onClick={logout}>Sair</button>
 *     </div>
 *   );
 * }
 * ```
 *
 * @returns {UserContextProps} O contexto do usuário com user, setUser, isLoading e logout
 * @throws {Error} Caso seja usado fora do UserProvider
 */
export const useUser = (): UserContextProps => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser deve ser usado dentro de um UserProvider");
  }

  return context;
};