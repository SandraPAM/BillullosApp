
"use client";

import type { SavingsRecord } from "@/types";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ListCollapse, MoreVertical, Paperclip } from "lucide-react";
import { EditIncomeForm } from "./edit-income-form";
import { DeleteIncomeButton } from "./delete-income-button";

export function IncomeList({ records }: { records: SavingsRecord[] }) {
  const sortedRecords = records
    .filter(record => record.date)
    .sort((a, b) => b.date.toDate().getTime() - a.date.toDate().getTime());

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
            <ListCollapse className="h-6 w-6 text-primary"/>
            <CardTitle>Income History</CardTitle>
        </div>
        <CardDescription>
          A list of all contributions to this savings goal.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {sortedRecords.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead className="w-[50px] text-center">Proof</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Date</TableHead>
                <TableHead className="w-[50px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.description}</TableCell>
                  <TableCell className="text-center">
                    {record.screenshotUrl ? (
                       <Dialog>
                        <DialogTrigger asChild>
                           <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Paperclip className="h-4 w-4" />
                              <span className="sr-only">View Screenshot</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Screenshot for {record.description}</DialogTitle>
                          </DialogHeader>
                          <div className="relative mt-4 h-96 w-full">
                            <Image src={record.screenshotUrl} alt={`Screenshot for ${record.description}`} layout="fill" objectFit="contain" />
                          </div>
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-mono text-primary">+${record.amount.toFixed(2)}</TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {record.date ? format(record.date.toDate(), "MMM d, yyyy") : "Processing..."}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">More actions</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <EditIncomeForm record={record} />
                            <DeleteIncomeButton record={record} />
                        </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center text-muted-foreground py-10">
            <p>No income logged for this goal yet.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
