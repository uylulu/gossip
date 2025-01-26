import React, { useState } from "react";
import { TextField, InputAdornment, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useThreadContext } from "../../context/ThreadContext";

const SearchBar = () => {
    const { sortThreadsByQuery } = useThreadContext();
    const [query, setQuery] = useState("");

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        sortThreadsByQuery(value);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const value = (e.target as HTMLInputElement).value;
            setQuery(value);
            sortThreadsByQuery(value);
        }
    };

    return (
        <Box sx={{ 
            width: "100%",
            maxWidth: "100%",
            display: "flex",
            alignItems: "center", 
            justifyContent: "center", 
            height: "100%", 
         }}>
            <TextField
                fullWidth
                variant="outlined"
                placeholder="Search..."
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
                sx={{
                    "& .MuiOutlinedInput-root": {
                        borderRadius: "25px", // Makes the border round
                    },
                }}
                onChange={handleSearch}
                onKeyPress={handleKeyPress}
                value={query}
            />
        </Box>
    );
};

export default SearchBar;
