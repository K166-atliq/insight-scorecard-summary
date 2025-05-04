
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background p-3 border border-border rounded-md shadow-md">
        <p className="font-medium">{label}</p>
        <p className="text-sm text-blue-600">{payload[0].name}: {payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

const CategoryGraph = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="col-span-1 md:col-span-2 shadow-md">
        <CardHeader>
          <CardTitle>Team Performance Metrics</CardTitle>
          <CardDescription>
            Average performance scores across key metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full flex items-center justify-center">
            <p className="text-muted-foreground">Loading metrics data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1 md:col-span-2 shadow-md">
      <CardHeader>
        <CardTitle>Team Performance Metrics</CardTitle>
        <CardDescription>
          Average performance scores across key metrics
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
              barSize={60}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="top" 
                height={36}
                wrapperStyle={{ fontSize: "12px" }}
              />
              <Bar 
                dataKey="score" 
                name="Performance Score" 
                fill="#3b82f6" 
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
