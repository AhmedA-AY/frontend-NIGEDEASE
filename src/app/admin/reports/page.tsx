'use client';

import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Button, 
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  Paper,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import { useStore } from '@/providers/store-provider';
import { useCurrentUser } from '@/hooks/use-auth';
import { reportsApi, ReportType, ReportData } from '@/services/api/reports';
import { useReactToPrint } from 'react-to-print';
import { ReportDisplay } from '@/components/reports/report-display';
import TableChartIcon from '@mui/icons-material/TableChart';
import BarChartIcon from '@mui/icons-material/BarChart';

export default function ReportsPage() {
  const { currentStore } = useStore();
  const { userInfo } = useCurrentUser();
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [availableReports, setAvailableReports] = React.useState<ReportType[]>([]);
  const [selectedReport, setSelectedReport] = React.useState<ReportType | null>(null);
  const [reportData, setReportData] = React.useState<ReportData | null>(null);
  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [endDate, setEndDate] = React.useState<Date | null>(null);
  const [reportFormat, setReportFormat] = React.useState<'table' | 'graph'>('table');
  const reportRef = React.useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: reportRef,
    documentTitle: 'Report',
    onBeforeGetContent: () => {
      setIsLoading(true);
    },
    onAfterPrint: () => {
      setIsLoading(false);
    }
  });

  const fetchAvailableReports = React.useCallback(async () => {
    if (!currentStore) {
      setError('Please select a store to view reports');
      setIsLoading(false);
      return;
    }

    try {
      const response = await reportsApi.getAvailableReports(currentStore.id);
      setAvailableReports(response.available_reports);
      setError(null);
    } catch (err) {
      console.error('Error fetching available reports:', err);
      setError('Failed to load available reports. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [currentStore]);

  const fetchReportData = React.useCallback(async () => {
    if (!currentStore || !selectedReport) return;

    setIsLoading(true);
    setError(null);

    try {
      const filters = {
        start_date: startDate ? format(startDate, 'yyyy-MM-dd') : undefined,
        end_date: endDate ? format(endDate, 'yyyy-MM-dd') : undefined,
        format: reportFormat
      };

      const data = await reportsApi.getReport(currentStore.id, selectedReport.type, filters);
      setReportData(data);
    } catch (err) {
      console.error('Error fetching report data:', err);
      setError('Failed to load report data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [currentStore, selectedReport, startDate, endDate, reportFormat]);

  React.useEffect(() => {
    fetchAvailableReports();
  }, [fetchAvailableReports]);

  React.useEffect(() => {
    if (selectedReport) {
      fetchReportData();
    }
  }, [selectedReport, fetchReportData]);

  if (isLoading && !reportData) {
    return (
      <Container>
        <Box sx={{ my: 5, textAlign: 'center' }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading reports...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Box sx={{ my: 5 }}>
          <Alert severity="error">{error}</Alert>
          <Button 
            variant="contained" 
            onClick={fetchAvailableReports}
            sx={{ mt: 2 }}
          >
            Retry
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth={false}>
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" gutterBottom>
          Reports
        </Typography>

        {currentStore && (
          <Paper 
            elevation={0} 
            sx={{ 
              p: 2, 
              mt: 2,
              backgroundColor: 'rgba(14, 165, 233, 0.1)', 
              border: '1px solid rgba(14, 165, 233, 0.3)',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}
          >
            <Typography variant="subtitle1">
              Currently managing: <strong>{currentStore.name}</strong> ({currentStore.location})
            </Typography>
          </Paper>
        )}

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Report Settings
                </Typography>
                
                <TextField
                  select
                  fullWidth
                  label="Select Report Type"
                  value={selectedReport?.type || ''}
                  onChange={(e) => {
                    const report = availableReports.find(r => r.type === e.target.value);
                    setSelectedReport(report || null);
                  }}
                  sx={{ mb: 2 }}
                >
                  {availableReports.map((report) => (
                    <MenuItem key={report.type} value={report.type}>
                      {report.name}
                    </MenuItem>
                  ))}
                </TextField>

                {selectedReport?.supports_date_range && (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Box sx={{ mb: 2 }}>
                      <DatePicker
                        label="Start Date"
                        value={startDate}
                        onChange={(newValue) => setStartDate(newValue)}
                        sx={{ width: '100%', mb: 2 }}
                      />
                      <DatePicker
                        label="End Date"
                        value={endDate}
                        onChange={(newValue) => setEndDate(newValue)}
                        sx={{ width: '100%' }}
                      />
                    </Box>
                  </LocalizationProvider>
                )}

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Report Format
                  </Typography>
                  <ToggleButtonGroup
                    value={reportFormat}
                    exclusive
                    onChange={(_, newFormat) => newFormat && setReportFormat(newFormat)}
                    fullWidth
                  >
                    <ToggleButton value="table">
                      <TableChartIcon sx={{ mr: 1 }} />
                      Table
                    </ToggleButton>
                    <ToggleButton value="graph">
                      <BarChartIcon sx={{ mr: 1 }} />
                      Graph
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  onClick={fetchReportData}
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : 'Generate Report'}
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            {reportData && (
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                      {reportData.title}
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={handlePrint}
                    >
                      Export to PDF
                    </Button>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {reportData.description}
                  </Typography>

                  <Box ref={reportRef}>
                    <ReportDisplay data={reportData} format={reportFormat} />
                  </Box>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
} 