import { useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, Grid, Alert, CircularProgress, 
  Typography, Box 
} from '@mui/material';
import client from '../../api/client';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const OnboardingDialog = ({ open, onClose, onSuccess }: Props) => {
  const [formData, setFormData] = useState({
    email: '',
    smtpHost: '',
    smtpPort: '587',
    smtpUsername: '',
    smtpPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await client.post('/mailboxes', {
        ...formData,
        smtpPort: parseInt(formData.smtpPort),
      });
      onSuccess();
      onClose();
      setFormData({ email: '', smtpHost: '', smtpPort: '587', smtpUsername: '', smtpPassword: '' });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to onboard mailbox. Check your SMTP settings.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 800 }}>Connect New Mailbox</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            We'll verify your SMTP credentials and trigger an initial domain health check.
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="sales@acme.com"
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField
                required
                fullWidth
                label="SMTP Host"
                name="smtpHost"
                value={formData.smtpHost}
                onChange={handleChange}
                placeholder="smtp.gmail.com"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                required
                fullWidth
                label="Port"
                name="smtpPort"
                type="number"
                value={formData.smtpPort}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="SMTP Username"
                name="smtpUsername"
                value={formData.smtpUsername}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="SMTP Password / App Password"
                name="smtpPassword"
                type="password"
                value={formData.smtpPassword}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} disabled={loading}>Cancel</Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? 'Verifying...' : 'Onboard Mailbox'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default OnboardingDialog;
