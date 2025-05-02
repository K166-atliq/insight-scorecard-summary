
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { SummaryMetric } from '@/data/mockData';
import { TrendingUp, TrendingDown, Medal, Users, Star, Award } from "lucide-react";

interface SummaryCardsProps {
  metrics: SummaryMetric[];
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ metrics }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'users':
        return <Users className="h-5 w-5" />;
      case 'award':
        return <Award className="h-5 w-5" />;
      case 'trending-up':
        return <TrendingUp className="h-5 w-5" />;
      case 'star':
        return <Star className="h-5 w-5" />;
      default:
        return <Medal className="h-5 w-5" />;
    }
  };

  const getGradientClass = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-gradient-card-blue';
      case 'purple':
        return 'bg-gradient-card-purple';
      case 'green':
        return 'bg-gradient-card-green';
      case 'orange':
        return 'bg-gradient-card-orange';
      default:
        return 'bg-gradient-card-blue';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-fade-in">
      {metrics.map((metric, index) => (
        <Card key={index} className="overflow-hidden border-0 shadow-md">
          <CardContent className="p-0">
            <div className="flex">
              <div className="w-full p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">{metric.title}</span>
                  <div className={`rounded-full p-1.5 ${getGradientClass(metric.color)} shadow-sm`}>
                    {getIcon(metric.icon)}
                  </div>
                </div>
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold">{metric.value}</span>
                  <div className="ml-2 flex items-center">
                    {metric.trend === 'up' ? (
                      <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                    ) : metric.trend === 'down' ? (
                      <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                    ) : null}
                    <span className={`text-xs ${
                      metric.trend === 'up' 
                        ? 'text-green-600' 
                        : metric.trend === 'down' 
                          ? 'text-red-600' 
                          : ''
                    }`}>
                      {metric.change > 0 ? '+' : ''}{metric.change}%
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SummaryCards;
