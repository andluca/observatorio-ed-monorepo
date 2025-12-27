"use client";
import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function UsersLayout({ children }: { children: ReactNode }) {
	// Use a client component for navigation
	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
					<div className="flex items-center gap-4">
						<BackButton />
						<h1 className="text-xl font-semibold text-gray-900">Gerenciar Usuários</h1>
					</div>
				</div>
			</header>
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{children}
			</main>
		</div>
	);
}

function BackButton() {
	const router = useRouter();
	return (
		<button
			type="button"
			onClick={() => router.back()}
			className="text-gray-500 hover:text-gray-900 transition-colors"
			aria-label="Voltar"
		>
			<ArrowLeft size={20} />
		</button>
	);
}
