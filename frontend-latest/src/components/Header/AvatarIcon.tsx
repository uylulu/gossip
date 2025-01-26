import React, { useState } from "react";
import { Avatar, Box, Menu, MenuItem } from "@mui/material";
import { hooksLogout } from "../../hooks/Auth/hooksLogout";
import { Navigate, useNavigate } from "react-router-dom";
import { RandomAvatar } from "react-random-avatars";

interface AvatarIconProps {
    Username: string;
    style?: React.CSSProperties;
}

const AvatarIcon: React.FC<AvatarIconProps> = ({ Username }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();
    const { logout } = hooksLogout(); // Destructure logout properly

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout(); 
        navigate("/login");
    };

    const handleChangeUsername = () => {
        navigate("/change-username");
    };

    const handleChangePassword = () => {
        navigate("/change-password");
    };

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                width: "100%",
                backgroundColor: "transparent",
            }}
        >
            <div onClick={handleClick}>
                <RandomAvatar 
                    name={Username} 
                    size={50}
                />
            </div>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
            >
                <MenuItem onClick={() => { handleChangeUsername(); handleClose(); }}>Change Username</MenuItem>
                <MenuItem onClick={() => { handleChangePassword(); handleClose(); }}>Change Password</MenuItem>
                <MenuItem onClick={() => { handleLogout(); handleClose(); }}>Logout</MenuItem>
            </Menu>
        </Box>
    );
};

export default AvatarIcon;
