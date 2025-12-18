import { currentUser } from '@clerk/nextjs/server';

export async function isAdmin() {
    const clerkUser = await currentUser();
    if (!clerkUser) return false;

    // Read from environment variable (comma-separated list)
    // Strip accidental quotes if they exist
    const adminEmailsStr = (process.env.ADMIN_EMAILS || '').replace(/['"]/g, '');
    const adminEmails = adminEmailsStr.split(',')
        .map(e => e.trim().toLowerCase())
        .filter(e => e !== '');

    const userEmails = clerkUser.emailAddresses.map(e => e.emailAddress.toLowerCase());
    const isAuthorized = userEmails.some(email => adminEmails.includes(email));

    console.log(`[AdminCheck] User: ${userEmails.join(', ')} | Status: ${isAuthorized ? 'GRANTED' : 'DENIED'} | Admins: ${adminEmails.length} configured`);

    return isAuthorized;
}
