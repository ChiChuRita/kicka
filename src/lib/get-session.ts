import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { authOptions } from './auth-options';

export async function getSession() {
  const session = await getServerSession(authOptions);

  if (!session) return redirect("/");

  return session;
}

export async function getUnsafeSession() {
  return await getServerSession(authOptions);
}
