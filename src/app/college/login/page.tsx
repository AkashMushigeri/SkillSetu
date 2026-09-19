import { redirect } from 'next/navigation';

export default function CollegeLoginPage() {
  redirect('/login?role=college');
}
