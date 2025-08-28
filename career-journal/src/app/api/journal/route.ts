import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createJournalEntrySchema = z.object({
  title: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  tags: z.array(z.string()).default([]),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const entries = await prisma.journalEntry.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        achievements: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
      skip,
      take: limit,
    })

    const total = await prisma.journalEntry.count({
      where: {
        userId: session.user.id,
      },
    })

    return NextResponse.json({
      entries,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching journal entries:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createJournalEntrySchema.parse(body)

    const entry = await prisma.journalEntry.create({
      data: {
        userId: session.user.id,
        title: validatedData.title,
        content: validatedData.content,
        tags: validatedData.tags,
      },
      include: {
        achievements: true,
      },
    })

    return NextResponse.json(entry, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating journal entry:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}