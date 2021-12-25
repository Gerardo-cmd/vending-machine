import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import CircularProgress from '@mui/material/CircularProgress';
import { Box, Button, TextField } from '@mui/material';
import SodaCard from '../SodaCard/SodaCard';
const VendingMachine = () => {
  const navigate = useNavigate();
  const [sodas, setSodas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [choice, setChoice] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    setLoading(true);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    fetch("http://localhost:5000/sodas", {
      method: 'GET',
      mode: 'cors',
      headers: headers
    })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      setSodas(response.data);
      setLoading(false);
    })
    .catch((e) => {
      navigate("/error");
      console.log(e);
    });
  }, [navigate]);

  const handleChoiceChange = (e) => {
    setChoice(e.target.value.trim());
  };

  const keyPadNumClick = (e) => {
    if (choice.length >= 2) {
      return;
    }
    let oldChoice = choice;
    const newChoice = oldChoice + e.target.value.trim();
    setChoice(newChoice);
    setErrorMessage("");
    return;
  }

  const keyPadBackClick = () => {
    switch (choice.length) {
      case 0:
        break;
      default:
        let oldChoice = choice.split("");
        oldChoice.pop();
        let newChoice = oldChoice.join("");
        setChoice(newChoice);
        setErrorMessage("");
    }
    return;
  };

  const download = (filename, text) => {
    let element = document.createElement('a');
    element.setAttribute('href','data:text/plain;charset=utf-8, ' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  const onPurchase = () => {
    // Making sure it is in the range and not "00"
    if (choice.split("")[0] === "0") {
      if ((parseInt(choice.split("")[1]) > sodas.length) || (parseInt(choice.split("")[1]) === 0)) {
        setErrorMessage("Invalid Input");
        setChoice("");
        return;
      }
    }
    else {
      if (parseInt(choice) > sodas.length) {
        setErrorMessage("Invalid Input");
        setChoice("");
        return;
      }
    }
    let index = choice.split("")[0] === "0" ? (parseInt(choice.split("")[1]) - 1) : (parseInt(choice) - 1);
    const productName = sodas[index].productName;
    if (sodas[index].remaining === "0") {
      setErrorMessage("Out of stock: Please wait for an admin to restock");
      setChoice("");
      return;
    }
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    const data = {productName};
    fetch("http://localhost:5000/soda", {
      method: 'POST',
      mode: 'cors',
      headers: headers,
      body: JSON.stringify(data),
    })
    .then((response) => {
      return response.json();
    })
    .then(function (response) {
      const filename = response.data.productName.replace(" ", "") + ".json";
      const productData = {
        productName: response.data.productName,
        description: response.data.description
      }
      setChoice("");
      download(filename, JSON.stringify(productData));
    })
    .catch((e) => {
      navigate("/error");
      console.log(e);
    });
    return;
  };

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
          <div className="col-10" id="glass">
            {loading ? <CircularProgress /> : 
            <div>
              <div style={{fontWeight: "bold"}}>{sodas.length === 0 ? "There are currently no sodas!": ""}</div>
              <Box component="span">
                <div className="row">
                  {sodas.sort((a, b) => { //Puts them in alphabetical order
                    return (a.productName > b.productName ? 1 : -1)
                  }).map((soda, index) => {
                    return (
                      <div key={index} className="col-lg-3 col-md-4 col-sm-6">
                        <SodaCard
                          productName={soda.productName} 
                          description={soda.description} 
                          cost={soda.cost}
                          code={index+1}
                          remaining={soda.remaining}
                        />
                      </div>
                    );
                  })}
                </div>
              </Box>
            </div>}
          </div>
          <div className="col-1" />
        </div>
        <div className="col-md-4 col-sm-4 col-4">
          <div className="col-1" />
          <div className="col-10" >
            <Box id="userBox" className="text-center" sx={{paddingTop: "10px", paddingBottom: "10px", paddingLeft: "5px", paddingRight: "5px"}}>
              <TextField id="choice" onChange={handleChoiceChange} disabled error={errorMessage === "" ? false : true} helperText={errorMessage === "" ? "" : errorMessage} variant="outlined" value={choice} name="choice" />
              <div className="keypad row">
                <div className="col-4">
                  <div className="row">
                    <button onClick={keyPadNumClick} value={"1"}>1</button>
                  </div>
                  <div className="row">
                    <button onClick={keyPadNumClick} value={"4"}>4</button>
                  </div>
                  <div className="row">
                    <button onClick={keyPadNumClick} value={"7"}>7</button>
                  </div>
                  <div className="row">
                    <button id="back-button" onClick={keyPadBackClick}>{"<-"}</button>
                  </div>
                </div>
                <div className="col-4">
                  <div className="row">
                    <button onClick={keyPadNumClick} value={"2"}>2</button>
                  </div>
                  <div className="row">
                    <button onClick={keyPadNumClick} value={"5"}>5</button>
                  </div>
                  <div className="row">
                    <button onClick={keyPadNumClick} value={"8"}>8</button>
                  </div>
                  <div className="row">
                    <button onClick={keyPadNumClick} value={"0"}>0</button>
                  </div>
                </div>
                <div className="col-4">
                  <div className="row">
                    <button onClick={keyPadNumClick} value={"3"}>3</button>
                  </div>
                  <div className="row">
                    <button onClick={keyPadNumClick} value={"6"}>6</button>
                  </div>
                  <div className="row">
                    <button onClick={keyPadNumClick} value={"9"}>9</button>
                  </div>
                  <div className="row">
                    <button id="clear-button" onClick={() => {
                      setChoice("");
                      setErrorMessage("");
                    }}>X</button>
                  </div>
                </div>
              </div>
              <div className="row">
                <Button variant="contained" disabled={choice.length === 2 ? false : true} onClick={onPurchase}>Purchase</Button>
              </div>
            </Box>
          </div>
          <div className="col-1" />
        </div>
      </div>
    </div>
  );
};

export default VendingMachine;