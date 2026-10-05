-- ====================================================================
-- AZHR HRMS — Database Schema & Initial Migration for Supabase
-- Target Modules: Employee Management & KPI Progress Management (M06)
-- ====================================================================

-- Enable UUID extension if not already available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ====================================================================
-- 1. EMPLOYEES TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_code VARCHAR(30) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    department VARCHAR(100) NOT NULL,
    designation VARCHAR(100) NOT NULL,
    joining_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for fast query and filtering
CREATE INDEX IF NOT EXISTS idx_employees_department ON employees(department);
CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(status);
CREATE INDEX IF NOT EXISTS idx_employees_code ON employees(employee_code);

-- ====================================================================
-- 2. KPI ENTRIES TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS kpi_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    month VARCHAR(7) NOT NULL, -- Format: YYYY-MM (e.g. '2026-06')
    
    -- Attendance Component (30%)
    working_days INT NOT NULL DEFAULT 26,
    present_days INT NOT NULL DEFAULT 0,
    late_arrivals INT NOT NULL DEFAULT 0,
    attendance_score NUMERIC(5,2) NOT NULL DEFAULT 0,
    
    -- Task Component (40%)
    tasks_assigned INT NOT NULL DEFAULT 0,
    tasks_completed INT NOT NULL DEFAULT 0,
    on_time_delivery NUMERIC(5,2) NOT NULL DEFAULT 0,
    task_score NUMERIC(5,2) NOT NULL DEFAULT 0,
    
    -- Behavior Component (20%)
    teamwork NUMERIC(4,2) NOT NULL DEFAULT 0,      -- 1 to 10
    discipline NUMERIC(4,2) NOT NULL DEFAULT 0,    -- 1 to 10
    communication NUMERIC(4,2) NOT NULL DEFAULT 0, -- 1 to 10
    behavior_score NUMERIC(5,2) NOT NULL DEFAULT 0,
    
    -- Kaizen / CI Component (10%)
    suggestions_submitted INT NOT NULL DEFAULT 0,
    suggestions_approved INT NOT NULL DEFAULT 0,
    suggestions_implemented INT NOT NULL DEFAULT 0,
    kaizen_score NUMERIC(5,2) NOT NULL DEFAULT 0,
    
    -- Overall Computed Score & Rating
    total_score NUMERIC(5,2) NOT NULL DEFAULT 0,
    rating VARCHAR(50) NOT NULL DEFAULT 'Normal',
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Unique constraint: An employee can only have 1 KPI record per month
    CONSTRAINT uq_employee_month UNIQUE (employee_id, month)
);

CREATE INDEX IF NOT EXISTS idx_kpi_employee ON kpi_entries(employee_id);
CREATE INDEX IF NOT EXISTS idx_kpi_month ON kpi_entries(month);
CREATE INDEX IF NOT EXISTS idx_kpi_total_score ON kpi_entries(total_score);

-- ====================================================================
-- 3. KPI SETTINGS TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS kpi_settings (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'default',
    attendance_weight NUMERIC(5,2) NOT NULL DEFAULT 30.00,
    task_weight NUMERIC(5,2) NOT NULL DEFAULT 40.00,
    behavior_weight NUMERIC(5,2) NOT NULL DEFAULT 20.00,
    kaizen_weight NUMERIC(5,2) NOT NULL DEFAULT 10.00,
    deduct_per_late NUMERIC(4,2) NOT NULL DEFAULT 0.50,
    max_late_deduction NUMERIC(5,2) NOT NULL DEFAULT 5.00,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert default settings row if missing
INSERT INTO kpi_settings (id, attendance_weight, task_weight, behavior_weight, kaizen_weight, deduct_per_late, max_late_deduction)
VALUES ('default', 30.00, 40.00, 20.00, 10.00, 0.50, 5.00)
ON CONFLICT (id) DO NOTHING;

-- ====================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_settings ENABLE ROW LEVEL SECURITY;

-- Allow public/anon read access for demo & development phase
-- (In production phase, tighten policies with Supabase Auth auth.uid())
CREATE POLICY "Allow public read access on employees"
    ON employees FOR SELECT USING (true);

CREATE POLICY "Allow public insert/update/delete on employees"
    ON employees FOR ALL USING (true);

CREATE POLICY "Allow public read access on kpi_entries"
    ON kpi_entries FOR SELECT USING (true);

CREATE POLICY "Allow public insert/update/delete on kpi_entries"
    ON kpi_entries FOR ALL USING (true);

CREATE POLICY "Allow public read access on kpi_settings"
    ON kpi_settings FOR SELECT USING (true);

CREATE POLICY "Allow public update on kpi_settings"
    ON kpi_settings FOR ALL USING (true);
