/**
 * scripts/seed.ts
 * Standalone Database Seeder Runner for SkillSetu
 * 
 * Usage:
 *   npx tsx scripts/seed.ts
 *   npm run db:seed
 */

async function main() {
  console.log('\n==================================================');
  console.log('🌱  SKILLSETU DATABASE SEEDER PIPELINE');
  console.log('==================================================\n');

  const apiUrl = 'http://localhost:3000/api/admin/seed';

  console.log(`📡 Connecting to local Next.js server at ${apiUrl}...`);
  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`HTTP ${res.status}: ${errText}`);
    }

    const data = await res.json();

    console.log('\n✅ SEEDING COMPLETED SUCCESSFULLY!\n');
    console.log(`⏱️  Duration: ${data.durationMs}ms`);
    console.log('\n📊 Entities Processed:');
    console.log(`  - 👤 Demo Users:    ${data.counts.users}`);
    console.log(`  - ⚡ Skills:         ${data.counts.skills}`);
    console.log(`  - 🏢 Companies:      ${data.counts.companies}`);
    console.log(`  - 🎓 Colleges:       ${data.counts.colleges}`);
    console.log(`  - 💼 Jobs:           ${data.counts.jobs}`);
    console.log(`  - 🎯 Internships:    ${data.counts.internships}`);
    console.log(`  - 🏆 Challenges:     ${data.counts.challenges}`);

    console.log('\n📜 Execution Logs:');
    data.logs.forEach((l: any) => {
      const icon = l.status === 'success' ? '✔' : l.status === 'warning' ? '⚠' : l.status === 'error' ? '✖' : 'ℹ';
      console.log(`  [${icon}] [${l.category.padEnd(10)}] ${l.message}`);
    });

    console.log('\n✨ All demo users and database entities are ready for testing!\n');
    process.exit(0);
  } catch (err: any) {
    console.error('\n❌ Seeding execution notice:', err.message);
    console.log('💡 Note: Ensure your development server is running on http://localhost:3000 (npm run dev)\n');
    process.exit(1);
  }
}

main();
