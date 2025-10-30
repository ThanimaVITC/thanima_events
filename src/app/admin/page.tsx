import { AdminDashboard } from '@/components/admin-dashboard';
import { AdminLogin } from '@/components/admin-login';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function AdminPage() {
  const cookieStore = cookies();
  const isAuthenticated = cookieStore.get('admin-auth')?.value === 'true';

  async function handleLogin(formData: FormData) {
    'use server';
    const password = formData.get('password');
    if (password === process.env.ADMIN_PASSWORD) {
      cookies().set('admin-auth', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 1 day
      });
      redirect('/admin');
    } else {
      redirect('/admin?error=Invalid%20password');
    }
  }

  async function handleLogout() {
    'use server';
    cookies().delete('admin-auth');
    redirect('/admin');
  }

  if (isAuthenticated) {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center p-4">
      <div className="content-backdrop">
        <AdminLogin onLogin={handleLogin} />
      </div>
    </main>
  );
}
