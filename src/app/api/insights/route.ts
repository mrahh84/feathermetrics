import { NextRequest, NextResponse } from 'next/server';
import { getInsight } from '@/ai/flows/insightFlow';

export async function POST(req: NextRequest) {
  try {
    const { flockData } = await req.json();

    if (!flockData) {
      return NextResponse.json(
        { error: 'Missing flock data' },
        { status: 400 }
      );
    }

    const result = await getInsight(flockData);
    return NextResponse.json({ result });
  } catch (error: any) {
    console.error('AI Insight API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate insights' },
      { status: 500 }
    );
  }
}
