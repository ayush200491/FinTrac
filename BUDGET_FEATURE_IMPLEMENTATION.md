# Budget Limits with Alerts - Implementation Guide

## Overview
A comprehensive budget management system has been implemented for the ExpenseWise application, allowing users to set spending limits by category, receive real-time alerts, and track their budget status.

---

## Backend Implementation (Java/Spring Boot)

### 1. **Budget Entity Model**
**File:** `backend/src/main/java/com/example/backend/model/Budget.java`

**Features:**
- Unique constraint on (username, category, month, year) to prevent duplicate budgets
- Configurable alert threshold (default 80%)
- Transient calculated fields:
  - `currentSpent`: Total spent in the category for the month
  - `remaining`: Amount left in budget
  - `percentageUsed`: Percentage of budget consumed
- Helper methods:
  - `calculateMetrics()`: Computes spent amount and derived metrics
  - `isAlertTriggered()`: Returns true when spending reaches alert threshold
  - `isLimitExceeded()`: Returns true when budget is exceeded

**Fields:**
```java
- budget_id: Long (Primary Key)
- username: String (Required, Max 50 chars)
- category: String (Required, Max 50 chars)
- limitAmount: BigDecimal (Required, Positive)
- month: Integer (1-12, Required)
- year: Integer (Required)
- alertThreshold: Double (0-100, Default 80)
- currentSpent: BigDecimal (Calculated)
- remaining: BigDecimal (Calculated)
- percentageUsed: Double (Calculated)
```

### 2. **BudgetRepository**
**File:** `backend/src/main/java/com/example/backend/repository/BudgetRepository.java`

**Methods:**
```java
List<Budget> findByUsername(String username)
Optional<Budget> findByUsernameAndCategoryAndMonthAndYear(...)
List<Budget> findByUsernameAndMonthAndYear(...)
boolean existsByUsernameAndCategoryAndMonthAndYear(...)
```

### 3. **BudgetService**
**File:** `backend/src/main/java/com/example/backend/service/BudgetService.java`

**Key Methods:**
- `createOrUpdateBudget()`: Create or update a budget with validation
- `getBudgetById()`: Retrieve budget with metrics
- `getBudgetsByUsername()`: Get all budgets for a user
- `getBudgetsByUsernameForCurrentMonth()`: Get current month budgets
- `calculateSpentForCategory()`: Sum expenses for a category in a month
- `wouldExceedBudget()`: Check if adding an expense would exceed budget
- `getBudgetStatus()`: Get budget status with alert information

### 4. **BudgetController**
**File:** `backend/src/main/java/com/example/backend/controller/BudgetController.java`

**API Endpoints:**

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/budgets?username=X` | Get all budgets for user |
| GET | `/budgets/current-month?username=X` | Get current month budgets |
| GET | `/budgets/{id}` | Get specific budget |
| GET | `/budgets/category/{username}/{category}` | Get budget for category |
| POST | `/budgets` | Create new budget |
| PUT | `/budgets/{id}` | Update budget |
| DELETE | `/budgets/{id}` | Delete budget |
| GET | `/budgets/{id}/status` | Get budget status with alerts |
| POST | `/budgets/check-budget-limit` | Check if expense exceeds budget |

---

## Frontend Implementation (React)

### 1. **BudgetService.js**
**File:** `frontend/src/components/service/BudgetService.js`

API wrapper methods:
- `getAllBudgets(username)`
- `getBudgetsForCurrentMonth(username)`
- `getBudgetById(id)`
- `getBudgetForCategory(username, category, month, year)`
- `createBudget(budgetData)`
- `updateBudget(id, budgetData)`
- `deleteBudget(id)`
- `getBudgetStatus(id)`
- `checkBudgetLimit(username, category, expenseAmount, month, year)`

### 2. **BudgetCard.jsx**
**File:** `frontend/src/components/budget/BudgetCard.jsx`

**Features:**
- Visual budget progress bar with color coding:
  - Green: Under 80%
  - Yellow: 80-100%
  - Red: Over 100%
- Displays: Category, Limit, Spent, Remaining, Percentage Used
- Status badge showing budget status
- Alert messages for exceeded/warning states
- Edit and Delete buttons
- Responsive design

**Props:**
```javascript
{
  budget: BudgetObject,
  onEdit: (budget) => {},
  onDelete: (budgetId) => {}
}
```

### 3. **BudgetForm.jsx**
**File:** `frontend/src/components/budget/BudgetForm.jsx`

**Features:**
- Add/Edit budget with form validation
- Category selection from predefined list
- Customizable alert threshold (0-100%)
- Month and year selection
- Form validation with error messages
- Loading state during submission
- Toast notifications for success/error

**Props:**
```javascript
{
  isOpen: Boolean,
  onClose: () => {},
  onSubmit: () => {},
  editingBudget: BudgetObject (optional)
}
```

### 4. **BudgetList.jsx**
**File:** `frontend/src/components/budget/BudgetList.jsx`

**Features:**
- Display all budgets in responsive grid
- Filter views: "This Month" and "All Budgets"
- Summary statistics: Total Budget, Total Spent, Remaining, Alert Count
- Empty state with call-to-action
- Add, Edit, Delete operations
- Real-time updates

### 5. **ExpenseForm.jsx Integration**
**File:** `frontend/src/components/expenses/ExpenseForm.jsx`

**Budget Alert Features:**
- Checks budget limit before expense submission
- Shows warning if expense would exceed budget
- Allows user to continue despite warning
- Non-blocking alert (doesn't prevent submission)
- Budget check happens asynchronously

**New Code:**
```javascript
// Budget warning check
const budgetCheck = await BudgetService.checkBudgetLimit(
  loggedInUser || user?.username,
  category,
  parsedAmount
);

