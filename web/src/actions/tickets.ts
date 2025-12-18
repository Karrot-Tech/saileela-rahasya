'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { currentUser } from '@clerk/nextjs/server';

const ADMIN_EMAILS = ['pavankumarpai@gmail.com', 'pavanpaik2025@gmail.com'];

async function isAdmin() {
    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses[0]?.emailAddress;
    return !!email && ADMIN_EMAILS.includes(email);
}

export async function getTickets() {
    try {
        const clerkUser = await currentUser();
        if (!clerkUser || !clerkUser.emailAddresses[0]?.emailAddress) {
            return [];
        }

        const userEmail = clerkUser.emailAddresses[0].emailAddress;

        const user = await prisma.user.findUnique({
            where: { email: userEmail },
            include: {
                tickets: {
                    include: {
                        messages: {
                            orderBy: {
                                createdAt: 'asc'
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        });

        // Manual serialization of Dates for Next.js Server Action compatibility
        const sanitizedTickets = (user?.tickets || []).map((ticket: any) => ({
            ...ticket,
            createdAt: ticket.createdAt.toISOString(),
            updatedAt: ticket.updatedAt.toISOString(),
            messages: ticket.messages.map((msg: any) => ({
                ...msg,
                createdAt: msg.createdAt.toISOString()
            }))
        }));

        return sanitizedTickets;
    } catch (error) {
        console.error('Error fetching tickets:', error);
        return [];
    }
}

export async function createTicket(subject: string, message: string) {
    try {
        const clerkUser = await currentUser();
        if (!clerkUser || !clerkUser.emailAddresses[0]?.emailAddress) {
            return { success: false, error: 'Unauthorized' };
        }

        const userEmail = clerkUser.emailAddresses[0].emailAddress;
        const userName = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'Devotee';

        // Ensure user exists in our DB
        let user = await prisma.user.findUnique({
            where: { email: userEmail }
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email: userEmail,
                    name: userName,
                    image: clerkUser.imageUrl
                }
            });
        }

        const newTicket = await prisma.ticket.create({
            data: {
                userId: user.id,
                subject,
                messages: {
                    create: {
                        text: message,
                        sender: 'USER'
                    }
                }
            },
            include: {
                messages: true
            }
        });

        const sanitizedTicket = {
            ...newTicket,
            createdAt: newTicket.createdAt.toISOString(),
            updatedAt: newTicket.updatedAt.toISOString(),
            messages: newTicket.messages.map((msg: any) => ({
                ...msg,
                createdAt: msg.createdAt.toISOString()
            }))
        };

        revalidatePath('/ask');
        return { success: true, ticket: sanitizedTicket };
    } catch (error) {
        console.error('Error creating ticket:', error);
        return { success: false, error: 'Failed to create ticket' };
    }
}

export async function getAllTickets() {
    try {
        if (!await isAdmin()) {
            throw new Error('Unauthorized');
        }

        const tickets = await prisma.ticket.findMany({
            include: {
                user: true,
                messages: {
                    orderBy: {
                        createdAt: 'asc'
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Serialization
        return tickets.map((ticket: any) => ({
            ...ticket,
            createdAt: ticket.createdAt.toISOString(),
            updatedAt: ticket.updatedAt.toISOString(),
            messages: ticket.messages.map((msg: any) => ({
                ...msg,
                createdAt: msg.createdAt.toISOString()
            }))
        }));
    } catch (error) {
        console.error('Error fetching all tickets:', error);
        return [];
    }
}

export async function replyToTicket(ticketId: string, text: string) {
    try {
        if (!await isAdmin()) {
            return { success: false, error: 'Unauthorized' };
        }

        const message = await prisma.message.create({
            data: {
                ticketId,
                text,
                sender: 'ADMIN'
            }
        });

        // Update ticket status to ANSWERED
        await prisma.ticket.update({
            where: { id: ticketId },
            data: { status: 'ANSWERED' }
        });

        revalidatePath('/ask');
        revalidatePath('/admin/tickets');

        return {
            success: true,
            message: {
                ...message,
                createdAt: message.createdAt.toISOString()
            }
        };
    } catch (error) {
        console.error('Error replying to ticket:', error);
        return { success: false, error: 'Failed to send reply' };
    }
}

export async function closeTicket(ticketId: string) {
    try {
        const clerkUser = await currentUser();
        const userEmail = clerkUser?.emailAddresses[0]?.emailAddress;

        if (!userEmail) {
            return { success: false, error: 'Unauthorized' };
        }

        const admin = await isAdmin();

        // If not admin, check if they own the ticket
        if (!admin) {
            const ticket = await prisma.ticket.findUnique({
                where: { id: ticketId },
                include: { user: true }
            });

            if (!ticket || ticket.user.email !== userEmail) {
                return { success: false, error: 'Unauthorized' };
            }
        }

        await prisma.ticket.update({
            where: { id: ticketId },
            data: { status: 'CLOSED' }
        });

        revalidatePath('/ask');
        revalidatePath('/admin/tickets');

        return { success: true };
    } catch (error) {
        console.error('Error closing ticket:', error);
        return { success: false, error: 'Failed to close ticket' };
    }
}
