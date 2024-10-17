"use client";
import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";

import { checkConnection, handleAccountsChanged } from "./utils/interact";
import { ethers } from "ethers";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

interface ClientContextType {
    client: string | null;
    setClient: React.Dispatch<React.SetStateAction<string | null>>;
  }

export const ClientContext = React.createContext<ClientContextType | null>(null);



export function Providers({ children, themeProps }: ProvidersProps) {

  const router = useRouter();
  const [client, setClient] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (window.ethereum) {
      const connect = async () => {
        const account = await checkConnection();
        setClient(account);
      };

      connect();

      window.ethereum.on("accountsChanged", (accounts: string) =>
        handleAccountsChanged(accounts, setClient),
      );

      return () => {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged,
        );
      };
    }
  }, []);

  return (
    <ClientContext.Provider value={{ client, setClient}}>
      <NextUIProvider navigate={router.push}>
        <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
      </NextUIProvider>
    </ClientContext.Provider>
  );
}

export const useClient = () => {
    const context = React.useContext(ClientContext);
    
    if (!context) {
        throw new Error("useClient must be used within a ClientProvider");
      }
    return context
  };
