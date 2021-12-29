import { Box, Modal, Typography } from '@mui/material';

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

const CustomAlert = (props) => {
    return (
        <Modal
            open={props.open}
            onClose={props.onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
            <Box className="text-center" component="span" sx={style}>
                <div className="row">
                <Typography sx={{marginTop: "5px", marginBottom: "5px", color: "red"}} label="Admin password" variant="outlined">{props.title}</Typography>
                </div>
                <div className="row">
                <Typography style={{marginTop: "5px", marginBottom: "5px"}} id="choice">{props.description}</Typography>
                </div>
            </Box>
        </Modal>
    )
};

export default CustomAlert;