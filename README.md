# AZHR HRMS — M06 KPI & Progress Management + Employee Management

Production-ready React architecture converted from the AZHR HRMS HTML prototype (Takhleeq 2026), built with modern React 19, Vite, React Router, Chart.js, and Supabase.

---

## 🎯 Architecture & Highlights

- **Visual Identity Preserved 100%**: Retains the exact deep-blue HRMS theme, Syne, Inter, JetBrains Mono typography, custom badges, metric cards, radar and bar charts, and dark/light mode toggle.
- **Two Core Modules Implemented**:
  1. **KPI & Progress Management (M06)**: Complete dashboard, monthly entry, employee cards, radar & bar department comparisons, dynamic SWOT / YY analysis, custom weights, and quick modal entry.
  2. **Employee Management (M02)**: Employee directory, live search, department and status filters, full profile view, Add Employee, Edit Employee, and Activate/Deactivate/Delete workflows.
- **Future Roadmap Ready**: Sidebar visually displays future modules (Tasks, Attendance, Payroll, ATS, AI Agent, etc.) with a built-in roadmap dialog without restructuring the application.
- **Supabase Backend Integration**: Uses the official `@supabase/supabase-js` client with environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) and Row Level Security (RLS) policies. Includes an automated demo fallback layer preloaded with 105 demo employees.

---

## 📐 KPI Business Formulas

All business rules and formulas are isolated in testable utility modules (`src/features/kpi/utils/kpiCalculations.js`):

| Component | Standard Weight | Formula |
| :--- | :---: | :--- |
| **Attendance Score** | **30%** | `((Present Days / Working Days) * 100) - (Late Arrivals * 0.5)` *(penalty capped at 5%)* |
| **Task Score** | **40%** | `(Tasks Completed / Tasks Assigned) * On-Time Delivery %` |
| **Behavior Score** | **20%** | `((Teamwork + Discipline + Communication) / 30) * 100` *(rated 1-10)* |
| **Kaizen / CI Score** | **10%** | `(Approved Suggestions / Submitted Suggestions) * 100` |
| **Total Score** | **100%** | `(Att × W_att) + (Task × W_task) + (Behav × W_beh) + (Kaizen × W_kai)` |

### Performance Ratings
- **95% – 100%**: ⭐ Extra Ordinary
- **85% – 94%**: Excellent
- **70% – 84%**: Good
- **60% – 69%**: Normal
- **Below 60%**: Bad / Critical

---

## 🗂️ Project Structure

```
src/
├── app/
│   ├── App.jsx                     # Root application with providers
│   ├── routes.jsx                  # React Router route definitions
│   └── providers/
│       ├── ThemeProvider.jsx       # Dark/Light theme with localStorage persistence
│       └── ToastProvider.jsx       # Feedback toast notification system
├── components/
│   ├── ui/                         # Button, Card, Modal, Badge, ProgressBar, StatCard
│   ├── layout/                     # Sidebar, TopNavbar, PageHeader
│   ├── forms/                      # FormField, Input, Select
│   └── feedback/                   # LoadingSpinner, EmptyState, ComingSoonModal
├── constants/
│   ├── departments.js              # Operating units & designations
│   └── kpiConstants.js             # Default weights, rating tiers, policies
├── features/
│   ├── employees/
│   │   ├── components/             # EmployeeTable, EmployeeFilter
│   │   ├── hooks/                  # useEmployees
│   │   ├── pages/                  # EmployeeListPage, AddEmployeePage, EditEmployeePage, EmployeeDetailsPage
│   │   ├── services/               # employeeService.js (Supabase + Mock store)
│   │   └── utils/                  # employeeValidation.js
│   └── kpi/
│       ├── components/             # KpiLayout, KpiStatCards, KpiCharts, KpiTable, EmployeeKpiCard, QuickKpiModal
│       ├── hooks/                  # useKpiData, useKpiCalculator
│       ├── pages/                  # KpiDashboardPage, KpiEntryPage, EmployeeKpisPage, DeptPerformancePage, SwotAnalysisPage, FormulaWeightsPage
│       ├── services/               # kpiService.js (Supabase + Mock store)
│       └── utils/                  # kpiCalculations.js, kpiValidation.js, chartSetup.js
├── layouts/
│   ├── MainLayout.jsx              # Main shell
│   ├── Sidebar.jsx                 # AZHR navigation & build progress
│   └── TopNavbar.jsx               # Breadcrumbs, date, theme toggle, executive profile
├── lib/
│   ├── supabase.js                 # Official Supabase client & connection checks
│   └── mockData.js                 # 105 demo employees with localStorage persistence
├── styles/
│   └── index.css                   # Global styles, CSS variables, responsive rules
└── main.jsx
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Supabase (Optional)
Copy `.env.example` to `.env` and provide your project URL and public anon key:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key-here
```
> **Note**: If `.env` is omitted, the application will automatically run in **Demo Mode** with local persistence.

To create the required tables in Supabase, execute the SQL migration script located at:
`supabase/schema.sql`

### 3. Run Development Server
```bash
npm run dev
```

### 4. Run Automated Test Suite
```bash
node test-runner.js
```
Runs 24 automated unit tests verifying all KPI score calculations, late penalty capping, zero-division edge cases, and form validation rules.

### 5. Build for Production
```bash
npm run build
```
Creates an optimized production bundle with manual code-splitting.
