import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(2),
        maxWidth: 120,
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

export default function SortReportDropdown() {
    const classes = useStyles();
    const [sortBy, setSortBy] = React.useState("");

    function handleAll() {
        setSortBy("All");
    }

    function handlePending() {
        setSortBy("Pending");
    }

    function handleResolved() {
        setSortBy("Resolved");
    }

    function handleVoid() {
        setSortBy("Void");
    }

    return (
        <div>
            <FormControl className={classes.formControl}>
                <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                    Sort by
                </InputLabel>
                <Select
                    labelId="demo-simple-select-placeholder-label-label"
                    id="demo-simple-select-placeholder-label"
                    value={sortBy}
                    displayEmpty
                    className={classes.selectEmpty}
                >

                    <MenuItem value={"All"} onClick={handleAll} >All</MenuItem>
                    <MenuItem value={"Pending"} onClick={handlePending}>Pending</MenuItem>
                    <MenuItem value={"Resolved"} onClick={handleResolved}>Resolved</MenuItem>
                    <MenuItem value={"Void"} onClick={handleVoid}>Void</MenuItem>
                </Select>
            </FormControl>
        </div>
    );
}
