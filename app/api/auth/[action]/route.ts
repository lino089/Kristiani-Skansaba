import { NextRequest, NextResponse } from 'next/server';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@skansaba.sch.id';
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'skansaba2026kristen';

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

      let isAuthenticated = false;

      // 1. If Supabase Auth is configured, try Supabase sign in
      if (isSupabaseConfigured() && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (!error && data.session) {
          isAuthenticated = true;
        }
      }

      // 2. Fallback check against configured admin credentials
      if (!isAuthenticated) {
        if (
          email.toLowerCase() === DEFAULT_ADMIN_EMAIL.toLowerCase() &&
          password === DEFAULT_ADMIN_PASSWORD
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
