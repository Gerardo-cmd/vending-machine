import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Box, Input, Typography } from '@mui/material';

const EditSodaForm = (props) => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("admin-token");
        if (token == null) {
            navigate("/");
        }
    }, [navigate])

    return (
        <Box className="col text-center" sx={{background: "white", color: "black", width: "125px"}} component="form" onSubmit={props.handleSubmit}>
            <div style={{marginBottom: "10px", fontSize: "12px"}} className="row col">
                <Typography className="col">Edit cost</Typography>
            </div>
            <div className="row">
                <Input
                    sx={{width: "100px"}}
                    variant="contained"
                    required
                    type="number"
                    label="Cost"
                    name="cost"
                    placeholder={props.cost}
                />
            </div>
            <div className="row">
                <Input sx={{marginTop: "25px"}} type="submit" value="Submit" />
            </div>
        </Box>
    );
}

export default EditSodaForm;