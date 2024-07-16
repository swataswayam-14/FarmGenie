import Image from "next/image";
import Link from "next/link";
import { OrganizationSwitcher, SignedIn, SignOutButton, SignedOut, SignInButton } from "@clerk/nextjs";

export default function Topbar() {
  return (
    <nav className="topbar">
      <Link href="/" className="flex items-center gap-4">
        <Image src="/assets/logo.svg" alt="logo" width={28} height={28} />
        <p className="text-heading3-bold text-light-1 max-xs:hidden">FarmGenie</p>
      </Link>
      <div className="flex items-center gap-1">
        <div className="block">
          <SignedIn>
            <SignOutButton>
              <div className="flex cursor-pointer">
                <Image src="/assets/logout.svg" alt="logout" width={24} height={24} />
              </div>
            </SignOutButton>
          </SignedIn>
          <SignedOut>
            <SignInButton>
              <Link href='/sign-in'><div className="flex cursor-pointer rounded-md">
                <Image src="/assets/signin.svg" alt="login" width={28} height={28} className="rounded-full" />
              </div></Link>
            </SignInButton>
          </SignedOut>
        </div>
        <OrganizationSwitcher
          appearance={{
            elements: {
              organizationSwitcherTrigger: "py-2 px-4",
            },
          }}
        />
      </div>
    </nav>
  );
}