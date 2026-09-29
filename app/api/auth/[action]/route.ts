import { NextRequest, NextResponse } from 'next/server';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

// Honeypot Credentials (Prank decoy displayed on the login page)
export const HONEYPOT_EMAIL = 'admin@skansaba.sch.id';
export const HONEYPOT_PASSWORD = 'skansaba2026kristen';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ action: string }> }
) {
  const { action } = await params;

  if (action === 'login') {
    try {
      const body = await request.json();
      const { email, password } = body;

      if (!email || !password) {
        return NextResponse.json(
          { success: false, message: 'Email dan password wajib diisi.' },
          { status: 400 }
        );
      }

      const inputEmail = String(email).trim().toLowerCase();
      const inputPassword = String(password);

      // 1. Honeypot check (Prank Trap)
      if (
        inputEmail === HONEYPOT_EMAIL.toLowerCase() &&
        inputPassword === HONEYPOT_PASSWORD
      ) {
        return NextResponse.json(
          {
            success: false,
            isPrank: true,
            message: 'Kena prank! Ini adalah kredensial jebakan (honeypot).',
          },
          { status: 400 }
        );
      }

      let isAuthenticated = false;

      // 2. Primary: Authenticate directly via Supabase Auth
      if (isSupabaseConfigured() && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: inputEmail,
          password: inputPassword,
        });

        if (!error && data.session) {
          isAuthenticated = true;
        }
      }

      // 3. Fallback: Check against environment variables (.env.local) if Supabase Auth not matched
      if (!isAuthenticated) {
        const configuredEmail = process.env.ADMIN_EMAIL;
        const configuredPassword = process.env.ADMIN_PASSWORD;

        if (
          configuredEmail &&
          configuredPassword &&
          inputEmail === configuredEmail.trim().toLowerCase() &&
          inputPassword === configuredPassword
        ) {
          isAuthenticated = true;
        }
      }

      if (!isAuthenticated) {
        return NextResponse.json(
          {
            success: false,
            message: 'Email atau kata sandi admin tidak sesuai.',
          },
          { status: 401 }
        );
      }

      // Create session response
      const response = NextResponse.json({
        success: true,
        message: 'Berhasil masuk ke panel admin.',
        user: { email },
      });

      // Set HTTP-only secure cookie
      response.cookies.set('admin_session', 'authenticated_admin_skansaba', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
    } catch {
      return NextResponse.json(
        { success: false, message: 'Terjadi kesalahan sistem saat autentikasi.' },
        { status: 500 }
      );
    }
  }

  if (action === 'logout') {
    const response = NextResponse.json({
      success: true,
      message: 'Sesi admin telah diakhiri.',
    });

    response.cookies.set('admin_session', '', {
      httpOnly: true,
      expires: new Date(0),
      path: '/',
    });

    return response;
  }

  return NextResponse.json({ error: 'Aksi tidak valid.' }, { status: 400 });
}
