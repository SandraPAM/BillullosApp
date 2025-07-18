
"use client";

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { deleteBudget } from '@/lib/firebase/firestore';

import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Loader2, Trash2 } from 'lucide-react';

interface DeleteBudgetButtonProps {
  budgetId: string;
  onBudgetDeleted: () => void;
  onDeleting: () => void;
}

export function DeleteBudgetButton({ budgetId, onBudgetDeleted, onDeleting }: DeleteBudgetButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    setIsLoading(true);
    onDeleting(); // Notify parent component that deletion process has started
    try {
      await deleteBudget(budgetId);
      toast({
        title: 'Budget Deleted',
        description: 'The budget and all its expenses have been successfully deleted.',
      });
      onBudgetDeleted();
    } catch (error) {
      console.error('Error deleting budget:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not delete the budget. Please try again.',
      });
       // In case of error, we might need to reset the parent's deleting state.
       // For now, the router push on success is the primary goal.
    } finally {
      // Don't set isLoading to false, as the component will unmount
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon">
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete Budget</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            budget and all of its associated expenses.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Yes, delete it'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
