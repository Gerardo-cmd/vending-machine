import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import LogoutIcon from '@mui/icons-material/Logout';
import CircularProgress from '@mui/material/CircularProgress';
import { Box, Button } from '@mui/material';
import NewSodaForm from '../NewSodaForm/NewSodaForm';
import RestockForm from '../RestockForm/RestockForm';
import NewSodaCard from '../NewSodaCard/NewSodaCard';
import SodaCard from '../SodaCard/SodaCard';
import CustomAlert from '../CustomAlert/CustomAlert';
import EditSodaForm from '../EditSodaForm/EditSodaForm';
import SodaOptions from '../SodaOptions/SodaOptions';
import RemoveSodaForm from '../RemoveSodaForm/RemoveSodaForm';

const AdminVendingMachine = () => {
  const navigate = useNavigate();
  const [sodas, setSodas] = useState([]);
  const [selectedSoda, setSelectedSoda] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [overflow, setOverflow] = useState(false);
  const [restockSoda, setRestockSoda] = useState(false);
  const [newSoda, setNewSoda] = useState(false);
  const [editSoda, setEditSoda] = useState(false);
  const [removingSoda, setRemovingSoda] = useState(false);
  const [reload, triggerReload] = useState(false);

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("admin-token");
    if (token == null) {
      navigate("/");
    }
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    fetch("/sodas", {
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
    .catch((error) => {
      navigate("/error");
      console.log(error);
    });
  }, [navigate, reload]);

  const handleSodaSelection = (soda) => {
    setNewSoda(false);
    setEditSoda(false);
    setRemovingSoda(false);
    setRestockSoda(false);
    setSelectedSoda(soda);
  }

  const handleRestockSelection = (soda) => {
    setEditSoda(false);
    setRemovingSoda(false);
    setNewSoda(false);
    setRestockSoda(soda);
  };

  const handleEditSelection = (soda) => {
    setRestockSoda(false);
    setRemovingSoda(false);
    setNewSoda(false);
    setEditSoda(soda);
  };

  const handleChooseNewSoda = (soda) => {
    setSelectedSoda(false);
    setRestockSoda(false);
    setEditSoda(false);
    setRemovingSoda(false);
    setNewSoda(true);
  };

  const handleRemoveSelection = (soda) => {
    setNewSoda(false);
    setRestockSoda(false);
    setEditSoda(false);
    setRemovingSoda(soda);
  }

  const verifyUniqueName = (name) => {
    let unique = true;
    sodas.forEach((soda) => {
      if (soda.productName.toLowerCase() === name.toLowerCase()) {
        unique = false;
      }
    });
    return unique;
  };

  const handleRestockSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("admin-token");
    if (token == null) {
      navigate("/");
    }
    if ((parseInt(e.target.quantity.value) + parseInt(restockSoda.remaining)) > parseInt(restockSoda.max)) {
      setOverflow(true);
      setErrorMessage("");
      return;
    }
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Authorization', `Bearer ${token}`);
    const data = {productName: restockSoda.productName, quantity: e.target.quantity.value};
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
      setRestockSoda(false);
      setNewSoda(false);
      setEditSoda(false);
      setRemovingSoda(false);
      setSelectedSoda(false);
      triggerReload(!reload);
      return;
    })
    .catch((error) => {
      setOverflow(false);
      setSelectedSoda(false);
      setRestockSoda(false);
      setEditSoda(false);
      setNewSoda(false);
      triggerReload(!reload);
      console.log(error);
    });
    return;
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("admin-token");
    if (token == null) {
        navigate("/");
    }
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Authorization', `Bearer ${token}`);
    let cost = e.target.cost.value.trim();
    if (cost.includes(".")) { // Cuts down to 2 decimal places if necessary
      const arrCost = e.target.cost.value.split(".");
      const oldDecimal = arrCost[1];
      let newArr = [];
      for (let index = 0; index < oldDecimal.length; index++) {
        if (index === 2) {
          break;
        }
        newArr.push(arrCost[1].split("")[index]);
      }
      const decimal = newArr.join("");
      cost = arrCost[0] + "." + decimal;
    }
    const data = {
      productName: editSoda.productName,
      newCost: cost !== "1" && cost !== "1.0" && cost !== "1.00" ? cost + " dollars US" : cost + " dollar US",
    };
    fetch("/product-update", {
        method: 'POST',
        mode: 'cors',
        headers: headers,
        body: JSON.stringify(data)
    })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      setRestockSoda(false);
      setNewSoda(false);
      setEditSoda(false);
      setRemovingSoda(false);
      setSelectedSoda(false);
      triggerReload(!reload);
      return;
    })
    .catch((error) => {
        console.log(error);
        return;
    });
    return;
  };

  const handleAddNewProduct = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("admin-token");
    if (token == null) {
        navigate("/");
    }
    if (!verifyUniqueName(e.target.productName.value.trim())) {
      setOverflow(false);
      setErrorMessage("A soda with that name already exists! Please choose another name");
      return;
    }
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Authorization', `Bearer ${token}`);
    let cost = e.target.cost.value.trim();
    if (cost.includes(".")) { // Cuts down to 2 decimal places if necessary
      const arrCost = e.target.cost.value.split(".");
      const oldDecimal = arrCost[1];
      let newArr = [];
      for (let index = 0; index < oldDecimal.length; index++) {
        if (index === 2) {
          break;
        }
        newArr.push(arrCost[1].split("")[index]);
      }
      const decimal = newArr.join("");
      cost = arrCost[0] + "." + decimal;
    }
    const data = {
      productName: e.target.productName.value.trim(), 
      description: e.target.description.value.trim(),
      cost: cost !== "1" && cost !== "1.0" && cost !== "1.00" ? cost + " dollars US" : cost + " dollar US",
      max: parseInt(e.target.max.value.trim())
    };
    fetch("/new-product", {
        method: 'POST',
        mode: 'cors',
        headers: headers,
        body: JSON.stringify(data)
    })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      setRestockSoda(false);
      setNewSoda(false);
      setEditSoda(false);
      setRemovingSoda(false);
      setSelectedSoda(false);
      triggerReload(!reload);
      return;
    })
    .catch((error) => {
        console.log(error);
        return;
    });
    return;
  };

  const handleRemovalSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("admin-token");
    if (token == null) {
        navigate("/");
    }
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Authorization', `Bearer ${token}`);
    const data = {
      productName: removingSoda.productName
    };
    fetch('/product-removal', {
        method: 'DELETE',
        mode: 'cors',
        headers: headers,
        body: JSON.stringify(data)
    })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      setRestockSoda(false);
      setNewSoda(false);
      setEditSoda(false);
      setRemovingSoda(false);
      setSelectedSoda(false);
      triggerReload(!reload);
      return;
    })
    .catch((error) => {
        console.log(error);
        return;
    });
    return;
  }

  return (
    <div id="page" className="container-fluid">
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
                  <div className="col-lg-3 col-md-4 col-sm-6">
                    <NewSodaCard callbackFunction={handleChooseNewSoda} />
                  </div>
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
                          callbackSodaSelection={handleSodaSelection}
                          callbackRestock={handleRestockSelection}
                          callbackEdit={handleEditSelection}
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
            <div className="row">
              {(!selectedSoda && !newSoda) ? 
                <Box className="text-center col" sx={{paddingTop: "10px", paddingBottom: "10px", paddingLeft: "5px", paddingRight: "5px", background: "white", minHeight: "150px"}}>
                  <div style={{color: "black"}} className="row">
                    {!newSoda && !selectedSoda ? <h1>Select a soda</h1> : ""}
                  </div>
                </Box> 
                : 
                selectedSoda ? 
                  <SodaOptions 
                    productName={selectedSoda.productName} 
                    description={selectedSoda.description} 
                    cost={selectedSoda.cost} 
                    max={selectedSoda.max} 
                    remaining={selectedSoda.remaining} 
                    code={selectedSoda.code} 
                    callbackRestock={handleRestockSelection} 
                    callbackEdit={handleEditSelection} 
                    callbackRemove={handleRemoveSelection}
                  />
                  :
                  <NewSodaForm handleSubmit={handleAddNewProduct} />
              }
            </div>
            <Box className="text-center row" sx={{paddingTop: "10px", paddingBottom: "10px", paddingLeft: "5px", paddingRight: "5px", background: "white", minHeight: "150px"}}>
              <div style={{color: "black"}} className="row">
                {!editSoda ? "" : <h1>{editSoda.productName}</h1>}
                {!restockSoda ? "" : <h1>{restockSoda.productName}</h1>}
              </div>
              <div className="row">
                {!restockSoda ? "" : <RestockForm productName={restockSoda.productName} max={restockSoda.max} remaining={restockSoda.remaining} handleSubmit={handleRestockSubmit} />}
              </div>
              <div className="row">
                {!editSoda ? "" : <EditSodaForm productName={editSoda.productName} cost={editSoda.cost.replace(" dollar US", "")} handleSubmit={handleEditSubmit} />}
              </div>
              <div className="row">
                {!removingSoda ? "" : <RemoveSodaForm productName={removingSoda.productName} handleSubmit={handleRemovalSubmit} />}
              </div>
            </Box>
            <Box className="row text-center" sx={{paddingTop: "10px", paddingBottom: "10px", paddingLeft: "5px", paddingRight: "5px", background: "white"}}>
              <div className="row text-center">
                <Button 
                  sx={{background: "cyan", width: "50px"}} 
                  onClick={() => {
                    localStorage.removeItem("admin-token");
                    navigate("/");
                  }} 
                  variant="contained"
                >
                  <LogoutIcon />
                </Button>
              </div>
              <CustomAlert
                open={overflow}
                onClose={() => {
                  setOverflow(false);
                  setErrorMessage("");
                }}
                title="Overflow"
                description="Not enough space! Select a smaller quantity to restock."
              />
              <CustomAlert
                open={errorMessage !== ""}
                onClose={() => {
                  setOverflow(false);
                  setErrorMessage("");
                }}
                title="Inalid Name"
                description="There already is a soda with the same name. Please choose a different name."
              />
            </Box>
          </div>
          <div className="col-1" />
        </div>
      </div>
    </div>
  );
};

export default AdminVendingMachine;