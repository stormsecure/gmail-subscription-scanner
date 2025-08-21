import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { scanGmailForSubscriptions } from '@/services/gmailService';
import { ScanResult } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Search, DollarSign, Calendar, ExternalLink, LogOut, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, signOut, token, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleScan = async () => {
    if (!token) {
      toast.error('Not authenticated');
      return;
    }

    try {
      setIsScanning(true);
      toast.info('Scanning your Gmail for subscriptions...');
      
      const result = await scanGmailForSubscriptions();
      
      setScanResult(result);
      toast.success(`Found ${result.totalFound} subscriptions!`);
    } catch (error) {
      console.error('Scan error:', error);
      toast.error('Failed to scan emails. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatBillingCycle = (cycle: string) => {
    return cycle.charAt(0).toUpperCase() + cycle.slice(1);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      streaming: 'bg-red-100 text-red-800',
      software: 'bg-blue-100 text-blue-800',
      shopping: 'bg-green-100 text-green-800',
      news: 'bg-yellow-100 text-yellow-800',
      finance: 'bg-purple-100 text-purple-800',
      education: 'bg-indigo-100 text-indigo-800',
      health: 'bg-pink-100 text-pink-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.other;
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Search className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-bold">Gmail Scanner</h1>
              </div>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center space-x-2">
                {user.picture && (
                  <img src={user.picture} alt={user.name} className="h-8 w-8 rounded-full" />
                )}
                <span className="text-sm text-gray-600">{user.email}</span>
              </div>
            </div>
            <Button variant="outline" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {!scanResult ? (
          <div className="text-center max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Welcome, {user.name}!</CardTitle>
                <CardDescription>
                  Ready to discover your email subscriptions? Click the button below to start scanning your Gmail.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={handleScan} 
                  disabled={isScanning}
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  {isScanning ? (
                    <>
                      <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                      Scanning Gmail...
                    </>
                  ) : (
                    <>
                      <Search className="h-5 w-5 mr-2" />
                      Scan My Gmail
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Subscriptions</CardTitle>
                  <Search className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{scanResult.totalFound}</div>
                  <p className="text-xs text-muted-foreground">Active subscriptions found</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Cost</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(scanResult.estimatedMonthlyCost)}</div>
                  <p className="text-xs text-muted-foreground">Estimated monthly spending</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Annual Cost</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(scanResult.estimatedMonthlyCost * 12)}</div>
                  <p className="text-xs text-muted-foreground">Estimated yearly spending</p>
                </CardContent>
              </Card>
            </div>

            {/* Action Bar */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Your Subscriptions</h2>
              <Button onClick={handleScan} disabled={isScanning} variant="outline">
                {isScanning ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Rescan
              </Button>
            </div>

            {/* Subscriptions List */}
            <div className="grid gap-4">
              {scanResult.subscriptions.map((subscription) => (
                <Card key={subscription.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold">{subscription.name}</h3>
                          {subscription.category && (
                            <Badge className={getCategoryColor(subscription.category)}>
                              {subscription.category}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{subscription.email}</p>
                        {subscription.lastEmailDate && (
                          <p className="text-xs text-gray-500">
                            Last email: {subscription.lastEmailDate.toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      
                      <div className="text-right space-y-2">
                        {subscription.cost && (
                          <div>
                            <p className="text-lg font-bold">
                              {formatCurrency(subscription.cost)}
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatBillingCycle(subscription.billingCycle || 'monthly')}
                            </p>
                          </div>
                        )}
                        
                        {subscription.unsubscribeLink && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(subscription.unsubscribeLink, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Unsubscribe
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}