'use server';

import { signIn } from '../../../auth';
import { redirect } from 'next/navigation';

export async function signInAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false
    });
  } catch {
    redirect('/login?error=CredentialsSignin');
  }

  redirect('/account');
}