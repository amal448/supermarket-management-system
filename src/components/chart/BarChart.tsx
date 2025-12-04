"use client";
import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import type { ChartConfig } from "@/components/ui/chart";

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";


// ✅ Define type for your daily sales API response
type DailySale = {
    date: string;
    cash: number;
    card: number;
};

const chartConfig = {
    cash: {
        label: "Cash Payments",
        color: "var(--chart-1)",
    },
    card: {
        label: "Card Payments",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig;

export function ChartBar({ chartData, loading }: { chartData: any[]; loading: boolean }) {
 

    const [activeChart, setActiveChart] =
        React.useState<keyof typeof chartConfig>("cash");

    // ✅ Fix reduce typing issue
    const total = React.useMemo(() => {
        if (!chartData.length) return { cash: 0, card: 0 };

        return {
            cash: chartData.reduce(
                (acc: number, curr: DailySale) => acc + curr.cash,
                0
            ),
            card: chartData.reduce(
                (acc: number, curr: DailySale) => acc + curr.card,
                0
            ),
        };
    }, [chartData]);

    // 📌 Step 1: Generate full month dates
const getFullMonthDays = React.useCallback(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: DailySale[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day)
            .toISOString()
            .split("T")[0];

        days.push({
            date,
            cash: 0,
            card: 0,
        });
    }
    return days;
}, []);

// 📌 Step 2: Merge API data with empty days
const mergedData: DailySale[] = React.useMemo(() => {
    const monthDays = getFullMonthDays();

    const mapped = new Map(
        chartData.map((d) => [d.date, d])
    );

    return monthDays.map((day) => mapped.get(day.date) ?? day);
}, [chartData, getFullMonthDays]);

    // ⏳ Loading State
    if (loading) {
        return (
            <Card className="p-6">
                <p>Loading sales chart...</p>
            </Card>
        );
    }

    return (
        <Card className="py-0">
            <CardHeader className="flex flex-col items-stretch border-b p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:py-0">
                    <CardTitle>Monthly Sales Summary</CardTitle>
                    <CardDescription>
                        Current  Monthly transaction details
                    </CardDescription>
                </div>

                <div className="flex">
                    {["cash", "card"].map((key) => {
                        const chart = key as keyof typeof chartConfig;

                        return (
                            <button
                                key={chart}
                                data-active={activeChart === chart}
                                className="data-[active=true]:bg-muted/50 
                                    relative z-30 flex flex-1 flex-col justify-center 
                                    gap-1 border-t px-6 py-4 text-left even:border-l 
                                    sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                                onClick={() => setActiveChart(chart)}
                            >
                                <span className="text-muted-foreground text-xs">
                                    {chartConfig[chart].label}
                                </span>
                                <span className="text-lg leading-none font-bold sm:text-3xl">
                                    {total[chart].toLocaleString()}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </CardHeader>

            <CardContent className="px-2 sm:p-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <BarChart data={mergedData} margin={{ left: 12, right: 12 }}>
                        <CartesianGrid vertical={false} />

                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value);
                                return date.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                });
                            }}
                        />

                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    className="w-[150px]"
                                    nameKey={activeChart}
                                    labelFormatter={(value) =>
                                        new Date(value).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })
                                    }
                                />
                            }
                        />

                        <Bar
                            dataKey={activeChart}
                            fill={`var(--color-${activeChart})`}
                            barSize={20}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
