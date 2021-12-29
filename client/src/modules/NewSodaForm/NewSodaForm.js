import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Box, Input, Typography } from '@mui/material';

const NewSodaForm = (props) => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("admin-token");
        if (token == null) {
            navigate("/");
        }
    }, [navigate])

    return (
        <Box className="col text-center" sx={{background: "white", color: "black", width: "125px"}} component="form" onSubmit={props.handleSubmit}>
            <div className="row">
                <Typography sx={{ fontSize: 24, fontWeight: "bold" }}>New Soda</Typography>
            </div>
            <div className="row">
                <Input
                    className="col"
                    sx={{width: "100px"}}
                    required
                    type="text"
                    name="productName"
                    placeholder='Name'
                />
            </div>
            <div className="row">
                <Input
                    className="col"
                    sx={{width: "100px"}}
                    variant="contained"
                    required
                    multiline
                    rows={3}
                    type="text"
                    name="description"
                    placeholder='Description'
                />
            </div>
            <div className="row">
                <Input
                    className="col"
                    sx={{width: "100px"}}
                    variant="contained"
                    required
                    type="number"
                    label="Cost"
                    name="cost"
                    placeholder='Cost ($)'
                />
            </div>
            <div className="row">
                <Input
                    className="col"
                    sx={{width: "100px"}}
                    variant="contained"
                    required
                    type="text"
                    id="max"
                    name="max"
                    placeholder="Max Quantity"
                />
            </div>
            <div className="row">
                <Input sx={{marginTop: "25px"}} type="submit" value="Submit" />
            </div>
        </Box>
    );
}

export default NewSodaForm;