import React, { useState, useEffect } from "react";
import { DataGrid, GridColumnIcon, GridToolbar } from '@material-ui/data-grid';
import { useHistory, Redirect } from "react-router";
import { withStyles } from "@material-ui/core/styles";
import ban from "../../assets/ban.svg";
import Api from "../../helpers/Api";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Banned from "../../screens/AdminBannedAccessPage";
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import { makeStyles } from '@material-ui/core/styles';
import { isOverflown } from '@material-ui/data-grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import moment from "moment";

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@material-ui/core";

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

const ColorButton = withStyles((theme) => ({
    root: {
        color: theme.palette.getContrastText("#3B21CB"),
        backgroundColor: "#3B21CB",
        "&:hover": {
            backgroundColor: "#260eab",
        },
    },
}))(Button);


/*
const rows = [
    { id: 1, admin: 'admin3', adminLogsType: 'RESOLVE_REPORT', dateCreated: '12/1/2021', description: "Resolved report on errant user" },
    { id: 2, admin: 'admin5', adminLogsType: 'VOID_REPORT', dateCreated: '22/1/2021', description: "False report that is invalid" },
    { id: 3, admin: 'admin6', adminLogsType: 'BAN_USER', dateCreated: '12/5/2021', description: "User posted investment scams that are potentially dangerous to other users. Banned from login" },
    { id: 4, admin: 'admin4', adminLogsType: 'UNBAN_USER', dateCreated: '12/1/2021', description: "lorem ipsum" },
    { id: 5, admin: 'admin1',  adminLogsType: 'DELETE_POST', dateCreated: '12/1/2020', description: "User is deceiving others to generate a financial or personal benefit to the detriment of a third party or entity through investment or financial scams" },
    { id: 6, admin: 'admin2', adminLogsType: 'DELETE_COMMENT', dateCreated: '11/3/2021', description: "lorem ipsum" },
    { id: 7, admin: 'admin3', adminLogsType: 'DELETE_REPLY', dateCreated: '5/10/2021', description: "lorem ipsum" },
    { id: 8, admin: 'admin3', adminLogsType: 'DELETE_COMMUNNITY', dateCreated: '6/8/2020', description: "lorem ipsum" },
];
*/

export default function AllAdminLogs() {
    const isAdmin = useSelector((state) => state.isAdmin);

    const [rows, setRows] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    function loadData() {
        Api.getAllAdminLogs()
            .done((list) => {
                setRows(list);
            })
            .fail(() => {
                alert.show("Unable to load!");
            });
    }

    const formatAdminId = {
        width: 180,
        headerName: 'Admin',
        sortable: false,
        filterable: false,
        renderCell: (params) => ("" + params.getValue('admin').username),
        //valueFormatter: ({ value }) => value.id,
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 80, renderCell: renderCellExpand },
        { field: 'admin', ...formatAdminId },
        { field: 'adminLogsType', headerName: 'Log Type', width: 240, renderCell: renderCellExpand, },
        { field: 'description', headerName: 'Description', width: 800, renderCell: renderCellExpand, },

    ];


    return isAdmin == true && rows != null ? (
        <div>
            <div className="content-wrapper">
                <div style={{paddingLeft:"20px", paddingRight:"20px", paddingTop:"4px"}} >
                    <div className="col-md-12 mt-4">
                        <div class="card bg-white">
                            <h5 class="card-header" style={{ margin: "auto", textAlign: "center", width: "100%", backgroundColor: "#E8E8E8", }}>Admin Logs</h5>

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
                </div>
            </div>
        </div>
    ) : (
        <div>
            <div style={{ margin: "auto", textAlign: "center" }}>
                <CircularProgress />
            </div>
        </div>
    );
}
