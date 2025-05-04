
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Medal, Trophy } from "lucide-react";

const MemberLeaderboard = ({ members, limit = 5 }) => {
  const topMembers = members.slice(0, limit);
  
  const getMedalColor = (index: number) => {
    switch(index) {
      case 0: return "text-yellow-500"; // Gold
      case 1: return "text-gray-400"; // Silver
      case 2: return "text-amber-700"; // Bronze
      default: return "text-slate-600"; // Others
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  return (
    <Card className="col-span-1 shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Top Contributors</CardTitle>
            <CardDescription>Leading members by points</CardDescription>
          </div>
          <Trophy className="h-5 w-5 text-amber-500" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topMembers.map((member, index) => (
            <div key={member.id} className="flex items-center">
              <div className={`mr-3 flex h-9 w-8 items-center justify-center rounded-md ${getMedalColor(index)}`}>
                {index < 3 ? (
                  <Medal className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              <Avatar className="h-9 w-9">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
              </Avatar>
              <div className="ml-3 space-y-0.5">
                <div className="text-sm font-medium">{member.name}</div>
                <div className="text-xs text-muted-foreground">{member.title}</div>
              </div>
              <div className="ml-auto text-right">
                <div className="text-sm font-medium">{member.points.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">points</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t">
          <a 
            href="#members-list" 
            className="text-sm text-primary hover:underline flex items-center justify-center"
          >
            View All Members
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default MemberLeaderboard;
