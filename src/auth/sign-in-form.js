//
// todo(nc): reveal password option
// todo(nc): style error messages
//
import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import LockIcon from '@material-ui/icons/LockOutlined';
import { Step, StepIcon, StepLabel } from '@material-ui/core';


import TextInput from '../apps/components/TextInput';

import * as Auth from '../api/auth';


const useStyles = makeStyles({
  root: {
    backgroundColor: '#555',
    color: '#666',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  active: {
    backgroundImage:
      'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  }
});


export default function SignInDialog(props) {
  const styles = useStyles();

  const {forApp} = props;

  const [user, setUser] = useState(null);
  const [pass, setPass] = useState(null);

  const [inProgress, setInProgress] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const [failMsg, setFailMsg] = useState(null);

  const handleSignIn = evt => {
    evt.preventDefault();

    setInProgress(true);
    Auth.signIn(user, pass)
      .catch(err => {
        setInProgress(false);

        const error = err.response.data;
        const status = error.status;

        if (status == 401) {
          setIsInvalid(true)
          return;
        }

        const msg = err.response.data.message;
        setFailMsg(msg);
      })
  }

  return (
    <form onSubmit={handleSignIn}>
      {forApp &&
        <Step active={true} completed={false}>
          <StepIcon className={styles.root} icon={<div><LockIcon /></div>} />
          <StepLabel>Please sign in to use this service.</StepLabel>
        </Step>
      }

      <DialogContent>
        <Grid container direction="column" alignItems="center">
          <TextInput label="Username" onChange={val => setUser(val)} fullWidth/>
          <TextInput label="Password" type="password" onChange={val => setPass(val)} fullWidth/>

          {isInvalid && <div>Invalid username and/or password</div>}
          {failMsg && <div>{failMsg}</div>}
        </Grid>
        <br/>
      </DialogContent>

      <DialogActions>
        <Button color="primary"
          variant="contained"
          disabled={!user || !pass || inProgress}
          type="submit"
          disableRipple
        >
          {inProgress ? 'Signing in...' : 'Sign in'}
        </Button>
      </DialogActions>
    </form>
  );
}