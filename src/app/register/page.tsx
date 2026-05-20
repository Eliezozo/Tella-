import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AuthLayout } from "@/components/layout/auth-layout";
import { RegisterForm } from "@/components/auth/register-form";

export default async function RegisterPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <AuthLayout
      eyebrow="Inscription atelier"
      title="Créer votre espace professionnel Tella"
      description="Inscrivez votre atelier en trois étapes. Votre compte sera activé après validation par notre équipe — vous pourrez ensuite gérer vos créations et statistiques."
    >
      <RegisterForm />
    </AuthLayout>
  );
}
