import { useContext } from 'react';
import { AuthContext } from './authContextValue';

export function useAuth() {
    return useContext(AuthContext);
}
