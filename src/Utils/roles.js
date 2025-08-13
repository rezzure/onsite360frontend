export const ROLES = {
  admin: {
    canViewUsers: true,
    canEditFeatures: true,
  },
  supervisor: {
    canViewUsers: true,
    canEditFeatures: false,
  },
  client: {
    canViewUsers: false,
    canEditFeatures: false,
  },
};