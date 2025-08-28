import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { analyzeJournalEntry } from '@/lib/openai'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the journal entry
    const entry = await prisma.journalEntry.findFirst({
      where: {
        id: id,
        userId: session.user.id,
      },
    })

    if (!entry) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 })
    }

    // Get user profile for context
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true, targetGoals: true },
    })

    // Analyze the entry with OpenAI
    const analysis = await analyzeJournalEntry(
      entry.content,
      user?.role || undefined,
      user?.targetGoals || undefined
    )

    // Save achievements to database
    const achievements = await Promise.all(
      analysis.achievements.map(achievement =>
        prisma.achievement.create({
          data: {
            userId: session.user.id,
            journalEntryId: id,
            title: achievement.title,
            description: achievement.description,
            starFormat: achievement.starFormat,
            skills: achievement.skills,
            quantifiableMetrics: achievement.quantifiableMetrics,
            impact: achievement.impact,
          },
        })
      )
    )

    // Mark entry as processed
    await prisma.journalEntry.update({
      where: { id: id },
      data: { processed: true },
    })

    return NextResponse.json({
      achievements,
      insights: analysis.insights,
    })
  } catch (error) {
    console.error('Error analyzing journal entry:', error)
    return NextResponse.json(
      { error: 'Failed to analyze entry. Please check your OpenAI API configuration.' },
      { status: 500 }
    )
  }
}