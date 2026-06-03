import { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { 
  Container, Grid, Typography, Card, CardContent, 
  Box, Chip, Button, Divider, Alert, CircularProgress,
  List, ListItem, ListItemText, ListItemIcon, Avatar, Paper
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RefreshIcon from '@mui/icons-material/Refresh';
import EmailIcon from '@mui/icons-material/Email';
import DomainIcon from '@mui/icons-material/Domain';
import client from '../api/client';
import ActivityTimeline from '../components/Mailbox/ActivityTimeline';

const MailboxDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchDetail = async () => {
    try {
      const response = await client.get(`/mailboxes/${id}`);
      setData(response.data.data);
    } catch (error) {
      console.error('Failed to fetch detail', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleToggleWarmup = async () => {
    setActionLoading(true);
    try {
      const newStatus = data.warmupStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
      await client.post(`/mailboxes/${id}/warmup/toggle`, { status: newStatus });
      await fetchDetail();
    } finally {
      setActionLoading(false);
    }
  };

  const handleRunTest = async () => {
    setActionLoading(true);
    try {
      await client.post(`/mailboxes/${id}/warmup/test`);
      await fetchDetail();
    } finally {
      setActionLoading(false);
    }
  };

  const handleRevalidateDomain = async () => {
    setActionLoading(true);
    try {
      await client.post(`/domains/${data.domain.id}/validate`);
      await fetchDetail();
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
      <CircularProgress />
    </Box>
  );

  if (!data) return <Alert severity="error">Mailbox not found</Alert>;

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
              <EmailIcon />
            </Avatar>
            <Typography variant="h4" fontWeight={900} letterSpacing="-0.02em">
              {data.email}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 7 }}>
            <Chip 
              label={data.warmupStatus} 
              color={data.warmupStatus === 'ACTIVE' ? 'success' : 'default'} 
              variant="outlined"
              size="small"
            />
            <Typography variant="body2" color="text.secondary">
              Associated with <strong>{data.domain.domainName}</strong>
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="outlined" 
            startIcon={<RefreshIcon />} 
            onClick={handleRunTest}
            disabled={actionLoading || data.warmupStatus !== 'ACTIVE'}
            sx={{ borderRadius: 2 }}
          >
            Run Warmup Test
          </Button>
          <Button 
            variant="contained" 
            color={data.warmupStatus === 'ACTIVE' ? 'warning' : 'success'}
            startIcon={data.warmupStatus === 'ACTIVE' ? <PauseIcon /> : <PlayArrowIcon />}
            onClick={handleToggleWarmup}
            disabled={actionLoading}
            sx={{ borderRadius: 2, px: 3 }}
          >
            {data.warmupStatus === 'ACTIVE' ? 'Pause Warmup' : 'Resume Warmup'}
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {/* Domain Health Section */}
          <Card sx={{ mb: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }} elevation={0}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <DomainIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="h6" fontWeight={800}>Domain Reputation & Setup</Typography>
                </Box>
                <Button 
                  size="small" 
                  variant="text"
                  startIcon={<RefreshIcon />} 
                  onClick={handleRevalidateDomain} 
                  disabled={actionLoading}
                >
                  Sync DNS
                </Button>
              </Box>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={2}>
                {[
                  { label: 'MX Record', status: data.domain.mxStatus, desc: 'Mail delivery capability' },
                  { label: 'SPF Record', status: data.domain.spfStatus, desc: 'Authorized IP verification' },
                  { label: 'DMARC Policy', status: data.domain.dmarcStatus, desc: 'Domain spoofing protection' },
                  { label: 'DKIM Signature', status: data.domain.dkimStatus, desc: 'Cryptographic identity' },
                ].map((item) => (
                  <Grid item xs={12} sm={6} key={item.label}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', p: 2, bgcolor: 'background.default', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                      {item.status === 'VALID' ? (
                        <CheckCircleIcon color="success" sx={{ mr: 2, mt: 0.5 }} />
                      ) : (
                        <WarningIcon color={item.status === 'MISSING' ? 'error' : 'warning'} sx={{ mr: 2, mt: 0.5 }} />
                      )}
                      <Box>
                        <Typography variant="body2" fontWeight={700}>{item.label}</Typography>
                        <Typography variant="caption" color="text.secondary" display="block">{item.desc}</Typography>
                        <Chip 
                          label={item.status} 
                          size="small" 
                          color={item.status === 'VALID' ? 'success' : 'default'} 
                          sx={{ height: 18, fontSize: '0.6rem', mt: 1, fontWeight: 700 }} 
                        />
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {/* Warmup Progression Card */}
          <Card sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }} elevation={0}>
            <CardContent>
              <Typography variant="h6" fontWeight={800} gutterBottom>Volume Progression Strategy</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Your sending volume increases daily to mimic natural growth.</Typography>
              <Grid container spacing={4}>
                <Grid item xs={4}>
                  <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: 'background.default' }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>CURRENT DAY</Typography>
                    <Typography variant="h4" fontWeight={900} color="primary">{data.currentWarmupDay}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={4}>
                  <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: 'background.default' }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>DAILY LIMIT</Typography>
                    <Typography variant="h4" fontWeight={900} color="primary">{data.dailyLimit}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={4}>
                  <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: 'background.default' }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>INCREMENT</Typography>
                    <Typography variant="h4" fontWeight={900} color="primary">+{data?.warmupCampaign?.dailyIncrement || 0}</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* New Section: Domain Mailboxes */}
          <Card sx={{ mt: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }} elevation={0}>
            <CardContent>
              <Typography variant="h6" fontWeight={800} gutterBottom>Infrastructure Node: {data?.domain?.domainName}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Other mailboxes leveraging this domain reputation:</Typography>
              <List sx={{ bgcolor: 'background.default', borderRadius: 2 }}>
                {data?.domain?.mailboxes?.map((mb: any) => (
                  <ListItem 
                    key={mb.id} 
                    divider 
                    component={RouterLink} 
                    to={`/mailbox/${mb.id}`}
                    sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { bgcolor: 'action.hover' } }}
                  >
                    <ListItemIcon>
                      <EmailIcon color={mb.id === data.id ? 'primary' : 'disabled'} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={mb.email} 
                      secondary={`Status: ${mb.warmupStatus}`} 
                      primaryTypographyProps={{ fontWeight: mb.id === data.id ? 700 : 500 }}
                    />
                    {mb.id === data.id && <Chip label="Current" size="small" color="primary" sx={{ fontWeight: 700 }} />}
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Activity Timeline Section */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" fontWeight={800} sx={{ mb: 2, letterSpacing: '-0.01em' }}>Operational Log</Typography>
          <ActivityTimeline activities={data.activities} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default MailboxDetail;
