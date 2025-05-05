
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface QuarterYearFilterProps {
  selectedQuarter: string;
  selectedYear: number;
  onQuarterChange: (quarter: string) => void;
  onYearChange: (year: number) => void;
  availableYears: number[];
}

const QuarterYearFilter = ({
  selectedQuarter,
  selectedYear,
  onQuarterChange,
  onYearChange,
  availableYears,
}: QuarterYearFilterProps) => {
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4', 'All'];

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end mb-6">
      <div className="space-y-2 w-full sm:w-auto">
        <Label htmlFor="quarter-select">Quarter</Label>
        <Select
          value={selectedQuarter} 
          onValueChange={onQuarterChange}
        >
          <SelectTrigger id="quarter-select" className="w-full sm:w-[150px]">
            <SelectValue placeholder="Select Quarter" />
          </SelectTrigger>
          <SelectContent>
            {quarters.map((quarter) => (
              <SelectItem key={quarter} value={quarter}>
                {quarter}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2 w-full sm:w-auto">
        <Label htmlFor="year-select">Year</Label>
        <Select
          value={selectedYear.toString()} 
          onValueChange={(value) => onYearChange(parseInt(value))}
        >
          <SelectTrigger id="year-select" className="w-full sm:w-[150px]">
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">All Years</SelectItem>
            {availableYears.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default QuarterYearFilter;
