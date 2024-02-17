"use client";

import { UserButton, useAuth } from "@clerk/nextjs";
import Wrapper from "../Wrapper";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import SearchBar from "../SearchBar";
import { ModeToggle } from "../mode-toggle";

const Navbar = () => {
  const router = useRouter();
  const { userId } = useAuth();

  return (
    <div className="sticky top-0 border border-b-primary/10 bg-secondary">
      <Wrapper>
        <div className="flex items-center justify-between">
          <div
            onClick={() => router.push("/")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Image src="/icons/logo.png" alt="logo" width={50} height={50} />
            <div className="font-bold text-xl">Travel Nest</div>
          </div>

          <SearchBar />

          <div className="flex items-center gap-3">
            <ModeToggle />
            {userId ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => router.push("/sign-in")}
                >
                  Sign in
                </Button>
                <Button onClick={() => router.push("/sign-up")}>Sign up</Button>
              </>
            )}
          </div>
        </div>
      </Wrapper>
    </div>
  );
};

export default Navbar;
