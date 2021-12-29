import { Box, Button, TextField } from '@mui/material';
const Error = () => {
    return (
      <div id="page">
      <div className="row App-header">
        <div className="col-sm-4" />
        <div className="col-sm-4">
          <h1>ColaCo</h1>
        </div>
        <div className="col-sm-4" />
      </div>
      <div className="row">
        <div className="col-md-8 col-sm-8 col-8 row">  
          <div className="col-1" />
          <div className="col-10" id="glass" style={{color: "red"}}>
            <h1>Something went wrong with the application, please visit again later!</h1>
          </div>
          <div className="col-1" />
        </div>
        <div className="col-md-4 col-sm-4 col-4">
          <div className="col-1" />
          <div className="col-10" >
            <Box id="userBox" className="text-center" disabled sx={{paddingTop: "10px", paddingBottom: "10px", paddingLeft: "5px", paddingRight: "5px"}}>
              <TextField className="choice" disabled variant="outlined" name="choice" />
              <div className="keypad row">
                <div className="col-4">
                  <div className="row">
                    <button value={"1"}>1</button>
                  </div>
                  <div className="row">
                    <button value={"4"}>4</button>
                  </div>
                  <div className="row">
                    <button value={"7"}>7</button>
                  </div>
                  <div className="row">
                    <button id="back-button">{"<-"}</button>
                  </div>
                </div>
                <div className="col-4">
                  <div className="row">
                    <button value={"2"}>2</button>
                  </div>
                  <div className="row">
                    <button value={"5"}>5</button>
                  </div>
                  <div className="row">
                    <button value={"8"}>8</button>
                  </div>
                  <div className="row">
                    <button value={"0"}>0</button>
                  </div>
                </div>
                <div className="col-4">
                  <div className="row">
                    <button value={"3"}>3</button>
                  </div>
                  <div className="row">
                    <button value={"6"}>6</button>
                  </div>
                  <div className="row">
                    <button value={"9"}>9</button>
                  </div>
                  <div className="row">
                    <button id="clear-button">X</button>
                  </div>
                </div>
              </div>
              <div className="row">
                <Button variant="contained" disabled>Purchase</Button>
              </div>
            </Box>
          </div>
          <div className="col-1" />
        </div>
      </div>
    </div>
  );
}

export default Error;