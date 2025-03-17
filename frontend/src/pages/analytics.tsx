import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "../components/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "../components/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/table";
import { Link, Analytics } from "../shared/schema";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

export default function AnalyticsPage() {
  const { data: links, isLoading } = useQuery<Link[]>({
    queryKey: ["/api/links"],
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
        <h1 className="text-3xl font-bold mb-8">Analytics</h1>

        <div className="space-y-8">
          {links?.map((link) => (
            <LinkAnalytics key={link.id} link={link} />
          ))}
        </div>
      </main>
    </div>
  );
}

function LinkAnalytics({ link }: { link: Link }) {
  const { data: analytics } = useQuery<Analytics[]>({
    queryKey: ["/api/links", link.id, "analytics"],
  });

  const totalClicks = analytics?.reduce((sum, a) => sum + (a.clickCount || 0), 0) || 0;
  const matchedClicks = analytics?.filter(a => a.utmMatch).reduce((sum, a) => sum + (a.clickCount || 0), 0) || 0;
  const matchRate = totalClicks ? Math.round((matchedClicks / totalClicks) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{link.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <div className="p-4 rounded-lg bg-primary/5">
            <p className="text-sm text-muted-foreground">Total Clicks</p>
            <p className="text-2xl font-bold">{totalClicks}</p>
          </div>
          <div className="p-4 rounded-lg bg-primary/5">
            <p className="text-sm text-muted-foreground">Matched Clicks</p>
            <p className="text-2xl font-bold">{matchedClicks}</p>
          </div>
          <div className="p-4 rounded-lg bg-primary/5">
            <p className="text-sm text-muted-foreground">UTM Match Rate</p>
            <p className="text-2xl font-bold">{matchRate}%</p>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Clicks</TableHead>
              <TableHead>UTM Match</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {analytics?.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>
                  {format(new Date(entry.timestamp || new Date()), "MMM d, yyyy HH:mm")}
                </TableCell>
                <TableCell>{entry.clickCount}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      entry.utmMatch
                        ? "bg-green-500/10 text-green-500"
                        : "bg-red-500/10 text-red-500"
                    }`}
                  >
                    {entry.utmMatch ? "Matched" : "Not Matched"}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
