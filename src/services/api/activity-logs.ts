import { userManagementApiClient } from './client';
import { ActivityLogData, ActivityLogResponse } from './auth';

// Activity Logs API
export const activityLogsApi = {
  // Get all activity logs
  getActivityLogs: async (): Promise<ActivityLogResponse[]> => {
    const response = await userManagementApiClient.get<ActivityLogResponse[]>('/activity-logs/');
    return response.data;
  },

  // Create a new activity log
  createActivityLog: async (logData: ActivityLogData): Promise<ActivityLogResponse> => {
    const response = await userManagementApiClient.post<ActivityLogResponse>('/activity-logs/', logData);
    return response.data;
  }
}; 