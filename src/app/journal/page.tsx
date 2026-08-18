"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { JournalEntryTable } from "@/components/accounting/JournalEntryTable";
import { JournalTemplateTable } from "@/components/accounting/JournalTemplateTable";

export default function JournalPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <Tabs defaultValue="entries">
        <TabsList>
          <TabsTrigger value="entries">Daftar Jurnal</TabsTrigger>
          <TabsTrigger value="templates">Template Jurnal</TabsTrigger>
        </TabsList>

        <TabsContent value="entries" className="pt-4">
          <JournalEntryTable />
        </TabsContent>
        <TabsContent value="templates" className="pt-4">
          <JournalTemplateTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
