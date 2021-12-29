import * as React from 'react';
import { Box, Button, Typography} from '@mui/material';

const SodaOptions = (props) => {
    let code = props.code
    if (code.toString().length === 1) {
        let newCode = "0" + code.toString();
        code = newCode;
    }
    return (
        <Box className="col text-center" sx={{paddingTop: "10px", paddingBottom: "10px", paddingLeft: "5px", paddingRight: "5px", background: "white", minHeight: "150px"}} component="form" onSubmit={props.handleSubmit}>
            <div className="row">
                <Typography className="text-center" sx={{ fontSize: 16, fontWeight: "bold", background: "black", color: "white" }}>{code}</Typography>
            </div>    
            <div className="row">
                <Typography sx={{ fontSize: 24, fontWeight: "bold" }}>{props.productName}</Typography>
            </div>
            <div className="row">
                <Typography sx={{ fontSize: 13 }}>{props.description}</Typography>
            </div>
            <div className="row">
                <Typography sx={{ fontSize: 13 }} variant="body2" gutterBottom>Cost: {props.cost}</Typography>
            </div>
            <div className="row" sx={{ fontSize: 15, fontWeight: "bold"}}>
                <Typography>Max Quantity: {props.max}</Typography>
            </div>
            <div className="row" sx={{ fontSize: 15, fontWeight: "bold"}}>
                <Typography sx={{ fontSize: 15, fontWeight: "bold"}}>Remaining: {props.remaining}</Typography>
            </div>
            <div className="row">
                <Button sx={{background: "cyan", height: "30px", fontSize: "8px", marginTop: "5px", marginBottom: "5px"}} variant="outlined" onClick={() => props.callbackRestock({productName: props.productName, description: props.description, cost: props.cost, remaining: props.remaining, max: props.max})}>Re-stock</Button>
            </div>
            <div className="row">
                <Button sx={{background: "orange", height: "30px", fontSize: "8px", marginTop: "5px", marginBottom: "5px"}} variant="outlined" onClick={() => props.callbackEdit({productName: props.productName, description: props.description, cost: props.cost, remaining: props.remaining, max: props.max})}>Edit Cost</Button>
            </div>
            <div className="row">
                <Button sx={{background: "red", color: "white", height: "30px", fontSize: "8px", marginTop: "5px", marginBottom: "5px"}} variant="outlined" onClick={() => props.callbackRemove({productName: props.productName, description: props.description, cost: props.cost, remaining: props.remaining, max: props.max})}>Remove Soda</Button>
            </div>
        </Box>
    );
}

export default SodaOptions;