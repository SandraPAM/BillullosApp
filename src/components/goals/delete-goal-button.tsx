
"use client";

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { deleteSavingsGoal } from '@/lib/firebase/firestore';

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

interface DeleteGoalButtonProps {
  goalId: string;
  userId: string;
  onGoalDeleted: () => void;
  onDeletingChange: (isDeleting: boolean) => void;
}

export function DeleteGoalButton({ goalId, userId, onGoalDeleted, onDeletingChange }: DeleteGoalButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    setIsLoading(true);
    onDeletingChange(true);
    try {
      await deleteSavingsGoal(goalId, userId);
      toast({
        title: 'Savings Goal Deleted',
        description: 'The goal and all its records have been successfully deleted.',
      });
      onGoalDeleted();
    } catch (error) {
      console.error('Error deleting savings goal:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not delete the savings goal. Please try again.',
      });
      onDeletingChange(false);
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon">
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete Goal</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            savings goal and all of its associated income records.
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
