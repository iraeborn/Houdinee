import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  isAdmin: boolean("is_admin").default(false),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const links = pgTable("links", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  targetUrl: text("target_url").notNull(),
  fallbackUrl: text("fallback_url").notNull(),
  utmParams: text("utm_params").notNull(),
  // Enhanced security settings
  facebookTrafficOnly: boolean("facebook_traffic_only").default(false),
  blockVpn: boolean("block_vpn").default(false),
  blockBots: boolean("block_bots").default(false),
  maxClicks: integer("max_clicks"),
  requireToken: boolean("require_token").default(false),
  accessToken: text("access_token"),
  tokenExpiry: timestamp("token_expiry"),
  allowedReferrers: text("allowed_referrers"),
  allowedCountries: text("allowed_countries"),
  rateLimit: integer("rate_limit"), // Requests per minute per IP
  advancedBotProtection: boolean("advanced_bot_protection").default(false),
  securityHeaders: jsonb("security_headers"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  linkId: integer("link_id").notNull(),
  clickCount: integer("click_count").default(0),
  utmMatch: boolean("utm_match").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  referrer: text("referrer"),
  country: text("country"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
});

export const insertLinkSchema = createInsertSchema(links).pick({
  name: true,
  targetUrl: true,
  fallbackUrl: true,
  utmParams: true,
  facebookTrafficOnly: true,
  blockVpn: true,
  blockBots: true,
  maxClicks: true,
  requireToken: true,
  allowedReferrers: true,
  allowedCountries: true,
  rateLimit: true,
  advancedBotProtection: true,
  securityHeaders: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Link = typeof links.$inferSelect;
export type Analytics = typeof analytics.$inferSelect;