if (budgetCheck.wouldExceedBudget) {
  setBudgetWarning(`⚠️ Warning: This expense would exceed your budget for ${category}`);
}
```

### 6. **Routing & Navigation**
**App.js updates:**
- Added BudgetList import
- Added route: `<Route path="/budgets" element={<BudgetList />} />`

**MainNav.jsx updates:**
- Added calculator icon for budgets
- Added navigation link to `/budgets`

---

## User Workflow

### 1. **Creating a Budget**
1. Navigate to Budgets page via sidebar
2. Click "Add Budget" button
3. Select category (e.g., "Food & Dining")
4. Enter budget limit (e.g., $500)
5. Set alert threshold (default 80%)
6. Submit - Budget is created for current month

### 2. **Monitoring Budget Status**
1. View all budgets in grid format
2. See real-time spending progress:
   - Spent amount
   - Budget limit
   - Remaining balance
   - Percentage used
3. Visual indicators:
   - Color-coded progress bars
   - Status badges (Within Budget, Alert, Exceeded)
   - Alert messages

### 3. **Creating Expenses with Budget Checks**
1. Add new expense via dashboard
2. Select category (e.g., "Food & Dining")
3. Enter amount
4. System checks if expense exceeds budget
5. If yes, shows warning but allows submission
6. Balance is debited from user account

### 4. **Managing Budgets**  
1. Edit existing budget (change limit or threshold)
2. Delete budget when no longer needed
3. Filter between current month and all budgets
4. View summary statistics

---

## Database Schema

```sql
CREATE TABLE budgets (
    budget_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    limit_amount DECIMAL(19,2) NOT NULL,
    month INT NOT NULL,
    year INT NOT NULL,
    alert_threshold DOUBLE DEFAULT 80.0,
    created_at TIMESTAMP,
    created_by VARCHAR(255),
    updated_at TIMESTAMP,
    last_modified_by VARCHAR(255),
    UNIQUE KEY uk_budget (username, category, month, year)
);
```

---

## API Request Examples

### Create Budget
```bash
POST /budgets
Content-Type: application/json

{
  "username": "john_doe",
  "category": "Food & Dining",
  "limitAmount": 500.00,
  "month": 4,
  "year": 2026,
  "alertThreshold": 80.0
}
```

### Check Budget Limit
```bash
POST /budgets/check-budget-limit?username=john_doe&category=Food%20&%20Dining&expenseAmount=50.00
```

### Get Budget Status
```bash
GET /budgets/1/status
```

Response:
```json
{
  "budgetId": 1,
  "spent": 250.00,
  "limit": 500.00,
  "remaining": 250.00,
  "percentageUsed": 50.0,
  "alertTriggered": false,
  "limitExceeded": false,
  "alertThreshold": 80.0
}
```

---

## Features & Capabilities

✅ **Multi-User Support**: Each user has independent budgets

✅ **Category-Based Budgets**: Set limits per expense category

✅ **Monthly Budgets**: Separate budgets for each month

✅ **Real-Time Tracking**: Spent amount calculated from actual expenses

✅ **Smart Alerts**: Customizable alert threshold for warnings

✅ **Visual Indicators**: Color-coded progress bars and status badges

✅ **Expense Validation**: Check budget before adding expense

✅ **CRUD Operations**: Full budget management capabilities

✅ **Summary Statistics**: Total budget, spent, and remaining overview

✅ **Responsive Design**: Works on desktop and mobile devices

---

## Testing Checklist

- [x] Backend compilation: No errors
- [x] Frontend compilation: No errors
- [x] Docker build: Successful
- [x] Service health checks: All running (UP)
- [x] Database integration: Connected
- [x] API endpoints: Accessible
- [x] UI components: Rendering correctly
- [x] Budget creation: Working
- [x] Budget update: Working
- [x] Budget deletion: Working
- [x] Budget status display: Working
- [x] Expense alert integration: Working
- [x] Navigation links: Functional

---

## Performance Considerations

1. **Expense Calculation**: Spent amount calculated via SQL query in BudgetService
2. **Caching**: Consider caching expense totals for large datasets
3. **Pagination**: May need to paginate budgets for users with many budgets
4. **Real-Time Updates**: Budget refresh on expense creation via event dispatch

---

## Future Enhancements

1. **Recurring Budget Rules**: Auto-create budgets for recurring months
2. **Budget Reports**: PDF/CSV export of budget summaries
3. **Spending Notifications**: Email/SMS alerts on budget warnings
4. **Budget Templates**: Pre-defined budget categories and limits
5. **Budget Rollover**: Carry unused budget to next month
6. **Budget Analytics**: Historical trends and insights
7. **Shared Budgets**: Multi-user budget sharing for families
8. **Budget Goals**: Set savings goals and track progress

---

## File Structure

```
Backend:
- model/Budget.java
- repository/BudgetRepository.java
- service/BudgetService.java
- controller/BudgetController.java

Frontend:
- service/BudgetService.js
- budget/BudgetCard.jsx
- budget/BudgetForm.jsx
- budget/BudgetList.jsx
- expenses/ExpenseForm.jsx (MODIFIED)
- ui/MainNav.jsx (MODIFIED)
- App.js (MODIFIED)
```

---

## Deployment

The feature is fully deployed and tested:
- Docker build: ✓ Complete
- Frontend: ✓ Running on port 9000
- Backend: ✓ Running on port 8080
- Database: ✓ MySQL 8.0 on port 3307

Access the application at: `http://localhost:9000`

---

## Support & Documentation

For issues or questions:
1. Check browser console for client-side errors
2. Check Docker logs: `docker compose logs backend`
3. Review API responses for error details
4. Verify database connectivity

---

**Implementation Date:** April 3, 2026
**Status:** ✅ Production Ready
