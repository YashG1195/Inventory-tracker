import React from 'react';
import { STATUS_LABELS } from '../../utils/helpers';

export default function StatusBadge({ status }) {
  return (
    <span className={`status-badge ${status}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}
