"use client";

import { useUser } from "@clerk/nextjs";

export const WelcomeMsg = () => {
    const { user, isLoaded } = useUser();

    return (
        <div className="space-y-2 mb-4">
            <h2 className="text-2xl lg:text-4xl text-white font-medium">
                Bem-vindo de volta{isLoaded ? ", " : " "}{user?.firstName}. 👋🏻
            </h2>
            <p className="text-sm lg:text-base text-[#64f5ff]">
                Este é o seu relatório de visão geral do seu FIDC.
            </p>
        </div>
    );
};