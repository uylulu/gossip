import { User } from "./User";

export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
}

export interface AuthAction {
    type: "LOGIN" | "LOGOUT";
    payload: User | null;
}

export interface AuthProviderProps {
    children: React.ReactNode;
}

export interface AuthResponse {
    payload: {
        data: User;
    }
}

export interface AuthContextType {
    state: AuthState;
    dispatch: React.Dispatch<AuthAction>;
}