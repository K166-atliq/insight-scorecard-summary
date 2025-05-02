
// Mock data for the dashboard

export interface Member {
  id: number;
  name: string;
  points: number;
  appreciationPosts: number;
  lastActive: string;
  avatar: string;
  title: string;
  summary: string;
}

export interface CategoryData {
  name: string;
  posts: number;
  engagement: number;
  points: number;
  color: string;
}

export interface SummaryMetric {
  title: string;
  value: string | number;
  change: number;
  trend: "up" | "down" | "neutral";
  description: string;
  icon: string;
  color: "blue" | "purple" | "green" | "orange";
}

// Mock members data
export const membersData: Member[] = [
  {
    id: 1,
    name: "Alex Johnson",
    points: 3840,
    appreciationPosts: 27,
    lastActive: "2025-05-01",
    avatar: "/placeholder.svg",
    title: "UX Designer",
    summary: "Top contributor for Q1 2025, specialized in UI/UX improvements"
  },
  {
    id: 2,
    name: "Samantha Lee",
    points: 3650,
    appreciationPosts: 24,
    lastActive: "2025-04-30",
    avatar: "/placeholder.svg",
    title: "Frontend Developer",
    summary: "Leading the new dashboard implementation project"
  },
  {
    id: 3,
    name: "Michael Rodriguez",
    points: 3120,
    appreciationPosts: 19,
    lastActive: "2025-05-02",
    avatar: "/placeholder.svg",
    title: "Backend Engineer",
    summary: "API optimization specialist, reduced latency by 42%"
  },
  {
    id: 4,
    name: "Emma Wilson",
    points: 2970,
    appreciationPosts: 22,
    lastActive: "2025-04-29",
    avatar: "/placeholder.svg",
    title: "Project Manager",
    summary: "Coordinates cross-team initiatives, improved delivery time by 18%"
  },
  {
    id: 5,
    name: "David Chen",
    points: 2830,
    appreciationPosts: 18,
    lastActive: "2025-05-01",
    avatar: "/placeholder.svg",
    title: "Data Scientist",
    summary: "Implemented machine learning models for product recommendations"
  },
  {
    id: 6,
    name: "Olivia Martinez",
    points: 2640,
    appreciationPosts: 16,
    lastActive: "2025-04-28",
    avatar: "/placeholder.svg",
    title: "QA Specialist",
    summary: "Automated testing pioneer, reduced regression issues by 37%"
  },
  {
    id: 7,
    name: "James Taylor",
    points: 2510,
    appreciationPosts: 14,
    lastActive: "2025-05-02",
    avatar: "/placeholder.svg", 
    title: "Product Owner",
    summary: "Customer-focused feature prioritization and roadmap planning"
  },
  {
    id: 8,
    name: "Sophia Kim",
    points: 2320,
    appreciationPosts: 17,
    lastActive: "2025-04-30",
    avatar: "/placeholder.svg",
    title: "DevOps Engineer",
    summary: "Built CI/CD pipeline that reduced deployment time by 65%"
  },
  {
    id: 9,
    name: "Daniel Brown",
    points: 2180,
    appreciationPosts: 13,
    lastActive: "2025-04-27",
    avatar: "/placeholder.svg",
    title: "Security Analyst",
    summary: "Improved system security and implemented threat detection"
  },
  {
    id: 10,
    name: "Isabella Garcia",
    points: 1950,
    appreciationPosts: 12,
    lastActive: "2025-05-01",
    avatar: "/placeholder.svg",
    title: "Content Strategist",
    summary: "Revamped documentation approach, increasing user satisfaction"
  }
];

// Mock category data
export const categoryData: CategoryData[] = [
  { name: "Development", posts: 324, engagement: 78, points: 12400, color: "#3b82f6" },
  { name: "Design", posts: 196, engagement: 65, points: 9800, color: "#8b5cf6" },
  { name: "Project Management", posts: 147, engagement: 52, points: 7300, color: "#10b981" },
  { name: "QA & Testing", posts: 121, engagement: 44, points: 5600, color: "#f97316" },
  { name: "DevOps", posts: 98, engagement: 39, points: 4900, color: "#ef4444" },
  { name: "Content", posts: 87, engagement: 36, points: 3800, color: "#f59e0b" }
];

// Mock summary metrics
export const summaryMetrics: SummaryMetric[] = [
  {
    title: "Total Members",
    value: 168,
    change: 12,
    trend: "up",
    description: "Active community members",
    icon: "users",
    color: "blue"
  },
  {
    title: "Appreciation Posts",
    value: 1247,
    change: 8,
    trend: "up",
    description: "Recognition posts",
    icon: "award",
    color: "purple"
  },
  {
    title: "Engagement Rate",
    value: "68%",
    change: 5,
    trend: "up",
    description: "Weekly participation",
    icon: "trending-up",
    color: "green"
  },
  {
    title: "Points Awarded",
    value: 27890,
    change: -3,
    trend: "down",
    description: "Points this month",
    icon: "star",
    color: "orange"
  }
];
