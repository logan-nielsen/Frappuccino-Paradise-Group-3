import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CoffeeMakerIcon from '@mui/icons-material/CoffeeMaker';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { useNavigate } from 'react-router-dom';
import { IconButton, ListItemText } from '@mui/material';

const drawerWidth = 240;

export default function PermanentDrawer(props) {
  const [anchorEl, setAnchorEl] = useState(null)
  const [isEmployee, setIsEmployee] = useState(false)

  useEffect(() => {
    fetch('api/isemployee')
      .then(response => response.json())
      .then(json => {
        setIsEmployee(json.is_employee)
      })
  }, [])

  const navigate = useNavigate();
  
  function handleMenu(event) {
    setAnchorEl(event.currentTarget);
  };

  function handleClose() {
    setAnchorEl(null);
  };

  function signOut() {
    handleClose();
    window.location = '/accounts/logout';
  }

  return (
  <Box sx={{ display: 'flex' }}>
    <CssBaseline />
    <AppBar 
      position="fixed" 
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <Typography noWrap component="h1" sx={{ flexGrow: 1, 'fontSize': '30px' }}>
          Dan's Frappuccino Paradise
        </Typography>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenu}
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={() => {navigate("app/account"); handleClose()}}>
            <ListItemIcon>
              <AccountBoxIcon />
            </ListItemIcon>
            <ListItemText>My Account</ListItemText>
          </MenuItem>
          <MenuItem onClick={signOut}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText>Sign Out</ListItemText>
          </MenuItem>
        </Menu>
      </Toolbar>
      </AppBar>
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
        width: drawerWidth,
        boxSizing: 'border-box',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      
      <Toolbar />
      <Divider />
      <List component="nav">
        <ListItem key="Home" disablePadding>
          <ListItemButton onClick={() => navigate("app/home")}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText>Home</ListItemText>
          </ListItemButton>
        </ListItem>
        <ListItem key="Order" disablePadding>
          <ListItemButton onClick={() => navigate("app/order")}>
            <ListItemIcon>
              <ShoppingCartIcon />
            </ListItemIcon>
            <ListItemText>Order</ListItemText>
          </ListItemButton>
        </ListItem>

        {isEmployee && 
          <ListItem key="Manage Orders" disablePadding>
            <ListItemButton onClick={() => navigate("app/manage-orders")}>
              <ListItemIcon>
                <CoffeeMakerIcon />
              </ListItemIcon>
              <ListItemText>Manage Orders</ListItemText>
            </ListItemButton>
          </ListItem>
        }
      </List>
    </Drawer>
    <Box
      component="main"
      sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
    >
    <Toolbar />
      {props.children}
    </Box>
  </Box>
  );
}
