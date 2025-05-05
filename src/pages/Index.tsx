import React, { useState } from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import SummaryCards from '@/components/dashboard/SummaryCards';
import CategoryGraph from '@/components/dashboard/CategoryGraph';
import MemberLeaderboard from '@/components/dashboard/MemberLeaderboard';
import MembersList from '@/components/dashboard/MembersList';
import QuarterYearFilter from '@/components/dashboard/QuarterYearFilter';
import { 
  useTeamMembersCount, 
  useAppreciationsCount, 
  useTeamLeaderboard, 
  useDetailedMemberData,
  useTeamMetrics,
  useAvailableYears
} from '@/hooks';

const Index = () => {
  // State for filters
  const [selectedQuarter, setSelectedQuarter] = useState<string>("All");
  const [selectedYear, setSelectedYear] = useState<number>(0); // 0 means all years
  
  // Fetch available years for the filter
  const { data: availableYears = [], isLoading: isLoadingYears } = useAvailableYears();

  // Fetch data from Supabase with filters
  const { data: teamMembersCount, isLoading: isLoadingMembers } = useTeamMembersCount();
  const { data: appreciationsCount, isLoading: isLoadingAppreciations } = useAppreciationsCount();
  const { data: leaderboardData, isLoading: isLoadingLeaderboard } = useTeamLeaderboard(
    selectedQuarter !== "All" ? selectedQuarter : null,
    selectedYear > 0 ? selectedYear : null
  );
  const { data: membersData, isLoading: isLoadingMembersData } = useDetailedMemberData();
  const { data: teamMetrics, isLoading: isLoadingTeamMetrics } = useTeamMetrics(
    selectedQuarter !== "All" ? selectedQuarter : null, 
    selectedYear > 0 ? selectedYear : null
  );

  // Handle filter changes
  const handleQuarterChange = (quarter: string) => {
    setSelectedQuarter(quarter);
  };

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
  };

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
        {/* Filter Controls */}
        <QuarterYearFilter 
          selectedQuarter={selectedQuarter}
          selectedYear={selectedYear}
          onQuarterChange={handleQuarterChange}
          onYearChange={handleYearChange}
          availableYears={availableYears}
        />
        
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
