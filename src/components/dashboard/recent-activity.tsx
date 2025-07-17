import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ArrowDownLeft, ArrowUpRight, Activity } from "lucide-react"

const activities = [
  { type: "expense", description: "Groceries", amount: 75.6, date: "2 days ago" },
  { type: "saving", description: "Vacation Fund", amount: 200, date: "3 days ago" },
  { type: "expense", description: "Gas", amount: 45.1, date: "4 days ago" },
  { type: "expense", description: "Dinner Out", amount: 112.0, date: "5 days ago" },
  { type: "saving", description: "New Laptop", amount: 150, date: "1 week ago" },
];

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            <CardTitle className="font-headline">Recent Activity</CardTitle>
        </div>
        <CardDescription>Your latest transactions.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {activities.map((activity, index) => (
            <li key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${activity.type === 'expense' ? 'bg-destructive/10' : 'bg-primary/10'}`}>
                    {activity.type === 'expense' ? 
                        <ArrowDownLeft className="h-4 w-4 text-destructive" /> : 
                        <ArrowUpRight className="h-4 w-4 text-primary" />}
                </div>
                <div>
                  <p className="font-medium">{activity.description}</p>
                  <p className="text-sm text-muted-foreground">{activity.date}</p>
                </div>
              </div>
              <p className={`font-semibold ${activity.type === 'expense' ? 'text-destructive' : 'text-primary'}`}>
                {activity.type === 'expense' ? '-' : '+'}${activity.amount.toFixed(2)}
              </p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
