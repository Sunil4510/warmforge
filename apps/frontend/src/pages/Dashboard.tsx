import { useState, useEffect } from 'react';
import { 
  Container, Typography, Button, Box, Chip, Paper, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Tooltip, LinearProgress, Avatar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import EmailIcon from '@mui/icons-material/Email';
import client from '../api/client';
import OnboardingDialog from '../components/Mailbox/OnboardingDialog';

const Dashboard = () => {
  const navigate = useNavigate();
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

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'HEALTHY': return 'success';
      case 'WARNING': return 'warning';
      case 'CRITICAL': return 'error';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Box>
          <Typography variant="h4" fontWeight={900} letterSpacing="-0.02em" gutterBottom>
            Operational Overview
          </Typography>
          <Typography color="text.secondary" variant="body1">
            Monitor deliverability health and warmup progression across your infrastructure.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsDialogOpen(true)}
          sx={{ height: 48, px: 3, borderRadius: 2, boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)' }}
        >
          Connect Mailbox
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
        {loading && <LinearProgress />}
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: 'background.default' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Mailbox Identity</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Domain</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Health Status</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Warmup Progress</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mailboxes.map((mailbox) => (
              <TableRow 
                key={mailbox.id} 
                hover 
                sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer' }}
                onClick={() => navigate(`/mailbox/${mailbox.id}`)}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: 'primary.light', mr: 2, width: 32, height: 32 }}>
                      <EmailIcon sx={{ fontSize: 18 }} />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>{mailbox.email}</Typography>
                      <Chip 
                        label={mailbox.warmupStatus} 
                        size="small" 
                        variant="outlined"
                        color={mailbox.warmupStatus === 'ACTIVE' ? 'success' : 'default'}
                        sx={{ height: 20, fontSize: '0.625rem', mt: 0.5 }}
                      />
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    {mailbox.domain.domainName}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    icon={mailbox.domain.healthStatus === 'HEALTHY' ? <CheckCircleIcon /> : <WarningIcon />}
                    label={mailbox.domain.healthStatus}
                    color={getHealthColor(mailbox.domain.healthStatus) as any}
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Day {mailbox.currentWarmupDay} • Limit: {mailbox.dailyLimit}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={(mailbox.currentWarmupDay / 30) * 100} // Mocked progress
                        sx={{ width: 100, height: 6, borderRadius: 3, mr: 1 }} 
                      />
                      <Typography variant="caption" fontWeight={700}>
                        {Math.min(100, Math.round((mailbox.currentWarmupDay / 30) * 100))}%
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Tooltip title="View Detailed Analysis">
                    <IconButton size="small" color="primary">
                      <OpenInNewIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {!loading && mailboxes.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                  <Typography variant="h6" color="text.secondary">No infrastructure connected.</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Start by onboarding your first outbound mailbox.</Typography>
                  <Button variant="outlined" onClick={() => setIsDialogOpen(true)}>Connect Now</Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <OnboardingDialog 
        open={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        onSuccess={fetchMailboxes}
      />
    </Container>
  );
};

export default Dashboard;
