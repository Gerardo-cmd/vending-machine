import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Box, Input, Typography } from '@mui/material';

const RemoveSodaForm = (props) => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("admin-token");
        if (token == null) {
            navigate("/");
        }
    }, [navigate])

    return (
        <Box className="col text-center" sx={{background: "white", color: "black", width: "125px"}} component="form" onSubmit={props.handleSubmit}>
            <div style={{marginBottom: "10px"}} className="row col">
                <Typography sx={{fontWeight: "bold"}} className="col">Remove {props.productName}?</Typography>
            </div>
            <div className="row">
                <Input sx={{marginTop: "15px", background: "red", color: "white", borderRadius: "5px"}} type="submit" value="Remove" />
            </div>
        </Box>
    );
}

export default RemoveSodaForm;