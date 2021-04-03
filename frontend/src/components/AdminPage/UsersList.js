import React, { useState, useEffect } from "react";
import { DataGrid, GridColumnIcon, GridToolbar } from '@material-ui/data-grid';
import { useHistory, Redirect } from "react-router";
import { withStyles } from "@material-ui/core/styles";
import ban from "../../assets/ban.svg";
import Api from "../../helpers/Api";
import { Link } from "react-router-dom";
import CircularProgress from '@material-ui/core/CircularProgress';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@material-ui/core";

import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import { makeStyles } from '@material-ui/core/styles';
import { isOverflown } from '@material-ui/data-grid';
import moment from "moment";
import { useSelector } from "react-redux";
import { useAlert } from "react-alert";
const ColorButton = withStyles((theme) => ({
    root: {
        color: theme.palette.getContrastText("#3B21CB"),
        backgroundColor: "#3B21CB",
        "&:hover": {
            backgroundColor: "#260eab",
        },
    },
}))(Button);

const useStyles = makeStyles(() => ({
    root: {
        alignItems: 'center',
        lineHeight: '24px',
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
        '& .cellValue': {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        },
    },
}));
//to expand overflowed cells
const GridCellExpand = React.memo(function GridCellExpand(props) {
    const { width, value } = props;
    const wrapper = React.useRef(null);
    const cellDiv = React.useRef(null);
    const cellValue = React.useRef(null);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const classes = useStyles();
    const [showFullCell, setShowFullCell] = React.useState(false);
    const [showPopper, setShowPopper] = React.useState(false);

    const handleMouseEnter = () => {
        const isCurrentlyOverflown = isOverflown(cellValue.current);
        setShowPopper(isCurrentlyOverflown);
        setAnchorEl(cellDiv.current);
        setShowFullCell(true);
    };

    const handleMouseLeave = () => {
        setShowFullCell(false);
    };

    React.useEffect(() => {
        if (!showFullCell) {
            return undefined;
        }

        function handleKeyDown(nativeEvent) {
            // IE11, Edge (prior to using Bink?) use 'Esc'
            if (nativeEvent.key === 'Escape' || nativeEvent.key === 'Esc') {
                setShowFullCell(false);
            }
        }

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [setShowFullCell, showFullCell]);

    return (
        <div
            ref={wrapper}
            className={classes.root}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div
                ref={cellDiv}
                style={{
                    height: 1,
                    width,
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                }}
            />
            <div ref={cellValue} className="cellValue">
                {value}
            </div>
            {showPopper && (
                <Popper
                    open={showFullCell && anchorEl !== null}
                    anchorEl={anchorEl}
                    style={{ width, marginLeft: -17 }}
                >
                    <Paper
                        elevation={10}
                        style={{ minHeight: wrapper.current.offsetHeight - 3 }}
                    >
                        <Typography variant="body2" style={{ padding: 8 }}>
                            {value}
                        </Typography>
                    </Paper>
                </Popper>
            )}
        </div>
    );
});

GridCellExpand.propTypes = {
    value: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
};

function renderCellExpand(params) {
    return (
        <GridCellExpand
            value={params.value ? params.value.toString() : ''}
            width={params.colDef.width}
        />
    );
}

renderCellExpand.propTypes = {
    /**
     * The column of the row that the current cell belongs to.
     */
    colDef: PropTypes.any.isRequired,
    /**
     * The cell value, but if the column has valueGetter, use getValue.
     */
    value: PropTypes.oneOfType([
        PropTypes.instanceOf(Date),
        PropTypes.number,
        PropTypes.object,
        PropTypes.string,
        PropTypes.bool,
    ]),
};

export default function UsersList() {
    const alert = useAlert();
    const [rows, setRows] = useState(null);
    const currentUser = useSelector((state) => state.currentUser);
    useEffect(() => {
        loadData();
    }, []);

    function loadData() {
        Api.getAllPerson()
            .done((list) => {
                setRows(list);
            })
            .fail(() => {
                alert.show("Error!");
            });
    }
    const [confirmBanDialogOpen, setConfirmBanDialogOpen] = React.useState(false);
    const [currentPerson, setCurrentPerson] = React.useState(null);

    function banPerson() {
        openBanPersonModal();

    };

    function openBanPersonModal() {
        setConfirmBanDialogOpen(true);
    }

    function closeBanPersonModal() {
        setConfirmBanDialogOpen(false);
    }

    function handleClick(id) {

        Api.getPersonById(id)
            .done((currentPerson) => {
                setCurrentPerson(currentPerson);
                banPerson();
            });

    }

    function handleBanPerson() {
        if(currentPerson.isBannedFromLogin == false) {
            Api.banPersonFromLogin(currentUser, currentPerson.id, reason, null)
            .done((list) => {
                alert.show("User is banned from login");
                setReason("");
            })
            .fail(() => {
                setReason("");
                alert.show("Error!");
            });
        }
    }

    const [reason, setReason] = useState("");
    const handleReasonChange = (event) => {
        setReason(event.target.value);
    };
    const columns = [
        { field: 'id', headerName: 'ID', width: 120, renderCell: renderCellExpand, },
        { field: 'username', headerName: 'Username', width: 250, renderCell: renderCellExpand, },
        //{ field: 'createdDate', headerName: 'Date Joined', width: 270 },
        { field: 'email', headerName: 'Email', width: 300, renderCell: renderCellExpand, },
        /*{ field: 'contributorPoints', headerName: 'Contributor Points', width: 220, renderCell:  renderCellExpand, },*/
        {
            field: 'nothing',
            headerName: 'View Profile',
            sortable: false,
            filterable: false,
            width: 154,

            renderCell: (params) => (
                <div>
                    <Link to={"/profile/" + `${params.getValue('id') || ''}`}>
                        <i className="far fa-eye" style={{ marginLeft: 35, color: "#3B21CB", }}></i>
                    </Link>
                </div>
            ),

        },
        {
            field: 'nothing2',
            headerName: 'Ban User',
            width: 140,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <div>
                    <button
                        style={{
                            height: "25px",
                            width: "25px",
                            backgroundColor: "transparent",
                            borderColor: "transparent",
                            marginLeft: 18,
                            outline: "none",
                        }}
                    >
                        <img
                            style={{
                                height: "25px",
                                width: "25px",
                            }}
                            src={ban}
                            alt="banLogo"
                            onClick={(event) => handleClick(params.getValue('id'))}
                        />

                    </button>

                </div>
            ),
        }
    ];


    return rows != null ? (
        <div style={{ paddingTop: "24px" }}>
            <div class="card bg-white" >
                {currentPerson != null ? (
                    <Dialog
                        open={confirmBanDialogOpen}
                        onClose={closeBanPersonModal}
                        aria-labelledby="confirm-delete-dialog-title"
                        aria-describedby="confirm-delete-dialog-description"
                    >
                        <DialogTitle id="confirm-delete-dialog-title">
                            Ban User From Login {" "} <i class='fas fa-user-shield'></i>
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="confirm-delete-dialog-description">
                                Are you sure you want to ban {currentPerson.username} from login? {" "}
                                {currentPerson.username} will no longer have login access after a ban.
                            </DialogContentText>
                            <p htmlFor="inputReason">Enter a reason for accountability: </p>
                            <input
                                type="text"
                                id="inputReason"
                                className="form-control"
                                value={reason}
                                required="required"
                                onChange={handleReasonChange}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button style={{ outline: "none" }} onClick={closeBanPersonModal}>
                                Cancel
                            </Button>
                            <ColorButton
                                style={{ outline: "none" }}
                                onClick={handleBanPerson}
                                color="primary"
                                variant="contained"
                                autoFocus
                            >
                                Confirm
                            </ColorButton>
                        </DialogActions>
                    </Dialog>
                ) : (" ")}
                <h5 class="card-header" style={{ margin: "auto", textAlign: "center", width: "100%", backgroundColor: "#E8E8E8" }}>Users Master List</h5>

                <div style={{ display: 'flex', height: 510, width: '100%' }}>
                    <div style={{ flexGrow: 1 }}>
                        <DataGrid rows={rows} columns={columns} pageSize={7}
                            components={{
                                Toolbar: GridToolbar,
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <div style={{ margin: "auto", textAlign: "center" }}>
            <CircularProgress />
        </div>
    );
}
