import React, { useState } from "react";
import { useHistory, Redirect } from "react-router";
import { useSelector } from "react-redux";
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';


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

export default function AboutMe() {
    const classes = useStyles();
    const [chipData, setChipData] = React.useState([
        { key: 0, label: 'Stocks' },
        { key: 1, label: 'Insurance' },
        { key: 2, label: 'CPF' },
        { key: 3, label: 'Savings' },
        { key: 4, label: 'React' },
    ]);

    const currentUser = useSelector((state) => state.currentUser);
    if (currentUser === null) {
        return <Redirect to="/login" />;
    }

    return (
        <div className="content-wrapper">
            <div class="col-md-8" style={{ textAlign: "left" }}>
                <div class="card card-primary">
                  

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


                        <strong><i class="far fa-file-alt mr-1"></i> Interests</strong>

                        <div component="ul" className={classes.root}>
                            {chipData.map((data) => {

                                return (
                                    <li key={data.key}>
                                        <Chip
                                           
                                            label={data.label}
                                            className={classes.chip}
                                        />
                                    </li>
                                );
                            })}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
