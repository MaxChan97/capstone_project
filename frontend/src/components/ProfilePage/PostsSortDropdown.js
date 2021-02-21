import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    maxWidth: 90,
    minWidth: 90,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function PostsSortDropdown() {
  const classes = useStyles();
  const [sortBy, setSortBy] = React.useState("New");

  const handleChange = (event) => {
    setSortBy(event.target.value);
  };

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
          onChange={handleChange}
          displayEmpty
          className={classes.selectEmpty}
        >

          <MenuItem value={"New"}>New</MenuItem>
          <MenuItem value={"Top"}>Top</MenuItem>
          <MenuItem value={"Old"}>Old</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
