
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Member } from '@/data/mockData';
import { ArrowUpDown, ChevronDown, Star } from "lucide-react";
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

interface MembersListProps {
  members: Member[];
}

type SortField = "name" | "points" | "appreciationPosts" | "lastActive";
type SortDirection = "asc" | "desc";

const MembersList: React.FC<MembersListProps> = ({ members }) => {
  const [sortField, setSortField] = useState<SortField>("points");
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

  const getInitials = (name: string) => {
    return name.split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedMembers = [...filteredMembers].sort((a, b) => {
    if (sortField === "name") {
      return sortDirection === "asc" 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    } else if (sortField === "points") {
      return sortDirection === "asc" 
        ? a.points - b.points 
        : b.points - a.points;
    } else if (sortField === "appreciationPosts") {
      return sortDirection === "asc" 
        ? a.appreciationPosts - b.appreciationPosts 
        : b.appreciationPosts - a.appreciationPosts;
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
            <CardDescription>All members with their points and activities</CardDescription>
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
                <DropdownMenuItem onClick={() => setSearchTerm("developer")}>
                  Developers
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchTerm("design")}>
                  Designers
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">
                  <Button variant="ghost" onClick={() => handleSort("name")} className="-ml-4">
                    Member
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("points")} className="-ml-4">
                    Points
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  <Button variant="ghost" onClick={() => handleSort("appreciationPosts")} className="-ml-4">
                    Appreciation Posts
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="hidden lg:table-cell">
                  Summary
                </TableHead>
                <TableHead className="text-right hidden sm:table-cell">
                  <Button variant="ghost" onClick={() => handleSort("lastActive")} className="-mr-4">
                    Last Active
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-xs text-muted-foreground">{member.title}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 mr-2">
                        <Star className="h-3 w-3 mr-1 fill-amber-500 text-amber-500" /> 
                        {member.points.toLocaleString()}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {member.appreciationPosts}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell max-w-[400px]">
                    <span className="text-sm text-muted-foreground line-clamp-1">
                      {member.summary}
                    </span>
                  </TableCell>
                  <TableCell className="text-right hidden sm:table-cell">
                    {new Date(member.lastActive).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
              {sortedMembers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
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
