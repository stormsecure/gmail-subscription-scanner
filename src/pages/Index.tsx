import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Search, DollarSign, Shield } from 'lucide-react';

export default function Index() {
  const { isAuthenticated, signIn } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      signIn();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Mail className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Gmail Scanner</h1>
          </div>
          <Button onClick={handleGetStarted} size="sm">
            {isAuthenticated ? 'Dashboard' : 'Get Started'}
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Find Hidden Subscriptions in Your Gmail
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Discover recurring payments, track subscription costs, and take control of your spending with our intelligent Gmail scanner.
          </p>
          <Button onClick={handleGetStarted} size="lg" className="mb-12">
            <Mail className="mr-2 h-5 w-5" />
            Scan My Gmail
          </Button>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <Card className="text-center">
            <CardHeader>
              <Search className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Smart Detection</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Our AI-powered scanner identifies subscription services, recurring payments, and billing emails automatically.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <DollarSign className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Cost Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Get a clear breakdown of your monthly and annual subscription costs to understand your spending patterns.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Shield className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Privacy First</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Your emails are processed securely. We only read what's necessary to find subscriptions and never store your data.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Ready to Take Control?</CardTitle>
              <CardDescription className="text-lg">
                Connect your Gmail account and discover your subscriptions in seconds.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleGetStarted} size="lg" className="w-full sm:w-auto">
                Connect Gmail Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-600">
        <p>&copy; 2024 Gmail Subscription Scanner. Built with ❤️ for better financial awareness.</p>
      </footer>
    </div>
  );
}