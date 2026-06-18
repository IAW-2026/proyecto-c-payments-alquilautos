"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { isAdminUser } from "@/lib/admin";
import LoadingSpinner from "@/components/LoadingSpinner";
import AccessDenied from "@/components/AccessDenied";
import type { ReactNode } from "react";

interface AdminGuardProps {
  children: ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();

  const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase();
  const isAuthorized = isAdminUser(user);

  if (!isLoaded) {
    return <LoadingSpinner />;
  }

  if (!isSignedIn || !isAuthorized) {
    return (
      <AccessDenied
        email={email}
        onSignOut={() => signOut({ redirectUrl: "/" })}
      />
    );
  }

  return <>{children}</>;
}
