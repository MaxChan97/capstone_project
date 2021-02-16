import React from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Box from '@material-ui/core/Box';
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
}));

export default function UserSettings() {
    const classes = useStyles();
    //need to load the boolean before loading the page according to saved settings
    //cause now its default false when you enter the page
    const [state, setState] = React.useState({
        explicit: false,
        subscriberOnly: false,
    });

    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.checked });
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

    //load with the current user's pricing plan. Now it's 0 default
    const [pricing, setPricing] = React.useState(0);

    const handlePricing = (event) => {
        setPricing(event.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    return (
        <div className="content-wrapper">
            <div class="col-md-9" style={{ textAlign: "left" }}>
                <div class="card card-primary">

                    <form
                        onSubmit={handleSubmit}
                        className={classes.root}
                        noValidate
                        autoComplete="off"
                    >
                        <div class="card-body">

                            <Box fontWeight="fontWeightBold" fontSize={22} m={1}>
                                Subscription pricing
                            </Box>
                            <div style={{ display: "flex", alignItems: "baseline" }}>
                                <Box fontWeight="fontWeightBold" fontSize={18} m={1}>
                                    Pricing
                                </Box>

                                <TextField
                                    id="outlined-number"
                                    type="number"
                                    variant="outlined"
                                    size="small"
        
                                    InputProps={{
                                        inputProps: {
                                            max: 1000, min: 0
                                        }
                                    }}
                                    value={pricing}
                                    onChange={handlePricing}
                                />
                            </div>


                            <div style={{ textAlign: "right" }}>
                                <ColorButton
                                    style={{
                                        height: "30px",
                                        width: "100px",
                                        outline: "none",
                                        marginRight: "3%",
                                    }}
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                >
                                    Save
                            </ColorButton>
                            </div>
                            <Box fontWeight="fontWeightBold" fontSize={22} m={1}>
                                Content settings
                            </Box>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={state.explicit}
                                        onChange={handleChange}
                                        name="explicit"
                                        color="primary"
                                    />
                                }
                                label="Explicit Language"
                                labelPlacement="start"
                            />

                            <Box fontWeight="fontWeightRegular" m={1}>
                                Enable this setting if your stream contains language that may be inappropriate for younger audiences.
                                You should not broadcast content that contains any sexual activity, nudity, threats or extreme violence.
                                Doing so will result in immediate, irrevocable termination of your account.
                            </Box>
                            <br></br>
                            <Box fontWeight="fontWeightBold" fontSize={22} m={1}>
                                Chat settings
                            </Box>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={state.subscriberOnly}
                                        onChange={handleChange}
                                        name="subscriberOnly"
                                        color="primary"
                                    />
                                }
                                label="Subscriber-only"
                                labelPlacement="start"
                            />

                            <Box fontWeight="fontWeightRegular" m={1}>
                                Only enable private chat for subscribers.
                            </Box>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    );
}