  export interface ApiResponse<T = any> {
    status: string;
    message: string;
    data?: T;
    timestamp?: string;
  }

  export interface DashboardStats {
    totalPosts: number;
    pendingApprovalPosts: number;
    approvedPosts: number;
    rejectedPosts: number;
    resolvedPosts: number;
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
  }