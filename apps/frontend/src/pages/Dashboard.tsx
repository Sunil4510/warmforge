import { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, Button, Box, Chip, Skeleton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import client from '../api/client';
import OnboardingDialog from '../components/Mailbox/OnboardingDialog';

const Dashboard = () => {
  const [mailboxes, setMailboxes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchMailboxes = async () => {
    try {
      const response = await client.get('/mailboxes');
      setMailboxes(response.data.data);
    } catch (error) {
      console.error('Failed to fetch mailboxes', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMailboxes();
  }, []);

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight={800} gutterBottom>
            Your Mailboxes
          </Typography>
          <Typography color="text.secondary">
            Manage your SMTP accounts and monitor warmup progress.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsDialogOpen(true)}
          size="large"
        >
          Add Mailbox
        </Button>
      </Box>

      {loading ? (
        <Grid container spacing={3}>
          {[1, 2, 3].map((i) => (
            <Grid item xs={12} md={4} key={i}>
              <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={3}>
          {mailboxes.map((mailbox) => (
            <Grid item xs={12} md={4} key={mailbox.id}>
              <Card 
                component={RouterLink} 
                to={`/mailbox/${mailbox.id}`}
                sx={{ 
                  textDecoration: 'none', 
                  height: '100%', 
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" fontWeight={700} noWrap sx={{ maxWidth: '70%' }}>
                      {mailbox.email}
                    </Typography>
                    <Chip 
                      label={mailbox.warmupStatus} 
                      color={mailbox.warmupStatus === 'ACTIVE' ? 'success' : 'default'}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    {mailbox.domain.healthStatus === 'HEALTHY' ? (
                      <CheckCircleIcon color="success" sx={{ fontSize: 20, mr: 1 }} />
                    ) : (
                      <WarningIcon color="warning" sx={{ fontSize: 20, mr: 1 }} />
                    )}
                    <Typography variant="body2" color="text.secondary">
                      Domain Health: <strong>{mailbox.domain.healthStatus}</strong>
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="text.secondary">
                    Warmup Day: <strong>{mailbox.currentWarmupDay}</strong>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
          {mailboxes.length === 0 && (
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', py: 8, bgcolor: 'background.paper', borderRadius: 2, border: '2px dashed', borderColor: 'divider' }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No mailboxes connected yet.
                </Typography>
                <Button variant="outlined" startIcon={<AddIcon />} onClick={() => setIsDialogOpen(true)}>
                  Connect your first mailbox
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>
      )}

      <OnboardingDialog 
        open={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        onSuccess={fetchMailboxes}
      />
    </Container>
  );
};

export default Dashboard;
