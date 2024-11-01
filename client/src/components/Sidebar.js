import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TimelineIcon from '@mui/icons-material/Timeline';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DescriptionIcon from '@mui/icons-material/Description';
import RateReviewIcon from '@mui/icons-material/RateReview';
import FolderIcon from '@mui/icons-material/Folder';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import { useLocation } from 'react-router-dom';

const Sidebar = ({ onNavigate }) => {
  const location = useLocation();
  const isProjectDetails = location.pathname.includes('/projects/');

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: 'home' },
    { text: 'Schedule', icon: <CalendarTodayIcon />, path: 'schedule' },
    { text: 'Analysis', icon: <TimelineIcon />, path: 'analysis' },
    { text: 'Tasks', icon: <AssignmentIcon />, path: 'tasks' },
    { text: 'Field Reports', icon: <DescriptionIcon />, path: 'field-reports' },
    { text: 'Review', icon: <RateReviewIcon />, path: 'review' },
    { text: 'Documents', icon: <FolderIcon />, path: 'documents' },
    { text: 'RFIs', icon: <QuestionAnswerIcon />, path: 'rfis' },
    { text: 'People', icon: <PeopleIcon />, path: 'people' },
    { text: 'Settings', icon: <SettingsIcon />, path: 'settings' },
  ];

  return (
    <Box
      sx={{
        width: '150px',
        height: '100%',
        backgroundColor: '#fff',
        color: '#666666',
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        '& .MuiListItemIcon-root': {
          minWidth: '32px',
          color: 'inherit',
          '& svg': {
            fontSize: '1.2rem',
          },
        },
        '& .MuiListItemText-root': {
          margin: 0,
        },
        '& .MuiListItem-root': {
          padding: '10px 16px',
        },
      }}
    >
      <List sx={{ padding: 0 }}>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => onNavigate(item.text.toLowerCase())}
            selected={item.text === 'Home' && isProjectDetails}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(0, 133, 222)',
                color: '#ffffff',
                '& .MuiListItemIcon-root': {
                  color: '#ffffff',
                },
              },
              '&.Mui-selected': {
                backgroundColor: 'rgba(0, 133, 222)',
                color: '#ffffff',
                '& .MuiListItemIcon-root': {
                  color: '#ffffff',
                },
                '&:hover': {
                  backgroundColor: 'rgba(0, 133, 222, 0.9)',
                },
              },
            }}
          >
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text}
              primaryTypographyProps={{
                fontSize: '0.875rem',
                fontWeight: 400,
                letterSpacing: '0.2px',
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;