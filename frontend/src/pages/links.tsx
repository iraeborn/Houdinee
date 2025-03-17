import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Sidebar } from "../components/sidebar";
import { Card, CardContent } from "../components/card";
import { Button } from "../components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/dialog";
import { Input } from "../components/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "../components/form";
import { Switch } from "../components/switch";
import { Link, insertLinkSchema } from "../shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "../hooks/use-toast";
import { apiRequest, queryClient } from "../lib/queryClient";
import { Loader2, Plus, Link as LinkIcon, ExternalLink } from "lucide-react";
import { Textarea } from "../components/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/select";
import { countries } from "../lib/countries";

function CreateLinkForm({ onSuccess }: { onSuccess: () => void }) {
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(insertLinkSchema),
    defaultValues: {
      name: "",
      targetUrl: "",
      fallbackUrl: "",
      utmParams: "",
      facebookTrafficOnly: false,
      blockVpn: false,
      blockBots: false,
      maxClicks: undefined,
      requireToken: false,
      allowedReferrers: "",
      allowedCountries: "",
      rateLimit: undefined,
      advancedBotProtection: false,
      securityHeaders: undefined,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/links", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/links"] });
      toast({ title: "Link created successfully" });
      onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create link",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => {
        const cleanData = Object.fromEntries(
          Object.entries(data).map(([key, value]) => [
            key,
            value === "" ? undefined : value
          ])
        );
        mutation.mutate(cleanData);
      })} className="space-y-6 max-h-[70vh] overflow-y-auto px-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Campaign Name</FormLabel>
              <FormControl>
                <Input placeholder="my_campaign_name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="targetUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target URL</FormLabel>
              <FormControl>
                <Input placeholder="https://" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fallbackUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fallback URL</FormLabel>
              <FormControl>
                <Input placeholder="https://" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="utmParams"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Required UTM Parameters</FormLabel>
              <FormControl>
                <Input placeholder="utm_source,utm_medium" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="border rounded-lg p-4 space-y-4">
          <h3 className="font-semibold mb-4">Advanced Protection Settings</h3>

          <FormField
            control={form.control}
            name="advancedBotProtection"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <div>
                  <FormLabel>Enhanced Bot Detection</FormLabel>
                  <FormDescription>Use advanced patterns to detect and block sophisticated bots</FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="allowedReferrers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Allowed Referrers</FormLabel>
                <FormDescription>Enter allowed referrer domains (one per line)</FormDescription>
                <FormControl>
                  <Textarea
                    placeholder="example.com&#10;anotherdomain.com"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="allowedCountries"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Allowed Countries</FormLabel>
                <FormDescription>Select countries that can access this link</FormDescription>
                <FormControl>
                  <Select
                    value={field.value || ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select countries" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rateLimit"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <div>
                  <FormLabel>Rate Limit (requests/minute)</FormLabel>
                  <FormDescription>Limit requests per minute from each IP</FormDescription>
                </div>
                <FormControl>
                  <Input
                    type="number"
                    className="w-24"
                    placeholder="60"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      field.onChange(val ? parseInt(val) : undefined);
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <h3 className="font-semibold mb-4">Security Settings</h3>

          <FormField
            control={form.control}
            name="facebookTrafficOnly"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <div>
                  <FormLabel>Facebook Traffic Only</FormLabel>
                  <FormDescription>Only allow traffic from Facebook referrers</FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="blockVpn"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <div>
                  <FormLabel>Block VPN/Proxy</FormLabel>
                  <FormDescription>Block access from VPN, proxy, or hosting providers</FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="blockBots"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <div>
                  <FormLabel>Block Bots</FormLabel>
                  <FormDescription>Block access from known bot user agents</FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxClicks"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <div>
                  <FormLabel>Max Clicks</FormLabel>
                  <FormDescription>Limit the maximum number of clicks</FormDescription>
                </div>
                <FormControl>
                  <Input
                    type="number"
                    className="w-24"
                    placeholder="Unlimited"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      field.onChange(val ? parseInt(val) : undefined);
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="requireToken"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <div>
                  <FormLabel>Require Token</FormLabel>
                  <FormDescription>Require a secret token for access</FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? <Loader2 className="animate-spin" /> : "Create Link"}
        </Button>
      </form>
    </Form>
  );
}

export default function Links() {
  const [isOpen, setIsOpen] = useState(false);
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Links</h1>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Link
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[600px] max-w-[90vw] p-6">
              <DialogHeader>
                <DialogTitle>Create New Link</DialogTitle>
              </DialogHeader>
              <CreateLinkForm onSuccess={() => setIsOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {links?.map((link) => (
            <LinkCard key={link.id} link={link} />
          ))}
        </div>
      </main>
    </div>
  );
}

function LinkCard({ link }: { link: Link }) {
  const redirectUrl = `${window.location.origin}/r/${link.id}`;

  return (
    <Card>
      <CardContent className="flex items-center justify-between p-6">
        <div className="flex items-center">
          <LinkIcon className="h-8 w-8 text-primary mr-4" />
          <div>
            <h3 className="font-semibold">{link.name}</h3>
            <p className="text-sm text-muted-foreground">{redirectUrl}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigator.clipboard.writeText(redirectUrl)}
          >
            Copy Link
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(link.targetUrl, '_blank')}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}