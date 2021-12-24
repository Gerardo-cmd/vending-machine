import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const card = (productName, description, cost, code, remaining) => {
    if (code.toString().length === 1) {
        let newCode = "0" + code.toString();
        code = newCode;
    }
    return (
      <React.Fragment>
        <CardContent>
            <Typography sx={{ fontSize: 16, fontWeight: "bold", background: "black", color: "white" }}>
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
        </CardContent>
      </React.Fragment>
    )
};

const SodaCard = (props) => {
  return (
      <Card style={{height:"250px", margin: "5px", boxShadow: `0 0 10px 2px black`}} variant="outlined">
        {card(props.productName, props.description, props.cost, props.code, props.remaining)}
      </Card>
  );
}

export default SodaCard;