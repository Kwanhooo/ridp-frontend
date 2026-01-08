import type {Metadata} from "next";
import localFont from "next/font/local";
import {Suspense} from "react";
import "./globals.css";
import NavigationLayout from "@/components/NavigationLayout";
import {ReduxProvider} from "@/store";
import { Toaster } from "@/components/ui/toaster"
// import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
// import { AppSidebar } from "@/components/MySidebar";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata: Metadata = {
    title: "轨道交通基础设施多模态数据平台",
    description: "Rail Transit Infrastructure Multimodal Data Platform",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <ReduxProvider>
            {/* <SidebarProvider>
          <AppSidebar />
          <main>
            <SidebarTrigger />
            {children}
          </main>
        </SidebarProvider> */}
            <Suspense
                fallback={
                    <div className="flex h-screen">
                        <main className="flex-1 transition-all duration-300">{children}</main>
                    </div>
                }
            >
                <NavigationLayout>{children}</NavigationLayout>
            </Suspense>
        </ReduxProvider>
        <Toaster />
        </body>
        </html>
    );
}
