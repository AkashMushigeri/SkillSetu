import { redirect } from 'next/navigation';

export default function IndustryLoginPage() {
  redirect('/login?role=industry');
}
