import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "../components/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "../components/card";
import { Link as LinkType } from "../shared/schema";
import {
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { Loader2, Link, Users, Pointer } from "lucide-react";

export default function Dashboard() {
  const { data: links, isLoading } = useQuery<LinkType[]>({
    queryKey: ["/api/links"],
  });

  const { data: analytics } = useQuery<any[]>({
    queryKey: ["/api/links/analytics"],
    enabled: !!links,
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <StatsCard
            title="Total Links"
            value={links?.length || 0}
            icon={Link}
          />
          <StatsCard
            title="Total Clicks"
            value={analytics?.reduce((acc, a) => acc + a.clickCount, 0) || 0}
            icon={Pointer}
          />
          <StatsCard
            title="UTM Match Rate"
            value={`${Math.round((analytics?.filter(a => a.utmMatch).length || 0) / (analytics?.length || 1) * 100)}%`}
            icon={Users}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Click Analytics</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics || []}>
                <CartesianGrid strokeDasharray="3 3" />
                {/* <XAxis dataKey="timestamp" />
                <YAxis /> */}
                <Tooltip />
                <Line type="monotone" dataKey="clickCount" stroke="#3b82f6" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function StatsCard({ title, value, icon: Icon }: {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card>
      <CardContent className="flex items-center p-6">
        <Icon className="h-8 w-8 text-primary mr-4" />
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );
}
