import React from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Box from '@material-ui/core/Box';
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import defaultDP from "../../assets/Default Dp logo.svg";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import profileBanner from "../../assets/Profile Banner Image.png"
import Select from "react-select";
import Api from "../../helpers/Api";

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
}));

const colourOptions = [
    { value: 'ocean', label: 'Ocean'},
    { value: 'blue', label: 'Blue'}
];

export default function CustomiseProfile(props) {
    const classes = useStyles();
    //need to load the boolean before loading the page according to saved settings
    //cause now its default false when you enter the page
    // const [state, setState] = React.useState({
    //     username: "",
    //     about: ""
    // });

    // const handleChange = (event) => {
    //     setState({ ...state, [event.target.name]: event.target.checked });
    // };

    const ColorButton = withStyles((theme) => ({
        root: {
            color: theme.palette.getContrastText("#3B21CB"),
            backgroundColor: "#3B21CB",
            "&:hover": {
                backgroundColor: "#260eab",
            },
        },
    }))(Button);

    // //load with the current user's pricing plan. Now it's 0 default
    // const [pricing, setPricing] = React.useState(0);

    // const handlePricing = (event) => {
    //     setPricing(event.target.value);
    // };

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
                                Profile Picture
                            </Box>
                            <div style={{ display: "flex", alignItems: "baseline" }}>
                                <Container>
                                    <Row>
                                        <Col sm={3}>
                                            <img style={{
                                                resizeMode: "repeat",
                                                height: 100,
                                                width: 100
                                                }} src={defaultDP} alt="defaultDP" />
                                        </Col>
                                        <Col sm={9}>
                                            <ColorButton
                                                style={{
                                                    height: "35px",
                                                    width: "200px",
                                                    outline: "none",
                                                    marginRight: "3%",
                                                }}
                                                variant="contained"
                                                color="primary"
                                                type="submit">
                                                Add Profile Picture
                                            </ColorButton>
                                            <Box fontWeight="fontWeightRegular" m={1}>
                                                JPEG or PNG only and cannot exceed 10MB. 
                                                It’s recommended to use a picture that’s at least 100 x 100 pixels
                                            </Box>
                                        </Col>
                                    </Row>
                                </Container>
                            </div>
                            <br></br>

                            <Box fontWeight="fontWeightBold" fontSize={22} m={1}>
                                Profile Banner
                            </Box>
                            <img style={{
                                resizeMode: "repeat",
                                height: 80,
                                width: 512
                                }}
                                src={profileBanner} alt="profileBanner" />
                            <Box fontWeight="fontWeightRegular" m={1}>
                                File format: JPEG or PNG (recommended 1024 x 160 , max 10MB)
                            </Box>
                            <ColorButton
                                style={{
                                    height: "35px",
                                    width: "100px",
                                    outline: "none",
                                    marginRight: "3%",
                                }}
                                variant="contained"
                                color="primary"
                                type="submit">
                                Upload
                            </ColorButton>  
                            <br></br>
                            <br></br>
                            
                            <Box fontWeight="fontWeightBold" fontSize={22} m={1}>
                                Profile Details
                            </Box>
                            <form onSubmit={(e) => this.handleSubmit(e)}>
                                <div className="card-body">
                                <div className="form-group">
                                    <label htmlFor="inputUsername">Username</label>
                                    <input
                                    type="text"
                                    id="inputUsername"
                                    // required
                                    className="form-control"
                                    //value={this.state.username}
                                    //onChange={(e) => this.updateUsername(e)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="inputAbout">About</label>
                                    <input
                                    type="text"
                                    id="inputAbout"
                                    // required
                                    className="form-control"
                                    //value={this.state.about}
                                    //onChange={(e) => this.updateAbout(e)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="inputInterests">Interests</label>
                                    <Select
                                        defaultValue={[colourOptions[0]]}
                                        isMulti
                                        name="colors"
                                        options={colourOptions}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                    />
                                </div>
                                <div className="form-group">
                                    <button className="btn btn-primary float-right" type="submit">
                                        Submit
                                    </button>
                                </div>
                                </div>
                            </form>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    );
}