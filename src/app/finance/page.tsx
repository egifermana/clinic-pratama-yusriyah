"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DateRangeFilter } from "@/components/keuangan/DateRangeFilter";
import { ChartPeriodToggle } from "@/components/keuangan/ChartPeriodToggle";
import { IncomeStatementTable } from "@/components/keuangan/IncomeStatementTable";
import { DailyPatientsChart } from "@/components/keuangan/DailyPatientsChart";
import { DailyRevenueChart } from "@/components/keuangan/DailyRevenueChart";
import { DailyEntriesTable } from "@/components/keuangan/DailyEntriesTable";
import { DailyEntryDialog } from "@/components/keuangan/DailyEntryDialog";
import { rangeForPreset, CHART_PERIOD_LABELS, type ChartPeriod, type RangePreset } from "@/lib/date";

export default function FinancePage() {
  const [preset, setPreset] = useState<RangePreset>("this-month");
  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>("daily");
  const [addOpen, setAddOpen] = useState(false);
  const { start, end } = rangeForPreset(preset);

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <Tabs defaultValue="summary">
        <TabsList>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="transactions">Daily Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-foreground">
              Patients &amp; Revenue — {CHART_PERIOD_LABELS[chartPeriod]}
            </p>
            <ChartPeriodToggle period={chartPeriod} onChange={setChartPeriod} />
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Daily Patients</CardTitle>
              </CardHeader>
              <CardContent>
                <DailyPatientsChart period={chartPeriod} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Daily Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <DailyRevenueChart period={chartPeriod} />
              </CardContent>
            </Card>
          </div>
          <IncomeStatementTable />
        </TabsContent>

        <TabsContent value="transactions" className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <DateRangeFilter preset={preset} onChange={setPreset} />
            <Button size="sm" onClick={() => setAddOpen(true)}>
              Add Transaction
            </Button>
          </div>
          <DailyEntriesTable start={start} end={end} />
        </TabsContent>
      </Tabs>

      <DailyEntryDialog open={addOpen} onOpenChange={setAddOpen} />
    </div>
  );
}
