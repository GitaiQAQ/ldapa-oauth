/**
 * Ldap 'user' entity
 */
export class User {
  id: string;
  email: string;
  name: string;
  username: string;
  upi: string;
  emailAddress: string;
  displayName: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  department: string;
  mobile: string;
  groups: Array<string>;
}