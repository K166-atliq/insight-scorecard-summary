
import React from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import SummaryCards from '@/components/dashboard/SummaryCards';
import CategoryGraph from '@/components/dashboard/CategoryGraph';
import MemberLeaderboard from '@/components/dashboard/MemberLeaderboard';
import MembersList from '@/components/dashboard/MembersList';
import { categoryData } from '@/data/mockData';
import { useTeamMembersCount, useAppreciationsCount, useTeamLeaderboard, useUsers } from '@/hooks/use-supabase-data';

const Index = () => {
  // Fetch data from Supabase
  const { data: teamMembersCount, isLoading: isLoadingMembers } = useTeamMembersCount();
  const { data: appreciationsCount, isLoading: isLoadingAppreciations } = useAppreciationsCount();
  const { data: leaderboardData, isLoading: isLoadingLeaderboard } = useTeamLeaderboard();
  const { data: membersData, isLoading: isLoadingMembersData } = useUsers();

  // Prepare summary metrics
  const summaryMetrics = [
    {
      title: "Team Members",
      value: isLoadingMembers ? "Loading..." : teamMembersCount,
      change: null,
      changeType: "neutral",
      icon: "Users",
      trend: null,
      description: "Total number of team members",
      color: "blue"
    },
    {
      title: "Appreciation Posts",
      value: isLoadingAppreciations ? "Loading..." : appreciationsCount,
      change: null, 
      changeType: "neutral",
      icon: "Heart",
      trend: null,
      description: "Total appreciation posts in the system",
      color: "purple"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <DashboardHeader 
        title="Kudos Corner Dashboard" 
        subtitle="Track team appreciation, evaluations, and engagement metrics"
      />
      
      <div className="space-y-8">
        {/* Summary Cards */}
        <SummaryCards metrics={summaryMetrics} />
        
        {/* Charts and Leaderboard Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Category Graph */}
          <CategoryGraph data={categoryData} />
          
          {/* Leaderboard */}
          {isLoadingLeaderboard ? (
            <div className="col-span-1 flex items-center justify-center h-80 bg-gray-50 rounded-md shadow-md">
              <p className="text-gray-500">Loading leaderboard data...</p>
            </div>
          ) : (
            <MemberLeaderboard 
              members={leaderboardData.map((item: any) => ({
                id: item.user_id.toString(),
                name: item.display_name || 'Unknown',
                title: "Team Member",
                points: Math.round(item.total_score || 0),
                avatar: "",
                appreciationPosts: 0,
                summary: "Team member evaluation score",
                lastActive: new Date().toISOString()
              }))} 
            />
          )}
        </div>
        
        {/* Members List */}
        {isLoadingMembersData ? (
          <div className="flex items-center justify-center h-80 bg-gray-50 rounded-md shadow-md">
            <p className="text-gray-500">Loading members data...</p>
          </div>
        ) : (
          <MembersList members={membersData.map((member: any) => ({
            id: member.user_id.toString(),
            name: member.display_name || 'Unknown',
            title: "Team Member",
            points: 0,
            avatar: "",
            appreciationPosts: 0,
            summary: member.email || "Team member",
            lastActive: new Date().toISOString()
          }))} />
        )}
      </div>
    </div>
  );
};

export default Index;
