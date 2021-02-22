import React, { useEffect, useState } from "react";
import { useHistory, Redirect, useParams } from "react-router";
import { useSelector } from "react-redux";
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Box from '@material-ui/core/Box';
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import defaultDP from "../assets/Default Dp logo.svg";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import profileBanner from "../assets/Profile Banner Image.png"
import Select from "react-select";
import Api from "../helpers/Api";
import { useAlert } from "react-alert";

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
}));

const topics = [
    { value: 'REAL_ESTATE', label: 'Real Estate'},
    { value: 'FUTURES', label: 'Futures'},
    { value: 'CRYPTOCURRENCY', label: 'Cryptocurrency'},
    { value: 'STOCKS', label: 'Stocks'}
];

export default function CustomiseProfile() {
    const classes = useStyles();
    const alert = useAlert();
    

    const [username, setUsername] = useState();
    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const [description, setAbout] = useState();
    const handleAboutChange = (event) => {
        setAbout(event.target.value);
    };

    const [topicInterests, setTopicInterests] = useState();
    console.log(topicInterests);
    const handleTopicInterestsChange = (selectedOptions) => {
        let tempSelectedOptions = [];
        for (var i = 0; i < selectedOptions.length; i++) {
            tempSelectedOptions.push(selectedOptions[i].value);
        }
        console.log(tempSelectedOptions);
        setTopicInterests(tempSelectedOptions);
    };

    const handleInputChange = (value, e) => {
        if (e.action === "input-change") {
          this.setState({ value });
        }
      };

    
    const [currentPerson, setCurrentPerson] = useState({});
    const [refresh, setRefresh] = useState(true);

    const currentUser = useSelector((state) => state.currentUser);

    useEffect(() => {
        if (currentUser) {
          loadData(currentUser);
          console.log(topicInterests);
        }
    }, [currentUser, refresh]);

    
    if (currentUser === null) {
      return <Redirect to="/login" />;
    }
    

  function loadData(currentUser) {
    Api.getPersonById(currentUser)
        .done((currentPerson) => {
        setCurrentPerson(currentPerson);
        setUsername(currentPerson.username);
        setAbout(currentPerson.description);
        setTopicInterests(currentPerson.topicInterests);
        })
        .fail((xhr, status, error) => {
        alert.show("This user does not exist!");
        });
    }

    function toTitleCase(str) {
        var i, frags = str.split('_');
        for (i=0; i<frags.length; i++) {
            frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].substr(1).toLowerCase();
        }
        return frags.join(' ');
    }
    
    function MakeOption(x) {
        return { value: x, label: toTitleCase(x) };
    }


    const ColorButton = withStyles((theme) => ({
        root: {
            color: theme.palette.getContrastText("#3B21CB"),
            backgroundColor: "#3B21CB",
            "&:hover": {
                backgroundColor: "#260eab",
            },
        },
    }))(Button);

    const handleSubmit = (e) => {
        e.preventDefault();
  
        Api.editPersonProfileInformation(currentUser, username, description, topicInterests)
          .done(() => {
            alert.show("Profile updated successfully!");
            setRefresh(!refresh);
          })
          .fail((xhr, status, error) => {
            alert.show("Something went wrong, please try again!");
          });

    };
    return (
        <div className="content-wrapper">
            <div class="col-md-9" style={{ textAlign: "left" }}>
                <div class="card card-primary">
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
                                                fontWeight: "600",
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
                                fontWeight: "600",
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
                        <form onSubmit={(e) => handleSubmit(e)}>
                            <div className="card-body">
                            <div className="form-group">
                                <label htmlFor="inputUsername">Username</label>
                                <input
                                type="text"
                                id="inputUsername"
                                // required
                                className="form-control"
                                value={username}
                                onChange={handleUsernameChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="inputAbout">About</label>
                                <input
                                type="text"
                                id="inputAbout"
                                // required
                                className="form-control"
                                value={description}
                                onChange={handleAboutChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="inputInterests">Interests</label>
                                {topicInterests !== undefined ? (<Select
                                    value={topicInterests.map(x => MakeOption(x))}
                                    isMulti
                                    name="topics"
                                    options={topics}
                                    onChange={(selectedOptions) => handleTopicInterestsChange(selectedOptions)}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                />) : 
                                (<Select
                                    isMulti
                                    name="topics"
                                    options={topics}
                                    onChange={(selectedOptions) => handleTopicInterestsChange(selectedOptions)}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                />)}
                                
                            </div>
                            <div className="form-group">
                                <ColorButton
                                    style={{
                                        height: "35px",
                                        width: "100px",
                                        outline: "none",
                                        float: 'right',
                                        fontWeight: "600",
                                    }}
                                    variant="contained"
                                    color="primary"
                                    type="submit">
                                    Save
                                </ColorButton>
                            </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    );
}