
import React from 'react';
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const DashboardHeader = ({ title, subtitle }) => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6">
      <div className="mb-4 md:mb-0">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground mt-1">{subtitle}</p>
      </div>
      <div className="flex w-full md:w-auto space-x-2">
        <div className="relative w-full md:w-[240px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-8 w-full"
          />
        </div>
        <Button>Export</Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
