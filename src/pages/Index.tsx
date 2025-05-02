
import React from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import SummaryCards from '@/components/dashboard/SummaryCards';
import CategoryGraph from '@/components/dashboard/CategoryGraph';
import MemberLeaderboard from '@/components/dashboard/MemberLeaderboard';
import MembersList from '@/components/dashboard/MembersList';
import { membersData, categoryData, summaryMetrics } from '@/data/mockData';

const Index = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <DashboardHeader 
        title="Team Performance Dashboard" 
        subtitle="Monitor team activity, contributions, and engagement metrics"
      />
      
      <div className="space-y-8">
        {/* Summary Cards */}
        <SummaryCards metrics={summaryMetrics} />
        
        {/* Charts and Leaderboard Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Category Graph */}
          <CategoryGraph data={categoryData} />
          
          {/* Leaderboard */}
          <MemberLeaderboard members={membersData} />
        </div>
        
        {/* Members List */}
        <MembersList members={membersData} />
      </div>
    </div>
  );
};

export default Index;
