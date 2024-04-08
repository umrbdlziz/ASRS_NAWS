import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, IconButton } from '@mui/material';
export const NavBar = () => {
  return (
    <AppBar position='fixed'>
      <Toolbar>
        <IconButton>
          <img
            alt='nanogrind technologies'
            src='/CompanyLogo.png'
            style={{ width: '150px' }}
          />
        </IconButton>
        <Button component={Link} to='/' sx={{ fontSize: 20, color: 'white' }}>
          Live Map
        </Button>
        <Button
          component={Link}
          to='/fleet'
          sx={{ fontSize: 20, color: 'white' }}
        >
          Fleet
        </Button>
        <Button
          component={Link}
          to='/editor'
          sx={{ fontSize: 20, color: 'white' }}
        >
          Editor
        </Button>
      </Toolbar>
    </AppBar>
  );
};
