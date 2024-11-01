import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
  IconButton,
  LinearProgress,
  Stack,
  Tooltip
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import { format, differenceInDays } from 'date-fns';


const TimelineProgress = ({ projectDates, onDatesChange }) => {
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState(projectDates?.startDate ? new Date(projectDates.startDate) : null);
  const [endDate, setEndDate] = useState(projectDates?.endDate ? new Date(projectDates.endDate) : null);

  const calculateProgress = () => {
    if (!startDate || !endDate) return 0;
    const total = endDate - startDate;
    const current = new Date() - startDate;
    return Math.min(Math.max((current / total) * 100, 0), 100);
  };

  const handleSave = () => {
    onDatesChange({ startDate, endDate });
    setOpen(false);
  };

  const progress = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const total = endDate - startDate;
    const current = new Date() - startDate;
    return Math.min(Math.max((current / total) * 100, 0), 100);
  }, [startDate, endDate]);

  const getTimelineStatus = () => {
    if (!startDate || !endDate) return '';
    const today = new Date();
    const daysUntilStart = differenceInDays(startDate, today);
    const daysLeft = differenceInDays(endDate, today);

    if (daysUntilStart > 0) {
      return `Project will begin in ${daysUntilStart} day${daysUntilStart !== 1 ? 's' : ''}`;
    } else {
      return `${Math.abs(daysLeft)} day${Math.abs(daysLeft) !== 1 ? 's' : ''} left in this project`;
    }
  };

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        mb: 4, 
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
          <Typography variant="overline" sx={{ color: 'text.secondary' }}>
            {startDate && endDate ? `${Math.round(progress)}% COMPLETED` : 'TIMELINE'}
          </Typography>
          <Typography variant="h6" sx={{ mt: 0.5 }}>
            {startDate && endDate ? getTimelineStatus() : 'Set up your project timeline'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {!startDate || !endDate ? 'Add dates to see progress' : ''}
          </Typography>
        </Box>
        
        {startDate && endDate ? (
          <Stack alignItems="flex-end">
            <Typography variant="body2" color="text.secondary">
              Target completion date
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body1" fontWeight="medium">
                {format(endDate, 'MMM d, yyyy')}
              </Typography>
              <Tooltip title="Edit dates">
                <IconButton 
                  size="small" 
                  onClick={() => setOpen(true)}
                  sx={{ 
                    ml: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Stack>
        ) : (
          <Button 
            variant="outlined" 
            onClick={() => setOpen(true)}
            sx={{ height: 'fit-content' }}
          >
            Add dates
          </Button>
        )}
      </Box>

      <Box sx={{ mt: 3 }}>
        {startDate && endDate ? (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {new Date(startDate).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {new Date(endDate).toLocaleDateString()}
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={calculateProgress()} 
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  backgroundColor: 'primary.main',
                }
              }}
            />
          </>
        ) : (
          <Box 
            sx={{ 
              height: 8, 
              backgroundColor: 'rgba(0, 0, 0, 0.05)', 
              borderRadius: 4 
            }} 
          />
        )}
      </Box>

      <Dialog 
        open={open} 
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Add dates to this project
            <IconButton onClick={() => setOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography sx={{ mb: 2 }}>Project Dates</Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={setStartDate}
                slotProps={{
                  textField: {
                    fullWidth: true
                  }
                }}
              />
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={setEndDate}
                minDate={startDate}
                slotProps={{
                  textField: {
                    fullWidth: true
                  }
                }}
              />
            </Box>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleSave}
            disabled={!startDate || !endDate}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default TimelineProgress;