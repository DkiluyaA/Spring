import React, {useEffect} from 'react';

import Modal from '@material-ui/core/Modal';
import {infoBody} from "../initData";

import {makeStyles} from '@material-ui/core/styles';

export const SimpleModal = ({openModal, handleSetOpen}) => {

    const rand = () => Math.round(Math.random() * 20) - 10;

    const getModalStyle = () => {
        const top = 50 + rand();
        const left = 50 + rand();

        return {
            top: `${top}%`,
            left: `${left}%`,
            transform: `translate(-${top}%, -${left}%)`,
        };
    }

    const useStyles = makeStyles((theme) => ({
        paper: {
            position: 'absolute',
            width: 400,
            backgroundColor: theme.palette.background.paper,
            border: '2px solid #000',
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
        },
    }));

    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);

    const handleClose = () => {
        handleSetOpen(false)
    }

    const body = <div style={modalStyle} className={classes.paper}>
        <h2 id="simple-modal-title">Text in a modal</h2>
        <p id="simple-modal-description">
            {infoBody}
        </p>
        <SimpleModal/>
    </div>;

    return (
      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        >
        {body}
      </Modal>
    )
}

