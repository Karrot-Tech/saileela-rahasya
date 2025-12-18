
import { currentUser } from '@clerk/nextjs/server';

export async function isAdmin() {
    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses[0]?.emailAddress;

    // Read from environment variable (comma-separated list)
    const adminEmailsStr = process.env.ADMIN_EMAILS || '';
    const adminEmails = adminEmailsStr.split(',').map(e => e.trim().toLowerCase());

    return !!email && adminEmails.includes(email.toLowerCase());
}
