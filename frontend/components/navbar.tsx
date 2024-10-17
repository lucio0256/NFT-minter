"use client";

import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
} from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import NextLink from "next/link";
import { CiWallet } from "react-icons/ci";
import { RiNftLine } from "react-icons/ri";

import { connectMetamask, disconnect } from "../app/utils/interact";

import { Logo } from "@/components/icons";
import { useClient } from "@/app/providers";

export const Navbar = () => {
  const {client, setClient} = useClient();

  const handleConnection = async () => {
    if (client) {
        await disconnect()
        setClient(null);
    } else {
        const res = await connectMetamask()
        setClient(res);
    }
  };

  return (
    <NextUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Logo />
            <p className="font-bold text-inherit">FREE NFT MINT</p>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="basis-1/5 sm:basis-full" justify="end">
        <NavbarItem className="flex">
          {client ? (
            <Button
              as={Link}
              className="text-sm font-normal text-default-600 bg-default-100 mx-4"
              href="/items"
              startContent={<RiNftLine className="text-primary" />}
              variant="flat"
            >
              My Items
            </Button>
          ) : (
            ""
          )}

          <Button
            className="text-sm font-normal text-default-600 bg-default-100"
            startContent={<CiWallet className="text-danger" />}
            variant="flat"
            onPress={handleConnection}
          >
            {client ? (
              <>
                <div className="flex flex-col items-center">
                  <span>
                    {client.slice(0, 5)}...{client.slice(-4)}
                  </span>
                  <span>Disconnect</span>
                </div>
              </>
            ) : (
              "Connect Wallet"
            )}
          </Button>
        </NavbarItem>
      </NavbarContent>
    </NextUINavbar>
  );
};
