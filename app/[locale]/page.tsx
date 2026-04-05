import { redirect } from "next/navigation";

export const runtime = 'edge';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  redirect(`/${locale}/about`);
}
