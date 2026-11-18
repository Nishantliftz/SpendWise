-- ============================================================
-- SpendWise Database Schema
-- Database: spendwise_db
-- ============================================================

CREATE DATABASE IF NOT EXISTS spendwise_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE spendwise_db;

-- ============================================================
-- TABLE: users
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id              BIGINT          NOT NULL AUTO_INCREMENT,
    full_name       VARCHAR(100)    NOT NULL,
    email           VARCHAR(150)    NOT NULL,
    password        VARCHAR(255)    NOT NULL,
    profile_picture VARCHAR(255)    DEFAULT NULL,
    phone           VARCHAR(20)     DEFAULT NULL,
    currency        VARCHAR(10)     NOT NULL DEFAULT 'USD',
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: income
-- Categories: Salary, Freelancing, Business, Investments, Gifts, Other
-- ============================================================
CREATE TABLE IF NOT EXISTS income (
    id               BIGINT          NOT NULL AUTO_INCREMENT,
    user_id          BIGINT          NOT NULL,
    amount           DECIMAL(15,2)   NOT NULL,
    category         VARCHAR(50)     NOT NULL,
    description      VARCHAR(255)    DEFAULT NULL,
    payment_method   VARCHAR(50)     DEFAULT NULL,
    transaction_date DATE            NOT NULL,
    created_at       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_income_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_income_amount CHECK (amount > 0),
    CONSTRAINT chk_income_category CHECK (category IN ('Salary','Freelancing','Business','Investments','Gifts','Other'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_income_user_id         ON income(user_id);
CREATE INDEX idx_income_transaction_date ON income(transaction_date);
CREATE INDEX idx_income_category        ON income(category);

-- ============================================================
-- TABLE: expenses
-- Categories: Food, Transportation, Shopping, Entertainment,
--             Education, Healthcare, Rent, Bills & Utilities,
--             Travel, Groceries, Other
-- ============================================================
CREATE TABLE IF NOT EXISTS expenses (
    id               BIGINT          NOT NULL AUTO_INCREMENT,
    user_id          BIGINT          NOT NULL,
    amount           DECIMAL(15,2)   NOT NULL,
    category         VARCHAR(50)     NOT NULL,
    description      VARCHAR(255)    DEFAULT NULL,
    payment_method   VARCHAR(50)     DEFAULT NULL,
    transaction_date DATE            NOT NULL,
    notes            TEXT            DEFAULT NULL,
    created_at       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_expenses_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_expenses_amount CHECK (amount > 0),
    CONSTRAINT chk_expenses_category CHECK (category IN ('Food','Transportation','Shopping','Entertainment','Education','Healthcare','Rent','Bills & Utilities','Travel','Groceries','Other'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_expenses_user_id          ON expenses(user_id);
CREATE INDEX idx_expenses_transaction_date ON expenses(transaction_date);
CREATE INDEX idx_expenses_category         ON expenses(category);

-- ============================================================
-- TABLE: budgets
-- ============================================================
CREATE TABLE IF NOT EXISTS budgets (
    id            BIGINT          NOT NULL AUTO_INCREMENT,
    user_id       BIGINT          NOT NULL,
    category      VARCHAR(50)     NOT NULL,
    monthly_limit DECIMAL(15,2)   NOT NULL,
    month         INT             NOT NULL,
    year          INT             NOT NULL,
    created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_budgets_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_budgets_monthly_limit CHECK (monthly_limit > 0),
    CONSTRAINT chk_budgets_month CHECK (month BETWEEN 1 AND 12),
    CONSTRAINT chk_budgets_year  CHECK (year  BETWEEN 2000 AND 2100),
    UNIQUE KEY uq_budget (user_id, category, month, year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_budgets_user_id ON budgets(user_id);

-- ============================================================
-- TABLE: savings_goals
-- ============================================================
CREATE TABLE IF NOT EXISTS savings_goals (
    id             BIGINT          NOT NULL AUTO_INCREMENT,
    user_id        BIGINT          NOT NULL,
    goal_name      VARCHAR(100)    NOT NULL,
    target_amount  DECIMAL(15,2)   NOT NULL,
    current_amount DECIMAL(15,2)   NOT NULL DEFAULT 0.00,
    target_date    DATE            DEFAULT NULL,
    description    VARCHAR(255)    DEFAULT NULL,
    created_at     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_savings_goals_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_savings_target_amount  CHECK (target_amount  > 0),
    CONSTRAINT chk_savings_current_amount CHECK (current_amount >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_savings_goals_user_id ON savings_goals(user_id);

-- ============================================================
-- TABLE: savings_contributions
-- ============================================================
CREATE TABLE IF NOT EXISTS savings_contributions (
    id                BIGINT          NOT NULL AUTO_INCREMENT,
    goal_id           BIGINT          NOT NULL,
    amount            DECIMAL(15,2)   NOT NULL,
    contribution_date DATE            NOT NULL,
    description       VARCHAR(255)    DEFAULT NULL,
    created_at        TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_savings_contributions_goal FOREIGN KEY (goal_id) REFERENCES savings_goals(id) ON DELETE CASCADE,
    CONSTRAINT chk_contributions_amount CHECK (amount > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_savings_contributions_goal_id ON savings_contributions(goal_id);

-- ============================================================
-- TABLE: recurring_transactions
-- ============================================================
CREATE TABLE IF NOT EXISTS recurring_transactions (
    id               BIGINT          NOT NULL AUTO_INCREMENT,
    user_id          BIGINT          NOT NULL,
    transaction_type ENUM('income','expense') NOT NULL,
    amount           DECIMAL(15,2)   NOT NULL,
    category         VARCHAR(50)     NOT NULL,
    description      VARCHAR(255)    DEFAULT NULL,
    payment_method   VARCHAR(50)     DEFAULT NULL,
    frequency        ENUM('daily','weekly','monthly','yearly') NOT NULL,
    next_due_date    DATE            NOT NULL,
    active           BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_recurring_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_recurring_amount CHECK (amount > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_recurring_user_id ON recurring_transactions(user_id);

-- ============================================================
-- TABLE: notifications
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
    id                BIGINT          NOT NULL AUTO_INCREMENT,
    user_id           BIGINT          NOT NULL,
    message           VARCHAR(500)    NOT NULL,
    notification_type VARCHAR(50)     NOT NULL,
    is_read           BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at        TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
