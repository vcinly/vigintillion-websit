import React from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
        width: '100%',
        height: '100%',
        position: "absolute",
        transition: "background-color 1000ms linear",
    },
    time: {
        fontSize: "10rem",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        color: '#bfffff'
    },
  });

class Time extends React.Component {
    state = {
        dayStart: new Date().setHours(0, 0, 0, 0),
        time: new Date(Date.now()).toString().match(/\d+:\d+:\d+/),
        color: "#ffffff",
        /* timeR: Math.sqrt(86400000 / Math.PI),
        colorR: Math.sqrt(16777215 / Math.PI) */
    };

    componentDidMount() {
        setInterval(()=>{
            let per = (Date.now() - this.state.dayStart) / 86400000

            this.setState({
                time: new Date(Date.now()).toString().match(/\d+:\d+:\d+/),
                color: `#${(Math.floor(per * 16777215)).toString('16')}`
            })
            console.log(this.state.color)
        }
        , 1000)
    }

    render() {
        const { classes } = this.props;
        return (
            <div style={{backgroundColor: this.state.color}} className={classes.root}>
               <span className={classes.time}>{this.state.time}</span>
            </div>
        )
    }
}

export default withStyles(styles)(Time);