"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DateRangeFilter } from "@/components/keuangan/DateRangeFilter";
import { IncomeStatementTable } from "@/components/keuangan/IncomeStatementTable";
import { DailyPatientsChart } from "@/components/keuangan/DailyPatientsChart";
import { DailyRevenueChart } from "@/components/keuangan/DailyRevenueChart";
import { DailyEntriesTable } from "@/components/keuangan/DailyEntriesTable";
import { DailyEntryDialog } from "@/components/keuangan/DailyEntryDialog";
import { rangeForPreset, type RangePreset } from "@/lib/date";

export default function FinancePage() {
  const [preset, setPreset] = useState<RangePreset>("this-month");
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
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Daily Patients — Last 7 Days</CardTitle>
              </CardHeader>
              <CardContent>
                <DailyPatientsChart />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Daily Revenue — Last 7 Days</CardTitle>
              </CardHeader>
              <CardContent>
                <DailyRevenueChart />
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
