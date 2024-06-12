import React from 'react';
import TargetDetailSection from './TargetDetailSection';
import TargetTasksSection from './TargetTasksSection';

const TargetDetail = () => {
  return (
    <div className="border-r border-secondary col-span-3 flex flex-col overflow-hidden">
      <TargetDetailSection />
      <TargetTasksSection />
    </div>
  );
};

export default TargetDetail;
