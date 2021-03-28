import * as React from 'react';
import { DataGrid, GridColumnIcon, GridToolbar } from '@material-ui/data-grid';
import { useHistory, Redirect } from "react-router";
import { withStyles } from "@material-ui/core/styles";
import ban from "../../assets/ban.svg";
import Api from "../../helpers/Api";
import { Link } from "react-router-dom";

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@material-ui/core";


const ColorButton = withStyles((theme) => ({
    root: {
        color: theme.palette.getContrastText("#3B21CB"),
        backgroundColor: "#3B21CB",
        "&:hover": {
            backgroundColor: "#260eab",
        },
    },
}))(Button);



const rows = [
    { id: 1, username: 'Admin 1', createdDate: '12/1/1999', email: "admin1@bnb.com" },
    { id: 2, username: 'Lannister', createdDate: '22/1/1999', email: "admin2@bnb.com" },
    { id: 3, username: 'Lannister', createdDate: '12/5/1999', email: "admin3@bnb.com" },
    { id: 4, username: 'Stark', createdDate: '12/1/1989', email: "admin4@bnb.com" },
    { id: 5, username: 'Targaryen', createdDate: '12/1/2000', email: "admin5@bnb.com" },
    { id: 6, username: 'Melisandre', createdDate: '11/3/1999', email: "admin6@bnb.com" },
    { id: 7, username: 'Clifford', createdDate: '5/10/1989', email: "admin7@bnb.com" },
    { id: 8, username: 'Donald', createdDate: '6/8/1979', email: "admin8@bnb.com" },
];


export default function AdminList() {
    const [confirmBanDialogOpen, setConfirmBanDialogOpen] = React.useState(false);
    const banPerson = () => {
        openBanPersonModal();
    };

    function openBanPersonModal() {
        setConfirmBanDialogOpen(true);
    }

    function closeBanPersonModal() {
        setConfirmBanDialogOpen(false);
    }

    function handleBanPerson() {
    }

    const columns = [
        { field: 'id', headerName: 'ID', width: 120, },
        { field: 'username', headerName: 'Username', width: 250 },
        //{ field: 'createdDate', headerName: 'Date Joined', width: 270 },
        { field: 'email', headerName: 'Email', width: 300 },
        {
            field: 'nothing',
            headerName: 'View Logs',
            sortable: false,
            filterable: false,
            width: 150,
            renderCell: (params) => (
                <div>
                    <Link to="/admin/log">
                        <i className="far fa-eye" style={{marginLeft: 30, color: "#3B21CB",}}></i>
                    </Link>
                </div>
            ),
        },

        {
            field: 'nothing2',
            headerName: 'Deactivate',
            width: 150,
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
                            onClick={banPerson}
                        />
                    </button>
                    <Dialog
                        open={confirmBanDialogOpen}
                        onClose={closeBanPersonModal}
                        aria-labelledby="confirm-delete-dialog-title"
                        aria-describedby="confirm-delete-dialog-description"
                    >
                        <DialogTitle id="confirm-delete-dialog-title">
                            Deactivate Administrator Account
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="confirm-delete-dialog-description">
                                Are you sure you want to deactivate administrator account?
                            </DialogContentText>
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
                </div>
            ),
        }
    ];


    return  (
        <div>
            <div class="card bg-white">
                <h5 class="card-header" style={{ margin: "auto", textAlign: "center", width:"100%", backgroundColor:"#E8E8E8"}}>Administrators Master List</h5>

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
    );
}
