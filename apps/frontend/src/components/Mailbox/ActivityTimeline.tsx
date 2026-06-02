import { 
  Timeline, TimelineItem, TimelineSeparator, TimelineConnector, 
  TimelineContent, TimelineDot, TimelineOppositeContent 
} from '@mui/lab';
import { Typography, Paper, Box } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ErrorIcon from '@mui/icons-material/Error';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { format } from 'date-fns';

interface Props {
  activities: any[];
}

const ActivityTimeline = ({ activities }: Props) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'EMAIL_SENT': return <SendIcon sx={{ fontSize: 16 }} />;
      case 'SMTP_FAILURE': return <ErrorIcon sx={{ fontSize: 16 }} />;
      case 'WARMUP_STARTED': return <PlayCircleIcon sx={{ fontSize: 16 }} />;
      default: return <SendIcon sx={{ fontSize: 16 }} />;
    }
  };

  const getColor = (status: string) => {
    switch (status) {
      case 'SUCCESS': return 'success';
      case 'FAILED': return 'error';
      case 'WARNING': return 'warning';
      default: return 'primary';
    }
  };

  if (activities.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'background.default', border: '1px dashed', borderColor: 'divider' }}>
        <Typography color="text.secondary">No recent activity</Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ maxHeight: 600, overflowY: 'auto', pr: 1 }}>
      <Timeline position="right" sx={{ p: 0 }}>
        {activities.map((activity, index) => (
          <TimelineItem key={activity.id}>
            <TimelineOppositeContent sx={{ flex: 0.3, px: 1, py: 1.5 }}>
              <Typography variant="caption" color="text.secondary">
                {format(new Date(activity.createdAt), 'MMM d, HH:mm')}
              </Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color={getColor(activity.status) as any}>
                {getIcon(activity.activityType)}
              </TimelineDot>
              {index < activities.length - 1 && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent sx={{ py: 1.5, px: 2 }}>
              <Typography variant="body2" fontWeight={600}>
                {activity.activityType.replace('_', ' ')}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                {activity.message}
              </Typography>
              {activity.recipientEmail && (
                <Typography variant="caption" color="primary" sx={{ mt: 0.5, display: 'block' }}>
                  To: {activity.recipientEmail}
                </Typography>
              )}
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Box>
  );
};

export default ActivityTimeline;
