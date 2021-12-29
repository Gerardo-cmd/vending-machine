import * as React from 'react';
import Card from '@mui/material/Card';
import { CardActionArea, CardContent, Typography} from '@mui/material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 250,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24
  };

const card = (productName, description, cost, code, remaining, max, sendRestockData = (() => {}), sendEditData = (() => {})) => {
    if (code.toString().length === 1) {
        let newCode = "0" + code.toString();
        code = newCode;
    }
    return (
      <React.Fragment>
        <CardContent sx={{padding: "10px"}}>
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
            <Typography sx={{ fontSize: 10 }}>
                {description}
            </Typography>
        </CardContent>
      </React.Fragment>
    )
};


const SodaCard = (props) => {
  return props.admin ? 
    <CardActionArea onClick={() => props.callbackSodaSelection({
        productName: props.productName, 
        description: props.description, 
        cost: props.cost,
        code: props.code,
        remaining: props.remaining, 
        max: props.max
    })}>
        <Card style={{height:"275px", margin: "3px", boxShadow: `0 0 10px 2px black`}} variant="outlined">
            {card(props.productName, props.description, props.cost, props.code, props.remaining, props.max, props.callbackRestock, props.callbackEdit)}
        </Card>
    </CardActionArea> 
    : 
    <Card style={{height:"275px", margin: "3px", boxShadow: `0 0 10px 2px black`}} variant="outlined">
        {card(props.productName, props.description, props.cost, props.code, props.remaining, props.max, props.callbackRestock, props.callbackEdit)}
    </Card>;
}

export default SodaCard;