import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { activityLogsApi } from '@/services/api/activity-logs';
import { ActivityLogData } from '@/services/api/auth';

// Hook to get all activity logs
export const useActivityLogs = () => {
  return useQuery({
    queryKey: ['activityLogs'],
    queryFn: () => activityLogsApi.getActivityLogs(),
  });
};

// Hook to create a new activity log
export const useCreateActivityLog = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (logData: ActivityLogData) => activityLogsApi.createActivityLog(logData),
    onSuccess: () => {
      // Invalidate the activity logs query to refetch the updated list
      queryClient.invalidateQueries({ queryKey: ['activityLogs'] });
    },
  });
}; 