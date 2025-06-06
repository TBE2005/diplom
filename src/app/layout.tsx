import type { Metadata } from "next";

import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core';
import { MantineProviders } from "@/shared/providers/mantine";
import { ConvexClientProvider } from "@/shared/providers/convex";

export const metadata: Metadata = {
  title: "donate",
  description: "donate",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body >
        <MantineProviders>
          <ConvexClientProvider>
            {children}
          </ConvexClientProvider>
        </MantineProviders>
      </body>
    </html>
  );
}
