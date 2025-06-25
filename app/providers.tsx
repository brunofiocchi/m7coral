"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { ptBR } from "@clerk/localizations";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      localization={{
        ...ptBR,
        signIn: {
          ...ptBR.signIn,
          start: {
            title: "Entrar em M7 Coral", // 👈 Título customizado
            subtitle: "Bem-vindo de volta! Faça login para continuar.", // 👈 Subtítulo customizado
          },
        },
      }}
      appearance={{
        layout: {
          logoPlacement: "inside",
        },
      }}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/"
      afterSignUpUrl="/"
    >
      {children}
    </ClerkProvider>
  );
}


