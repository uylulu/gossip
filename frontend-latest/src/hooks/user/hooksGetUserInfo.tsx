import React from "react";
import { useAuth } from "../../context/AuthContext";

export const hooksGetUserInfo = () => {
    const { state, dispatch } = useAuth();
    return state.user;
}