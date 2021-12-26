import * as React from 'react';
import Card from '@mui/material/Card';
import { Box, Button, CardContent, TextField, Typography} from '@mui/material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 250,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4
  };

const card = (productName, description, cost, code, remaining, max, admin = false, sendRestockData = (() => {})) => {
    if (code.toString().length === 1) {
        let newCode = "0" + code.toString();
        code = newCode;
    }
    return (
      <React.Fragment>
        <CardContent>
            <Typography className="text-center" sx={{ fontSize: 16, fontWeight: "bold", background: "black", color: "white" }}>
                {code}
            </Typography>
            <Typography sx={{ fontSize: 15, fontWeight: "bold", color: remaining === "0" ? "red" : "green" }}>
                {remaining === "0" ? "Out of stock" : `${remaining} left`}
            </Typography>
            <Typography sx={{ fontSize: 15, fontWeight: "bold" }}>
                {productName}
            </Typography>
            <Typography sx={{ fontSize: 13 }} variant="body2" gutterBottom>
                {cost}
            </Typography>
            <Typography sx={{ fontSize: 11 }}>
                {description}
            </Typography>
            {
                admin ? 
                <div className="container-fluid text-center">
                    <div className="row">
                        <Button sx={{background: "cyan", width: "75px", fontSize: "10px"}} variant="outlined" onClick={() => sendRestockData({productName, description, cost, remaining, max})}>Restock</Button>
                    </div>
                </div> 
                :
                ""
            }
        </CardContent>
      </React.Fragment>
    )
};

const SodaCard = (props) => {
  return (
      <Card style={{height:"250px", margin: "3px", boxShadow: `0 0 10px 2px black`}} variant="outlined">
        {card(props.productName, props.description, props.cost, props.code, props.remaining, props.max, props.admin, props.callbackFunction)}
      </Card>
  );
}

export default SodaCard;