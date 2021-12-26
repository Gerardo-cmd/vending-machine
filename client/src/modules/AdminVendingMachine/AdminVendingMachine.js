import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import LogoutIcon from '@mui/icons-material/Logout';
import CircularProgress from '@mui/material/CircularProgress';
import { Box, Button, Modal, TextField, Typography } from '@mui/material';
import RestockForm from '../RestockForm/RestockForm';
import SodaCard from '../SodaCard/SodaCard';

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

const AdminVendingMachine = () => {
  const navigate = useNavigate();
  const [sodas, setSodas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [choice, setChoice] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [overflow, setOverflow] = useState(false);
  const [soda, setSoda] = useState(false);
  const [reload, triggerReload] = useState(false);

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
  }, [navigate, reload]);

  const handleRestockSelection = (soda) => {
    setSoda(soda);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("admin-token");
    if (token == null) {
        navigate("/");
    }
    if ((parseInt(e.target.quantity.value) + parseInt(soda.remaining)) > parseInt(soda.max)) {
        setOverflow(true);
        return;
    }
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Authorization', `Bearer ${token}`);
    const data = {productName: soda.productName, quantity: e.target.quantity.value};
    fetch("/restock", {
        method: 'POST',
        mode: 'cors',
        headers: headers,
        body: JSON.stringify(data)
    })
    .then((response) => {
        return response.json();
    })
    .then((response) => {
      setSoda(false);
      triggerReload(!reload);
      return;
    })
    .catch((error) => {
        setOverflow(false);
        navigate("/error");
        console.log(error);
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
        <div style={{marginTop: "15px"}} className="col-sm-8 row">  
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
                          max={soda.max}
                          admin={true}
                          callbackFunction={handleRestockSelection}
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
        <div style={{marginTop: "15px"}} className="col-sm-4 row">
          <div className="col-1" />
          <div className="col-10" >
            <Box className="text-center" sx={{paddingTop: "10px", paddingBottom: "10px", paddingLeft: "5px", paddingRight: "5px", background: "white"}}>
              <div style={{color: "black"}} className="row">
                {soda === false ? <h1>Select a soda</h1> : <h1>{soda.productName}</h1>}
              </div>
              <div className="row">
                {soda === false ? "" : <RestockForm productName={soda.productName} max={soda.max} remaining={soda.remaining} handleSubmit={handleSubmit} />}
              </div>
            </Box>
            <Box sx={{paddingTop: "10px", paddingBottom: "10px", paddingLeft: "5px", paddingRight: "5px", background: "white"}}>
              <div className="row text-center">
                <Button sx={{background: "cyan", width: "50px"}} onClick={() => navigate("/")} variant="contained"><LogoutIcon /></Button>
              </div>
              <Modal
                open={overflow}
                onClose={() => setOverflow(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box className="text-center" component="span" sx={style}>
                  <div className="row">
                    <Typography sx={{marginTop: "5px", marginBottom: "5px", color: "red"}} label="Admin password" variant="outlined">Overflow</Typography>
                  </div>
                  <div className="row">
                    <Typography style={{marginTop: "5px", marginBottom: "5px"}} id="choice">Not enough space! Place a smaller quantity if it's not full</Typography>
                  </div>
                </Box>
              </Modal>
            </Box>
          </div>
          <div className="col-1" />
        </div>
      </div>
    </div>
  );
};

export default AdminVendingMachine;