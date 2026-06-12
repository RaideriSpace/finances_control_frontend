import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
	metadataBase: new URL("https://raillink.com"),
	title: "RailLink - Gerenciador Financeiro | Controle Suas Finanças",
	description:
		"RailLink é um gerenciador financeiro inteligente que ajuda você a controlar despesas, receitas e saldos com facilidade. Organize suas finanças em um só lugar.",
	keywords: [
		"gerenciador financeiro",
		"controle de despesas",
		"controle de receitas",
		"finanças pessoais",
		"orçamento",
		"transações",
		"saldos",
		"faturas",
	],
	authors: [{ name: "RaideriSpace", url: "https://raiderispace.com" }],
	creator: "RaideriSpace",
	publisher: "RaideriSpace",
	formatDetection: {
		email: false,
		telephone: false,
	},
	openGraph: {
		type: "website",
		locale: "pt_BR",
		url: "https://raillink.com",
		siteName: "RailLink",
		title: "RailLink - Gerenciador Financeiro",
		description: "Controle suas finanças com inteligência e simplicidade",
		images: [
			{
				url: "/assets/logo.png",
				width: 1200,
				height: 630,
				alt: "RailLink Logo",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "RailLink - Gerenciador Financeiro",
		description: "Controle suas finanças com inteligência e simplicidade",
		creator: "@RaideriSpace",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			"index": true,
			"follow": true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	icons: {
		icon: "/assets/logo.png",
		apple: "/assets/logo.png",
	},
};

export const viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
