import { AuthLayout } from "@/components/layout/auth-layout";
import { LoginForm } from "@/components/auth/login-form";
import { getDemoCredentialsHint } from "@/services/auth-service";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const params = await searchParams;
  const callbackUrl = params.callbackUrl ?? "/dashboard";

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
