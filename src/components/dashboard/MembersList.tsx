
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowUpDown, ChevronDown, Award, Star } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

interface MemberData {
  user_id: string;
  display_name?: string | null;
  email?: string | null;
  is_active?: boolean | null;
  appreciationPoints: number;
  leadership: number;
  communication: number;
  management: number;
  problemSolving: number;
  lastActive: string;
}

interface MembersListProps {
  members: MemberData[];
}

type SortField = "name" | "appreciationPoints" | "leadership" | "communication" | "management" | "problemSolving" | "lastActive";
type SortDirection = "asc" | "desc";

const MembersList: React.FC<MembersListProps> = ({ members }) => {
  const [sortField, setSortField] = useState<SortField>("appreciationPoints");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const getInitials = (name: string = "Unknown User") => {
    return name.split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  const renderSkillLevel = (value: number) => {
    const level = value || 0;
    return (
      <div className="flex items-center gap-2">
        <Progress value={level * 10} className="h-2 w-16" />
        <span>{level}/10</span>
      </div>
    );
  };

  const filteredMembers = members.filter(member => 
    (member.display_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (member.email || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedMembers = [...filteredMembers].sort((a, b) => {
    if (sortField === "name") {
      return sortDirection === "asc" 
        ? (a.display_name || "").localeCompare(b.display_name || "") 
        : (b.display_name || "").localeCompare(a.display_name || "");
    } else if (sortField === "appreciationPoints") {
      return sortDirection === "asc" 
        ? a.appreciationPoints - b.appreciationPoints 
        : b.appreciationPoints - a.appreciationPoints;
    } else if (sortField === "leadership") {
      return sortDirection === "asc" 
        ? a.leadership - b.leadership 
        : b.leadership - a.leadership;
    } else if (sortField === "communication") {
      return sortDirection === "asc" 
        ? a.communication - b.communication
        : b.communication - a.communication;
    } else if (sortField === "management") {
      return sortDirection === "asc" 
        ? a.management - b.management
        : b.management - a.management;
    } else if (sortField === "problemSolving") {
      return sortDirection === "asc" 
        ? a.problemSolving - b.problemSolving
        : b.problemSolving - a.problemSolving;
    } else if (sortField === "lastActive") {
      return sortDirection === "asc" 
        ? new Date(a.lastActive).getTime() - new Date(b.lastActive).getTime() 
        : new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
    }
    return 0;
  });

  return (
    <Card id="members-list" className="col-span-1 md:col-span-3 shadow-md">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Members List</CardTitle>
            <CardDescription>Team members and their evaluation metrics</CardDescription>
          </div>
          <div className="flex w-full sm:w-auto space-x-2">
            <Input
              placeholder="Search members..."
              className="w-full sm:w-[240px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Filter <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSearchTerm("")}>
                  All Members
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortField("appreciationPoints")}>
                  Sort by Points
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortField("leadership")}>
                  Sort by Leadership
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">
                  <Button variant="ghost" onClick={() => handleSort("name")} className="-ml-4">
                    Member
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("appreciationPoints")} className="-ml-4">
                    Appreciation Points
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("leadership")} className="-ml-4">
                    Leadership
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("communication")} className="-ml-4">
                    Communication
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("management")} className="-ml-4">
                    Management
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("problemSolving")} className="-ml-4">
                    Problem Solving
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedMembers.map((member) => (
                <TableRow key={member.user_id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src="" alt={member.display_name || "Unknown"} />
                        <AvatarFallback>{getInitials(member.display_name || "")}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{member.display_name || "Unknown"}</div>
                        <div className="text-xs text-muted-foreground">{member.email || ""}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 mr-2">
                        <Award className="h-3 w-3 mr-1 fill-amber-500 text-amber-500" /> 
                        {member.appreciationPoints.toLocaleString()}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>{renderSkillLevel(member.leadership)}</TableCell>
                  <TableCell>{renderSkillLevel(member.communication)}</TableCell>
                  <TableCell>{renderSkillLevel(member.management)}</TableCell>
                  <TableCell>{renderSkillLevel(member.problemSolving)}</TableCell>
                </TableRow>
              ))}
              {sortedMembers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No members found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default MembersList;
