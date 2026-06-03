import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import EmailIcon from '@mui/icons-material/Email';

const TopBar = () => {
  return (
    <AppBar position="static" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', color: 'text.primary' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <EmailIcon sx={{ mr: 2, color: 'primary.main' }} />
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: 'flex',
              fontWeight: 800,
              letterSpacing: '-.025em',
              color: 'inherit',
              textDecoration: 'none',
              flexGrow: 1
            }}
          >
            WARMFORGE
          </Typography>
          <Box>
            <Button component={RouterLink} to="/" color="inherit">Dashboard</Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default TopBar;
