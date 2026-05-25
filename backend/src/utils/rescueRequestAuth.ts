/**
 * Checks if a user has access to a specific rescue request.
 * User can access if they are the customer (user_id matches and role is user/customer)
 * or the company (company_id matches and role is company).
 */
export function hasRequestAccess(rescueRequest: any, userId: string, userRole: string): boolean {
  if (!userId || !userRole || !rescueRequest) return false;

  const requestUserId = rescueRequest.user_id?._id
    ? rescueRequest.user_id._id.toString()
    : rescueRequest.user_id?.toString();

  const isCustomer = (userRole === 'user' || userRole === 'customer') && requestUserId === userId;

  const isCompany = userRole === 'company' && rescueRequest.company?.company_id?.toString() === userId;

  return isCustomer || isCompany;
}
