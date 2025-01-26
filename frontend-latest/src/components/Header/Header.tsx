import { Box, Grid2 } from "@mui/material";
import React from "react";
import logo from "../../images/logo.png"
import SearchBar from "./SearchBar";
import AddPost from "./AddPost";
import UserIcon from "./AvatarIcon";
import AvatarIcon from "./AvatarIcon";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
    const navigate = useNavigate();
    const { state, dispatch } = useAuth();
    const Username = state.user?.Username || "Guest";

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid2 container spacing={2}>
                <Grid2 size={2}>
                    <img 
                        onClick={() => navigate("/")}
                        src={logo} 
                        alt="logo" 
                        style={{
                            width: 100,
                            height: 100,
                            borderRadius: 50,
                            cursor: 'pointer'
                        }}
                    />
                </Grid2>

                <Grid2 size={7}>
                    <SearchBar />
                </Grid2>
                <Grid2 size={2}>
                    <AddPost />
                </Grid2>
                <Grid2 size={1} sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <Box sx={{ marginRight: 1 }}>Hi {Username}</Box>
                    <AvatarIcon Username={Username} />
                </Grid2>

                {/* gray line */}
                <Grid2 size={12}>
                    <Box sx={{ height: '1px', backgroundColor: 'gray', width: '100%' }} />
                </Grid2>
                {/* Extra space */}
                <Grid2 size={12}>
                    <Box sx={{ height: '10px', backgroundColor: 'transparent', width: '100%' }} />
                </Grid2>
            </Grid2>
        </Box>
    );
}

export default Header;