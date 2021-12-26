import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Alert, Box, Button, Input, TextField, Typography } from '@mui/material';

const RestockForm = (props) => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("admin-token");
        if (token == null) {
            navigate("/");
        }
    }, [navigate])

    return (
        <Box className="col" sx={{background: "white", color: "black", width: "125px"}} component="form" onSubmit={props.handleSubmit}>
            <div style={{marginBottom: "10px"}} className="row col">
                {props.max === props.remaining ? <Typography className="col">FULL</Typography> : <Typography className="col">Stock up to {props.max-props.remaining} more</Typography>}
            </div>
            <div className="row">
                <Input
                    className="col"
                    sx={{width: "100px"}}
                    variant="contained"
                    required
                    type="text"
                    id="quantity"
                    name="quantity"
                    label="Quantity"
                />
            </div>
            <div className="row">
                <Input sx={{marginTop: "15px"}} type="submit" value="Submit" />
            </div>
        </Box>
    );
}

export default RestockForm;