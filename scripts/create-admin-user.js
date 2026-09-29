const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('File .env.local tidak ditemukan!');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};
for (const line of envContent.split(/\r?\n/)) {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    envVars[match[1]] = value;
  }
}

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('NEXT_PUBLIC_SUPABASE_URL atau SUPABASE_SERVICE_ROLE_KEY tidak ditemukan di .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  const email = process.argv[2] || envVars.ADMIN_EMAIL;
  const password = process.argv[3] || envVars.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error('Penggunaan: node scripts/create-admin-user.js <email> <password>');
    process.exit(1);
  }

  console.log(`Memproses akun admin di Supabase Auth untuk: ${email}...`);

  // Periksa apakah user sudah ada
  const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error('Gagal mengambil daftar pengguna Supabase:', listError.message);
    process.exit(1);
  }

  const existing = usersData?.users?.find(
    (u) => u.email && u.email.toLowerCase() === email.toLowerCase()
  );

  if (existing) {
    const { error: updateError } = await supabase.auth.admin.updateUserById(existing.id, {
      password,
      email_confirm: true,
    });
    if (updateError) {
      console.error('Gagal memperbarui password:', updateError.message);
      process.exit(1);
    }
    console.log(`✅ Kata sandi untuk admin ${email} berhasil diperbarui di Supabase Auth!`);
  } else {
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (createError) {
      console.error('Gagal membuat akun admin:', createError.message);
      process.exit(1);
    }
    console.log(`✅ Akun admin ${newUser.user.email} berhasil didaftarkan di Supabase Auth!`);
  }

  // Perbarui ADMIN_EMAIL dan ADMIN_PASSWORD di .env.local jika berbeda
  let updatedEnv = envContent;
  if (envVars.ADMIN_EMAIL !== email) {
    updatedEnv = updatedEnv.replace(/ADMIN_EMAIL=.*/g, `ADMIN_EMAIL=${email}`);
  }
  if (envVars.ADMIN_PASSWORD !== password) {
    updatedEnv = updatedEnv.replace(/ADMIN_PASSWORD=.*/g, `ADMIN_PASSWORD=${password}`);
  }
  fs.writeFileSync(envPath, updatedEnv, 'utf-8');
  console.log('✅ Konfigurasi .env.local telah disinkronkan.');
}

main().catch((err) => {
  console.error('Terjadi kesalahan:', err);
  process.exit(1);
});
