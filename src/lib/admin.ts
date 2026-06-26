export type ClerkUserForRoleCheck = {
  publicMetadata?: {
    role?: string;
  } | null;
};

const ADMIN_ROLE = "admin";

export function isAdminUser(user?: ClerkUserForRoleCheck | null): boolean {
  if (!user) {
    return false;
  }

  const role = user.publicMetadata?.role;
  return role === ADMIN_ROLE;
}
