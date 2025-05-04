
import React from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import SummaryCards from '@/components/dashboard/SummaryCards';
import CategoryGraph from '@/components/dashboard/CategoryGraph';
import MemberLeaderboard from '@/components/dashboard/MemberLeaderboard';
import MembersList from '@/components/dashboard/MembersList';
import { 
  useTeamMembersCount, 
  useAppreciationsCount, 
  useTeamLeaderboard, 
  useDetailedMemberData,
  useTeamMetrics
} from '@/hooks/use-supabase-data';

const Index = () => {
  // Fetch data from Supabase
  const { data: teamMembersCount, isLoading: isLoadingMembers } = useTeamMembersCount();
  const { data: appreciationsCount, isLoading: isLoadingAppreciations } = useAppreciationsCount();
  const { data: leaderboardData, isLoading: isLoadingLeaderboard } = useTeamLeaderboard();
  const { data: membersData, isLoading: isLoadingMembersData } = useDetailedMemberData();
  const { data: teamMetrics, isLoading: isLoadingTeamMetrics } = useTeamMetrics();

  // Prepare summary metrics
  const summaryMetrics = [
    {
      title: "Team Members",
      value: isLoadingMembers ? "Loading..." : teamMembersCount,
      icon: "users",
      trend: null,
      description: "Total number of team members",
      color: "blue" as const
    },
    {
      title: "Appreciation Posts",
      value: isLoadingAppreciations ? "Loading..." : appreciationsCount,
      icon: "award",
      trend: null,
      description: "Total appreciation posts in the system",
      color: "purple" as const
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
          <CategoryGraph 
            data={teamMetrics || []} 
            isLoading={isLoadingTeamMetrics}
          />
          
          {/* Leaderboard */}
          {isLoadingLeaderboard ? (
            <div className="col-span-1 flex items-center justify-center h-80 bg-gray-50 rounded-md shadow-md">
              <p className="text-gray-500">Loading leaderboard data...</p>
            </div>
          ) : (
            <MemberLeaderboard 
              members={leaderboardData?.map((item) => ({
                id: Number(item.user_id.toString()),
                name: item.display_name || 'Unknown',
                title: "Team Member",
                points: Math.round(item.total_score || 0),
                avatar: "",
                appreciationPosts: 0,
                summary: "Team member evaluation score",
                lastActive: new Date().toISOString()
              })) || []} 
            />
          )}
        </div>
        
        {/* Members List */}
        {isLoadingMembersData ? (
          <div className="flex items-center justify-center h-80 bg-gray-50 rounded-md shadow-md">
            <p className="text-gray-500">Loading members data...</p>
          </div>
        ) : (
          <MembersList members={membersData || []} />
        )}
      </div>
    </div>
  );
};

export default Index;
