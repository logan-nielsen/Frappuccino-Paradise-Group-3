import * as React from 'react';
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
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { IconButton, ListItemText } from '@mui/material';


const drawerWidth = 240;

export default function PermanentDrawer(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const navigate = useNavigate();
  
  function handleMenu(event) {
    setAnchorEl(event.currentTarget);
  };

  function handleClose() {
    setAnchorEl(null);
  };

  function signOut() {
    console.log("Sign out");
    handleClose();
  }

  return (
  <Box sx={{ display: 'flex' }}>
    <CssBaseline />
    <AppBar
      position="fixed"
      sx={{ 
        width: `calc(100% - ${drawerWidth}px)`, 
        ml: `${drawerWidth}px`,
      }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap component="h1" sx={{ flexGrow: 1 }}>
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
            My Account
          </MenuItem>
          <MenuItem onClick={signOut}>
            Sign Out
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
        <ListItem key="Log In" disablePadding>
          <ListItemButton onClick={() => navigate("app/login")}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText>Log In</ListItemText>
          </ListItemButton>
        </ListItem>
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
