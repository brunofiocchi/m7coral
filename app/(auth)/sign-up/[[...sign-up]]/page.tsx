import Image from "next/image";
import { Loader2 } from "lucide-react";
import { SignUp, ClerkLoaded, ClerkLoading } from '@clerk/nextjs';

export default function Page() {
    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            <div className="h-full lg:flex flex-col items-center justify-center px-4">
                <div className="text-center space-y-4 pt-16">
                    <h1 className="font-bold text-3xl text-[#2E2A47]">
                        Bem-vindo de volta!
                    </h1>

                    <p className="text-base text-[#7E8CA0]">
                        Efetue Login ou crie uma conta para acessar o sistema.
                    </p>
                </div>
                <div className="flex items-center justify-center mt-8">
                    <ClerkLoaded>
                        <SignUp />
                    </ClerkLoaded>

                    <ClerkLoading>
                        <Loader2 className="animate-spin text-muted-foreground" />
                    </ClerkLoading>
                </div>
            </div>
            <div className="h-full hidden lg:flex items-center justify-center bg-gradient-to-br from-[#ff9a80] via-[#F4E9E7] to-[#3C9A9A]">
                <Image src="/logo.svg" height={400} width={400} alt="Logo" />
            </div>
        </div>
    );
}