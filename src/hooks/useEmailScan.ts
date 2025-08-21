import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { EmailScanJob, JobStatus, ScanResult } from '@/types';
import { scanGmailForSubscriptions } from '@/services/gmailService';

export function useEmailScan() {
  const { token } = useAuth();
  const [currentJob, setCurrentJob] = useState<EmailScanJob | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);

  const startScan = async (query: string = '') => {
    if (!token) {
      setError('No authentication token available');
      return;
    }

    setIsScanning(true);
    setError(null);

    try {
      const result = await scanGmailForSubscriptions(query);
      
      const job: EmailScanJob = {
        id: result.job_id || `scan-${Date.now()}`,
        status: result.status || JobStatus.COMPLETED,
        progress: 100,
        totalEmails: result.emails_processed || 0,
        processedEmails: result.subscriptions_found || 0,
        foundSubscriptions: result.subscriptions,
        error: result.error_message
      };

      setCurrentJob(job);
      
      // Add to scan history
      setScanHistory(prev => [result, ...prev]);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during scanning');
    } finally {
      setIsScanning(false);
    }
  };

  const cancelScan = () => {
    setIsScanning(false);
    setCurrentJob(prev => prev ? { ...prev, status: JobStatus.FAILED } : null);
  };

  const clearHistory = () => {
    setScanHistory([]);
  };

  const getJobById = (jobId: string): EmailScanJob | undefined => {
    return currentJob?.id === jobId ? currentJob : undefined;
  };

  // Simulate job progress for demo purposes
  useEffect(() => {
    if (isScanning && currentJob) {
      const interval = setInterval(() => {
        setCurrentJob(prev => {
          if (!prev || prev.status === JobStatus.COMPLETED) return prev;
          
          const newProgress = Math.min(prev.progress + 10, 100);
          const isComplete = newProgress >= 100;
          
          return {
            ...prev,
            progress: newProgress,
            status: isComplete ? JobStatus.COMPLETED : JobStatus.RUNNING,
            processedEmails: Math.floor((newProgress / 100) * prev.totalEmails)
          };
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [isScanning, currentJob]);

  return {
    currentJob,
    isScanning,
    error,
    scanHistory,
    startScan,
    cancelScan,
    clearHistory,
    getJobById,
    // Legacy properties for backward compatibility
    scanResult: currentJob ? {
      job_id: currentJob.id,
      subscriptions: currentJob.foundSubscriptions,
      totalFound: currentJob.foundSubscriptions.length,
      estimatedMonthlyCost: currentJob.foundSubscriptions.reduce((sum, sub) => sum + (sub.amount || 0), 0),
      scanDate: new Date()
    } : null
  };
}