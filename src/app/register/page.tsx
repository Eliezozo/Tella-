import { AuthLayout } from "@/components/layout/auth-layout";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <AuthLayout
      eyebrow="Inscription atelier"
      title="Créer votre espace professionnel Tella"
      description="Inscrivez votre atelier pour être visible par les clientes du Togo. Votre profil sera activé après validation de l'abonnement."
    >
      <RegisterForm />
    </AuthLayout>
  );
}
