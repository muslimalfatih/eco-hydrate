'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/providers/AuthContext';
import { DashboardLayout } from '@/components/DashboardLayout';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardDescription,
  CardAction,
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  BarChart3Icon, 
  ShoppingCartIcon, 
  TrendingUpIcon, 
  UsersIcon,
  DollarSignIcon,
  PackageIcon,
  ActivityIcon,
  EyeIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CreditCardIcon,
  UserPlusIcon
} from 'lucide-react';

// Mock data following shadcn/ui dashboard example structure
const dashboardData = {
  totalRevenue: 45231.89,
  revenueChange: 20.1,
  visitors: 2350,
  visitorsChange: 180.1,
  newCustomers: 156,
  customersChange: 19,
  activeAccounts: 573,
  accountsChange: 201,
  growthRate: 5.25,
  growthChange: 2.02,
  recentOrders: [
    { id: 'ORD-001', customer: 'Olivia Martin', email: 'olivia.martin@email.com', product: 'Eco-Hydrate Classic', amount: 29.99, status: 'completed' },
    { id: 'ORD-002', customer: 'Jackson Lee', email: 'jackson.lee@email.com', product: 'Eco-Hydrate Pro', amount: 39.99, status: 'processing' },
    { id: 'ORD-003', customer: 'Isabella Nguyen', email: 'isabella.nguyen@email.com', product: 'Eco-Hydrate Sport', amount: 34.99, status: 'completed' },
    { id: 'ORD-004', customer: 'William Kim', email: 'will@email.com', product: 'Eco-Hydrate Classic', amount: 29.99, status: 'pending' },
    { id: 'ORD-005', customer: 'Sofia Davis', email: 'sofia.davis@email.com', product: 'Eco-Hydrate Pro', amount: 39.99, status: 'completed' },
  ],
  abTestResults: {
    variantA: { conversions: 23, views: 1250 },
    variantB: { conversions: 31, views: 1180 }
  }
};

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState(dashboardData);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [loading, user, router]);

  // Simulate loading analytics data and show welcome toast
  useEffect(() => {
    if (user) {
      // In production, fetch real data from your API
      // fetchDashboardData().then(setData);
      
      // Show welcome toast for new sessions
      const hasShownWelcome = sessionStorage.getItem('dashboard-welcome-shown');
      if (!hasShownWelcome) {
        toast.success(`Welcome back, ${user.email?.split('@')[0]}!`, {
          description: 'Your dashboard is ready with the latest data',
          duration: 4000,
          action: {
            label: 'Take Tour',
            onClick: () => {
              toast.info('Dashboard tour coming soon!');
            },
          },
        });
        sessionStorage.setItem('dashboard-welcome-shown', 'true');
      }
    }
  }, [user]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!user) return null;

  const variantARate = (data.abTestResults.variantA.conversions / data.abTestResults.variantA.views * 100).toFixed(1);
  const variantBRate = (data.abTestResults.variantB.conversions / data.abTestResults.variantB.views * 100).toFixed(1);

  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">
              Here's what's happening with your store today.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline"
              onClick={() => {
                toast.success('Download started', {
                  description: 'Your report is being prepared for download',
                  action: {
                    label: 'View Downloads',
                    onClick: () => toast.info('Downloads folder opened'),
                  },
                });
              }}
            >
              Download
            </Button>
            <Button
              onClick={() => {
                toast.info('Opening detailed report', {
                  description: 'Redirecting to comprehensive analytics view',
                });
                router.push('/dashboard/analytics');
              }}
            >
              View Report
            </Button>
          </div>
        </div>

        {/* Summary Cards - Following shadcn/ui dashboard example */}
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card 
            className="cursor-pointer transition-all hover:shadow-md"
            onClick={() => {
              toast.info('Revenue Details', {
                description: `Total revenue: $${data.totalRevenue.toLocaleString()} (+${data.revenueChange}% from last month)`,
                action: {
                  label: 'View Details',
                  onClick: () => router.push('/dashboard/analytics'),
                },
              });
            }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${data.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <ArrowUpIcon className="inline h-3 w-3 mr-1" />
                +{data.revenueChange}% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Visitors</CardTitle>
              <UsersIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{data.visitors.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <ArrowUpIcon className="inline h-3 w-3 mr-1" />
                +{data.visitorsChange}% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Customers</CardTitle>
              <UserPlusIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{data.newCustomers}</div>
              <p className="text-xs text-muted-foreground">
                <ArrowUpIcon className="inline h-3 w-3 mr-1" />
                +{data.customersChange}% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Accounts</CardTitle>
              <CreditCardIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{data.activeAccounts}</div>
              <p className="text-xs text-muted-foreground">
                <ArrowUpIcon className="inline h-3 w-3 mr-1" />
                +{data.accountsChange} since last hour
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Content */}
        <div className="grid gap-4 md:gap-8 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                You made {data.recentOrders.length} sales this month.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead className="hidden xl:table-column">Email</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.customer}</TableCell>
                      <TableCell className="hidden xl:table-column text-muted-foreground">
                        {order.email}
                      </TableCell>
                      <TableCell>{order.product}</TableCell>
                      <TableCell className="text-right">${order.amount}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            order.status === 'completed' ? 'default' : 
                            order.status === 'processing' ? 'secondary' : 'outline'
                          }
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>A/B Test Performance</CardTitle>
              <CardDescription>
                Real-time headline variant comparison
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Variant A</p>
                    <p className="text-xs text-muted-foreground">
                      "Eco-Friendly Water Bottle..."
                    </p>
                  </div>
                  <Badge variant="outline">{variantARate}%</Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <EyeIcon className="h-3 w-3" />
                  {data.abTestResults.variantA.views} views
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Variant B</p>
                    <p className="text-xs text-muted-foreground">
                      "Hydrate Better. Save the Planet."
                    </p>
                  </div>
                  <Badge variant="default">{variantBRate}%</Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <EyeIcon className="h-3 w-3" />
                  {data.abTestResults.variantB.views} views
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-muted-foreground">
                Variant B performing {((parseFloat(variantBRate) / parseFloat(variantARate) - 1) * 100).toFixed(1)}% better
              </p>
            </CardFooter>
          </Card>
        </div>

        {/* Performance Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
            <CardDescription>
              Key metrics for your store performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Sales Goal</span>
                  <span className="text-sm text-muted-foreground">68%</span>
                </div>
                <Progress value={68} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Customer Satisfaction</span>
                  <span className="text-sm text-muted-foreground">92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Growth Rate</span>
                  <span className="text-sm text-muted-foreground">{data.growthRate}%</span>
                </div>
                <Progress value={data.growthRate * 10} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Return Rate</span>
                  <span className="text-sm text-muted-foreground">3%</span>
                </div>
                <Progress value={3} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
