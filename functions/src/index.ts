// Import the Firebase SDK for Google Cloud Functions.
const functions = require("firebase-functions");
// Import and initialize the Firebase Admin SDK.
const admin = require("firebase-admin");
admin.initializeApp();

/**
 * A function that triggers when a budget document is updated.
 * It checks if the budget limit has been reached or surpassed and logs a notification.
 */
exports.onBudgetUpdate = functions.firestore
  .document("budgets/{budgetId}")
  .onUpdate((change) => {
    // Get the data from before and after the change.
    const before = change.before.data();
    const after = change.after.data();

    // We only want to send a notification when the user *crosses* the threshold.
    // This prevents sending notifications for every subsequent expense.
    const wasBelowLimit = before.spentAmount < before.amount;
    const isOverLimit = after.spentAmount >= after.amount;

    if (wasBelowLimit && isOverLimit) {
      functions.logger.log(`User ${after.userId} has reached the limit for budget "${after.name}".`);
      functions.logger.log(`Spent: ${after.spentAmount}, Budget: ${after.amount}.`);
      functions.logger.log("This is where a real notification would be sent.");

      // Here you would add your code to send a push notification, email, etc.
      // For example, using Firebase Cloud Messaging (FCM).
      // This part is a placeholder for the actual notification logic.
      return null;
    }

    return null; // Return null to indicate successful execution without further action.
  });

/**
 * A function that triggers when a savings goal document is updated.
 * It checks if the goal has been met and logs a notification.
 */
exports.onSavingsGoalUpdate = functions.firestore
  .document("savingsGoals/{goalId}")
  .onUpdate((change) => {
    // Get the data from before and after the change.
    const before = change.before.data();
    const after = change.after.data();

    // We only want to send a notification when the user *crosses* the goal amount.
    const wasBelowGoal = before.currentAmount < before.targetAmount;
    const isAtOrOverGoal = after.currentAmount >= after.targetAmount;

    if (wasBelowGoal && isAtOrOverGoal) {
      functions.logger.log(`Congratulations! User ${after.userId} has reached the savings goal "${after.name}".`);
      functions.logger.log(`Saved: ${after.currentAmount}, Target: ${after.targetAmount}.`);
      functions.logger.log("This is where a real notification would be sent.");

      // Placeholder for actual notification logic (e.g., using FCM).
      return null;
    }

    return null;
  });
