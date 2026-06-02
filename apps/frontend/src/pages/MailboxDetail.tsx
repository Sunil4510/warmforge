import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Container, Grid, Typography, Card, CardContent, 
  Box, Chip, Button, Divider, Alert, CircularProgress
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RefreshIcon from '@mui/icons-material/Refresh';
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
          <Typography variant="h4" fontWeight={800} gutterBottom>
            {data.email}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip label={data.warmupStatus} color={data.warmupStatus === 'ACTIVE' ? 'success' : 'default'} />
            <Typography variant="body2" color="text.secondary">
              Domain: <strong>{data.domain.domainName}</strong>
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="outlined" 
            startIcon={<RefreshIcon />} 
            onClick={handleRunTest}
            disabled={actionLoading || data.warmupStatus !== 'ACTIVE'}
          >
            Run Warmup Test
          </Button>
          <Button 
            variant="contained" 
            color={data.warmupStatus === 'ACTIVE' ? 'warning' : 'success'}
            startIcon={data.warmupStatus === 'ACTIVE' ? <PauseIcon /> : <PlayArrowIcon />}
            onClick={handleToggleWarmup}
            disabled={actionLoading}
          >
            {data.warmupStatus === 'ACTIVE' ? 'Pause Warmup' : 'Resume Warmup'}
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Domain Health Section */}
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" fontWeight={700}>Domain Health Configuration</Typography>
                <Button size="small" startIcon={<RefreshIcon />} onClick={handleRevalidateDomain} disabled={actionLoading}>
                  Re-validate
                </Button>
              </Box>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={2}>
                {[
                  { label: 'MX Record', status: data.domain.mxStatus },
                  { label: 'SPF Record', status: data.domain.spfStatus },
                  { label: 'DMARC Policy', status: data.domain.dmarcStatus },
                  { label: 'DKIM Signature', status: data.domain.dkimStatus },
                ].map((item) => (
                  <Grid item xs={12} sm={6} key={item.label}>
                    <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                      {item.status === 'VALID' ? (
                        <CheckCircleIcon color="success" sx={{ mr: 2 }} />
                      ) : (
                        <WarningIcon color={item.status === 'MISSING' ? 'error' : 'warning'} sx={{ mr: 2 }} />
                      )}
                      <Box>
                        <Typography variant="body2" fontWeight={600}>{item.label}</Typography>
                        <Typography variant="caption" color="text.secondary">{item.status}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>Warmup Progression</Typography>
              <Divider sx={{ mb: 3 }} />
              <Grid container spacing={4}>
                <Grid item xs={4}>
                  <Typography variant="caption" color="text.secondary" display="block">Current Day</Typography>
                  <Typography variant="h4" fontWeight={800}>{data.currentWarmupDay}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="caption" color="text.secondary" display="block">Daily Limit</Typography>
                  <Typography variant="h4" fontWeight={800}>{data.dailyLimit}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="caption" color="text.secondary" display="block">Increment</Typography>
                  <Typography variant="h4" fontWeight={800}>+{data.warmupCampaign.dailyIncrement}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Activity Timeline Section */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Recent Activity</Typography>
          <ActivityTimeline activities={data.activities} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default MailboxDetail;
