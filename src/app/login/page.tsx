import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AuthLayout } from "@/components/layout/auth-layout";
import { LoginForm } from "@/components/auth/login-form";
import { sanitizeCallbackUrl } from "@/lib/safe-redirect";
import { getDemoCredentialsHint } from "@/services/auth-service";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const params = await searchParams;
  const callbackUrl = sanitizeCallbackUrl(params.callbackUrl);
  const session = await auth();

  if (session?.user) {
    redirect(callbackUrl);
  }

  return (
    <AuthLayout
      eyebrow="Connexion"
      title="Accéder à mon atelier"
      description="Connectez-vous pour gérer votre profil, vos collections et votre visibilité sur Tella."
    >
      <LoginForm callbackUrl={callbackUrl} demoHint={getDemoCredentialsHint()} />
    </AuthLayout>
  );
}
