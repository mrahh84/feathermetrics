'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Lightbulb } from 'lucide-react';
import type { FlockData } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export function AIInsights({ flockData }: { flockData: FlockData }) {
  const [insights, setInsights] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchInsights() {
      setLoading(true);
      try {
        const response = await fetch('/api/insights', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ flockData }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch insights from the server.');
        }

        const data = await response.json();
        setInsights(data.result);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        toast({
          variant: "destructive",
          title: "AI Insight Error",
          description: errorMessage,
        })
        setInsights("Could not load AI insights. Please check the console or try again later.");
      } finally {
        setLoading(false);
      }
    }

    if(flockData) {
        fetchInsights();
    }
  }, [flockData, toast]);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">AI-Powered Insights</CardTitle>
        <Lightbulb className="h-5 w-5 text-yellow-500" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : (
          <p className="text-base text-foreground/90">{insights}</p>
        )}
      </CardContent>
    </Card>
  );
}
