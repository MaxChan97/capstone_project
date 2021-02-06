import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ProfilePostCard from './ProfilePostCard'

//INCOMPLETE

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: '36ch',
        backgroundColor: theme.palette.background.paper,
    },
    inline: {
        display: 'inline',
    },
}));

export default function PostList({dataList}) {
    const classes = useStyles();

    return dataList && dataList.length > 0 ? (
        <List className={classes.root}>

            {dataList.map((data) => (
                <div>
                    <ListItem alignItems="flex-start">
                        <ProfilePostCard key={data[0]} data={data} />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                </div>
            ))}
        </List>
    ) : (
            <p>No posts yet</p>
        );
}
