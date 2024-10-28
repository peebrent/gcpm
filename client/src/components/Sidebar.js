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

const Sidebar = ({ onNavigate }) => {
  const menuItems = [
    { text: 'Home', icon: <HomeIcon /> },
    { text: 'Schedule', icon: <CalendarTodayIcon /> },
    { text: 'Analysis', icon: <TimelineIcon /> },
    { text: 'Tasks', icon: <AssignmentIcon /> },
    { text: 'Field Reports', icon: <DescriptionIcon /> },
    { text: 'Review', icon: <RateReviewIcon /> },
    { text: 'Documents', icon: <FolderIcon /> },
    { text: 'RFIs', icon: <QuestionAnswerIcon /> },
    { text: 'People', icon: <PeopleIcon /> },
    { text: 'Settings', icon: <SettingsIcon /> },
  ];

  return (
    <Box
      sx={{
        width: '150px',
        height: '100%',
        backgroundColor: '#1e2a38',
        color: '#a1a9b8',
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
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: '#ffffff',
                '& .MuiListItemIcon-root': {
                  color: '#ffffff',
                },
              },
              '&.Mui-selected': {
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                '& .MuiListItemIcon-root': {
                  color: '#ffffff',
                },
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.16)',
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