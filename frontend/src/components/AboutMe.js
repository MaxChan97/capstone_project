import React, { useState } from "react";
import { useHistory, Redirect } from "react-router";
import { useSelector } from "react-redux";
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import TagFacesIcon from '@material-ui/icons/TagFaces';


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        listStyle: 'none',
        padding: theme.spacing(0.5),
        margin: 0,
    },
    chip: {
        margin: theme.spacing(0.5),
    },
}));

//chip is the topic tag

export default function CategoriesPage() {
    const classes = useStyles();
    const [chipData, setChipData] = React.useState([
        { key: 0, label: 'Angular' },
        { key: 1, label: 'jQuery' },
        { key: 2, label: 'Polymer' },
        { key: 3, label: 'React' },
        { key: 4, label: 'Vue.js' },
    ]);

    const currentUser = useSelector((state) => state.currentUser);
    if (currentUser === null) {
        return <Redirect to="/login" />;
    }

    return (
        <div className="content-wrapper">
            <div class="col-md-7" style={{ textAlign: "left" }}>
                <div class="card card-primary">
                    <div class="card-header">
                        <h3 class="card-title">About Me</h3>
                    </div>

                    <div class="card-body">

                        <strong><i class="fas fa-user mr-1"></i> About</strong>

                        <p>
                            Lorem ipsum dolor sit amet, id malorum accusata temporibus est,
                            impedit delectus quo in, possit nostro explicari ut eos. Mei eu
                            omnium vulputate, quodsi vituperatoribus sit te, sit ad iudico diceret.
                            Ad recteque scriptorem has. Mea oratio tincidunt ex, ei mea illum exerci,
                            ea sit omittam adipiscing deterruisset. Ut sea esse facilisis, periculis
                            inciderint eu vel. Ius habeo tractatos constituto no.
                        </p>

                        <hr></hr>

                        <strong><i class="fas fa-book mr-1"></i> Education</strong>

                        <p>
                            National University of Singapore <br></br>
                            Bachelor of Computing, Information Systems
                        </p>
                        <p class="text-muted">2016-2020</p>

                        <hr></hr>

                        <strong><i class="fas fa-pencil-alt mr-1"></i> Experience</strong>

                        <p>
                            Software Engineer <br></br>
                            Google
                        </p>
                        <p class="text-muted">2020 - Present</p>

                        <hr></hr>

                        <strong><i class="far fa-file-alt mr-1"></i> Topics</strong>

                        <Paper component="ul" className={classes.root}>
                            {chipData.map((data) => {
                                let icon;

                                if (data.label === 'React') {
                                    icon = <TagFacesIcon />;
                                }

                                return (
                                    <li key={data.key}>
                                        <Chip
                                            icon={icon}
                                            label={data.label}
                                            className={classes.chip}
                                        />
                                    </li>
                                );
                            })}
                        </Paper>
                    </div>

                </div>
            </div>
        </div>
    );
}
