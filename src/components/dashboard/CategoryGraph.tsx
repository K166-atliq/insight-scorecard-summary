
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CategoryData } from '@/data/mockData';

interface CategoryGraphProps {
  data: CategoryData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background p-3 border border-border rounded-md shadow-md">
        <p className="font-medium">{label}</p>
        <p className="text-sm text-blue-600">Posts: {payload[0].value}</p>
        <p className="text-sm text-purple-600">Engagement: {payload[1].value}%</p>
        <p className="text-sm text-green-600">Points: {payload[2].value}</p>
      </div>
    );
  }
  return null;
};

const CategoryGraph: React.FC<CategoryGraphProps> = ({ data }) => {
  return (
    <Card className="col-span-1 md:col-span-2 shadow-md">
      <CardHeader>
        <CardTitle>Category Performance</CardTitle>
        <CardDescription>
          Distribution of activity and points across categories
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
              barGap={2}
              barSize={20}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                yAxisId="left" 
                orientation="left" 
                stroke="#8884d8" 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                stroke="#82ca9d"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="top" 
                height={36}
                wrapperStyle={{ fontSize: "12px" }}
              />
              <Bar 
                yAxisId="left" 
                dataKey="posts" 
                name="Posts" 
                fill="#3b82f6" 
                radius={[4, 4, 0, 0]} 
              />
              <Bar 
                yAxisId="left" 
                dataKey="engagement" 
                name="Engagement %" 
                fill="#8b5cf6" 
                radius={[4, 4, 0, 0]} 
              />
              <Bar 
                yAxisId="right" 
                dataKey="points" 
                name="Points" 
                fill="#10b981" 
                radius={[4, 4, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryGraph;
