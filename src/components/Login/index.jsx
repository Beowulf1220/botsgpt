import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert, Snackbar } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';




import './Register.css';

const Container = styled(Box)(({ theme }) => ({
    display:'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height:'50vh',
    width: '50vw',
    justifyContent: 'center',
    borderRadius: '16px',
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  }));
  
  const StyledInput = styled(TextField)({
    borderRadius: '16px',
    marginBottom: '1rem',
  });
  
  const StyledButton = styled(Button)({
    borderRadius: '16px',
    marginBottom: '1rem',
  });

  const RegisterComponent = () => {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const [open, setOpen] = React.useState(false);

    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setOpen(false);
    };


    const registerGoogle = useGoogleLogin({
        onSuccess: tokenResponse => {
          const accessToken = tokenResponse.access_token;
          fetch('https://bot-panel-server-AdrianGutierr26.replit.app/google-login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              accessToken: accessToken,
            }),
          })
          .then(backendResponse => {
            if (backendResponse.ok) {
              return backendResponse.json();
            } else {
              return backendResponse.json().then(errorData => {
                throw new Error(errorData.error);
              });
            }
          })
          .then(data => {
            //console.log(data.message);
            localStorage.setItem('token', data.token);
            alert("Successfully registered with Google!");
            navigate('/create-bot');
          })
          .catch(error => {
            console.log(error.message);
            errorMessage(error.message);
          });
        }
      });

      const isInputValid = () => {
        return (email !== '' && password !== '');
      }

      const handleRegister = async () => {
        if(isInputValid()){
          try {
            const response = await fetch('https://bot-panel-server-AdrianGutierr26.replit.app/set-password', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: email,
                newPassword: password,
              }),
            });
        
            const data = await response.json();
            if (response.ok) {
              alert(data.message);
              // Redirect the user to the login page or log them in automatically
              navigate('/create-bot');
            } else {
              errorMessage(data.error);
            }
          } catch (error) {
            console.log('Error:', error);
            errorMessage(error.message);
          }
        }else{
          setOpen(true);
        }
      };

    const errorMessage = (error) => {
        alert(error)
    };
  
    return (
      <div class="centerDiv">
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="warning" sx={{ width: '100%' }}>
            Missing email or password
          </Alert>
        </Snackbar>
        <Container>
          <Typography variant="h4" gutterBottom style={{marginTop: '5%', marginBottom: '3%'}}>
            Register Now
          </Typography>
          <StyledInput
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            style={{width:'40%'}}
          />
          <StyledInput
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            style={{width:'40%'}}
          />
          <StyledButton variant="contained" onClick={handleRegister} style={{width:'40%'}}>
            Sign up
          </StyledButton>
          <StyledButton onClick={() => registerGoogle()} >
              Sign up with Google 🚀{' '}
          </StyledButton>
          <StyledButton onClick={() => navigate('/')} style={{marginTop: '-1%'}}>
            Login
          </StyledButton>        
        </Container>
      </div>
    );
  };

export default RegisterComponent;
