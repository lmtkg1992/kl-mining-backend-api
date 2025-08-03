export enum UserStatusEnum {
  ACTIVE = "active", // Normal, logged-in user
  INACTIVE = "inactive", // Temporarily disabled
  PENDING = "pending", // Awaiting email confirmation or approval
  SUSPENDED = "suspended", // Manually locked by admin
  DELETED = "deleted", // Soft deleted
}
