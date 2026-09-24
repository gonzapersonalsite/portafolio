import React from 'react';
import { Chip } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

interface StatusBadgeProps {
    label: string;
}

// A positive status shown next to a heading, such as "Open to work". The solid surface keeps
// the text readable on top of gradients.
const StatusBadge: React.FC<StatusBadgeProps> = ({ label }) => (
    <Chip
        label={label}
        icon={<FiberManualRecordIcon aria-hidden="true" sx={{ fontSize: 12 }} />}
        color="success"
        variant="outlined"
        sx={{ bgcolor: 'background.paper', fontWeight: 600, '& .MuiChip-icon': { ml: 1 } }}
    />
);

export default StatusBadge;
