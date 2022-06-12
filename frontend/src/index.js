import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import UserList from '././userlist';
import LoginForm from './loginform';
import { Grid, Box, Paper, styled } from '@mui/material';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Item>
            <UserList />
          </Item>
        </Grid>
        <Grid item xs={12} md={4}>
          <Item>
            <LoginForm />
          </Item>
        </Grid>
      </Grid>
    </Box>
  </React.StrictMode>
);

