'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { currentUser } from '@clerk/nextjs/server';
import { isAdmin } from '@/lib/auth';

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
        return { success: false, error: 'Could not submit your inquiry. Please try again later.' };
    }
}

export async function getAllTickets(page: number = 1, pageSize: number = 20, status?: 'OPEN' | 'ANSWERED' | 'CLOSED' | 'ALL') {
    try {
        if (!await isAdmin()) {
            throw new Error('Unauthorized');
        }

        const skip = (page - 1) * pageSize;
        const where = status && status !== 'ALL' ? { status } : {};

        const [tickets, total] = await Promise.all([
            prisma.ticket.findMany({
                where,
                skip,
                take: pageSize,
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
            }),
            prisma.ticket.count({ where })
        ]);

        // Serialization
        const serializedTickets = tickets.map((ticket: any) => ({
            ...ticket,
            createdAt: ticket.createdAt.toISOString(),
            updatedAt: ticket.updatedAt.toISOString(),
            messages: ticket.messages.map((msg: any) => ({
                ...msg,
                createdAt: msg.createdAt.toISOString()
            }))
        }));

        return {
            tickets: serializedTickets,
            total,
            hasMore: total > skip + tickets.length
        };
    } catch (error) {
        console.error('Error fetching all tickets:', error);
        return { tickets: [], total: 0, hasMore: false };
    }
}

export async function getTicketStats() {
    try {
        if (!await isAdmin()) return { OPEN: 0, ANSWERED: 0, CLOSED: 0 };

        const [open, answered, closed] = await Promise.all([
            prisma.ticket.count({ where: { status: 'OPEN' } }),
            prisma.ticket.count({ where: { status: 'ANSWERED' } }),
            prisma.ticket.count({ where: { status: 'CLOSED' } })
        ]);

        return { OPEN: open, ANSWERED: answered, CLOSED: closed };
    } catch (error) {
        console.error('Error fetching ticket stats:', error);
        return { OPEN: 0, ANSWERED: 0, CLOSED: 0 };
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

export async function userReplyToTicket(ticketId: string, text: string) {
    try {
        const clerkUser = await currentUser();
        const userEmail = clerkUser?.emailAddresses[0]?.emailAddress;

        if (!userEmail) {
            return { success: false, error: 'Unauthorized' };
        }

        // Verify ownership
        const ticket = await prisma.ticket.findUnique({
            where: { id: ticketId },
            include: { user: true }
        });

        if (!ticket || ticket.user.email !== userEmail) {
            return { success: false, error: 'Unauthorized' };
        }

        if (ticket.status === 'CLOSED') {
            return { success: false, error: 'Cannot reply to a closed inquiry' };
        }

        const message = await prisma.message.create({
            data: {
                ticketId,
                text,
                sender: 'USER'
            }
        });

        // Set status back to OPEN so admin knows there is a follow-up
        await prisma.ticket.update({
            where: { id: ticketId },
            data: { status: 'OPEN' }
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
        console.error('Error posting follow-up:', error);
        return { success: false, error: 'Failed to send follow-up' };
    }
}

export async function updateTicketReadStatus(ticketId: string, messageId: string) {
    try {
        const clerkUser = await currentUser();
        const userEmail = clerkUser?.emailAddresses[0]?.emailAddress;

        if (!userEmail) {
            return { success: false, error: 'Unauthorized' };
        }

        // Verify ownership
        const ticket = await prisma.ticket.findUnique({
            where: { id: ticketId },
            include: { user: true }
        });

        if (!ticket || ticket.user.email !== userEmail) {
            return { success: false, error: 'Unauthorized' };
        }

        await prisma.ticket.update({
            where: { id: ticketId },
            data: { lastReadMessageId: messageId }
        });

        return { success: true };
    } catch (error) {
        console.error('Error updating read status:', error);
        return { success: false, error: 'Failed to update' };
    }
}

export async function archiveTicket(ticketId: string) {
    try {
        const clerkUser = await currentUser();
        const userEmail = clerkUser?.emailAddresses[0]?.emailAddress;

        if (!userEmail) {
            return { success: false, error: 'Unauthorized' };
        }

        // Verify ownership
        const ticket = await prisma.ticket.findUnique({
            where: { id: ticketId },
            include: { user: true }
        });

        if (!ticket || ticket.user.email !== userEmail) {
            return { success: false, error: 'Unauthorized' };
        }

        await prisma.ticket.update({
            where: { id: ticketId },
            data: { isArchived: true }
        });

        revalidatePath('/ask');
        return { success: true };
    } catch (error) {
        console.error('Error archiving ticket:', error);
        return { success: false, error: 'Failed to archive' };
    }
}
export async function getOpenTicketsCount() {
    try {
        if (!await isAdmin()) return 0;
        return await prisma.ticket.count({
            where: { status: 'OPEN' }
        });
    } catch (error) {
        return 0;
    }
}
