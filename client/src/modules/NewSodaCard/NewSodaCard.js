import * as React from 'react';
import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Card, CardContent, TextField, Typography} from '@mui/material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 250,
    bgcolor: 'grey',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4
  };

const card = (addNewCard) => {
    return (
      <React.Fragment>
        <CardContent className="text-center">
            <Button sx={{ fontSize: 15, fontWeight: "bold" }} variant="contained" onClick={addNewCard}>
                <AddIcon />
            </Button>
        </CardContent>
      </React.Fragment>
    )
};

const NewSodaCard = (props) => {
  return (
      <Card style={{height:"275px", margin: "3px", boxShadow: `0 0 10px 2px black`}} variant="outlined">
        {card(props.callbackFunction)}
      </Card>
  );
}

export default NewSodaCard;