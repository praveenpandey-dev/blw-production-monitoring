/**
 * BLW PMS — Supabase Seed Script
 * ─────────────────────────────────────────────────────────────────────────────
 * Creates all 10 BLW personnel accounts in Supabase Auth + users table.
 *
 * SETUP:
 *   1. Run the SQL in supabase/schema.sql in your Supabase SQL Editor first.
 *   2. Copy your keys from Supabase → Project Settings → API
 *   3. Create a .env file from .env.example and fill in:
 *        VITE_SUPABASE_URL=...
 *        SUPABASE_SERVICE_ROLE_KEY=...
 *   4. Run: npx tsx scripts/seed-users.ts
 *
 * DEFAULT PASSWORD: BLW@2026!  (ask each user to change on first login)
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("❌ Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

// Admin client (uses service role key — bypasses RLS)
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const DEFAULT_PASSWORD = "BLW@2026!";

const USERS = [
  {
    email: "admin@blw.com",
    name: "Praveen Pandey",
    role: "ADMIN",
    shop: "HQ Command Centre",
    title: "Chief System Administrator",
    employeeId: "BLW-2026-0001",
    phone: "",
  },
  {
    email: "pm@blw.com",
    name: "Ritik Dubey",
    role: "PRODUCTION_MANAGER",
    shop: "Heavy Fabrication Lines",
    title: "Chief Production Manager",
    employeeId: "BLW-2026-0002",
    phone: "",
  },
  {
    email: "frame@blw.com",
    name: "Rahul Yadav",
    role: "SHOP_SUPERVISOR",
    shop: "Frame Fabrication Shop",
    title: "Frame Shop Supervisor",
    employeeId: "BLW-2026-0101",
    phone: "",
  },
  {
    email: "bogie@blw.com",
    name: "Shailender Dubey",
    role: "SHOP_SUPERVISOR",
    shop: "Bogie Shop",
    title: "Bogie Shop Supervisor",
    employeeId: "BLW-2026-0102",
    phone: "",
  },
  {
    email: "shell@blw.com",
    name: "Aman Prajapati",
    role: "SHOP_SUPERVISOR",
    shop: "Shell Assembly Shop",
    title: "Shell Assembly Supervisor",
    employeeId: "BLW-2026-0103",
    phone: "",
  },
  {
    email: "electrical@blw.com",
    name: "Tejas Pathak",
    role: "SHOP_SUPERVISOR",
    shop: "Electrical Assembly Shop",
    title: "Electrical Shop Supervisor",
    employeeId: "BLW-2026-0104",
    phone: "",
  },
  {
    email: "brake@blw.com",
    name: "Nikhil Mishra",
    role: "SHOP_SUPERVISOR",
    shop: "Brake & Pneumatic Shop",
    title: "Brake Shop Supervisor",
    employeeId: "BLW-2026-0105",
    phone: "",
  },
  {
    email: "paint@blw.com",
    name: "Ranvir Srivastava",
    role: "SHOP_SUPERVISOR",
    shop: "Paint Shop",
    title: "Paint Shop Supervisor",
    employeeId: "BLW-2026-0106",
    phone: "",
  },
  {
    email: "testing@blw.com",
    name: "Ekansh Srivastava",
    role: "SHOP_SUPERVISOR",
    shop: "Testing Center",
    title: "Testing Center Supervisor",
    employeeId: "BLW-2026-0107",
    phone: "",
  },
  {
    email: "dispatch@blw.com",
    name: "Harsh Singh",
    role: "SHOP_SUPERVISOR",
    shop: "Dispatch Center",
    title: "Dispatch Logistics Supervisor",
    employeeId: "BLW-2026-0108",
    phone: "",
  },
] as const;

async function seed() {
  console.log("🚀 BLW PMS — Seeding Supabase users...\n");

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const u of USERS) {
    process.stdout.write(`  → ${u.name} (${u.email}) [${u.role}] ... `);

    // 1. Create Auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: u.email,
      password: DEFAULT_PASSWORD,
      email_confirm: true,
      user_metadata: { name: u.name, role: u.role },
    });

    if (authError) {
      if (authError.message.includes("already been registered") || authError.message.includes("already exists")) {
        console.log("⏭  already exists (skipped)");
        skipCount++;
        continue;
      }
      console.log(`❌ Auth error: ${authError.message}`);
      errorCount++;
      continue;
    }

    const uid = authData.user.id;

    // 2. Insert profile into users table
    const { error: dbError } = await supabase.from("users").upsert({
      id: uid,
      name: u.name,
      email: u.email,
      role: u.role,
      shop: u.shop,
      title: u.title,
      employee_id: u.employeeId,
      phone: u.phone,
      status: "Active",
    }, { onConflict: "id" });

    if (dbError) {
      console.log(`⚠️  Auth created but DB insert failed: ${dbError.message}`);
      errorCount++;
    } else {
      console.log("✅ Created");
      successCount++;
    }

    // Small delay to avoid rate limiting
    await new Promise((r) => setTimeout(r, 300));
  }

  console.log(`\n${"─".repeat(50)}`);
  console.log(`✅ Created:  ${successCount}`);
  console.log(`⏭  Skipped:  ${skipCount}`);
  console.log(`❌ Errors:   ${errorCount}`);
  console.log(`${"─".repeat(50)}`);
  console.log(`\n🔐 Default password: ${DEFAULT_PASSWORD}`);
  console.log("   Ask each user to change their password after first login.\n");
}

seed().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
