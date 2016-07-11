/**
 * Ldap 'user' entity
 */
export class User {
    upi: String;
    emailAddress: String;
    displayName: String;
    firstName: String;
    lastName: String;
    jobTitle: String;
    department: String;
    mobile: String;
    groups: Array<String>;
}