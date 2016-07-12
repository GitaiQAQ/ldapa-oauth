/**
 * Ldap 'user' entity
 */
export class User {
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