-- ============================================================
-- SpendWise Sample Data
-- Run AFTER schema.sql
-- ============================================================

USE spendwise_db;

-- ============================================================
-- USERS
-- NOTE: Demo users are auto-created by DataInitializer.java on backend startup
-- with correctly BCrypt-hashed passwords. No need to insert users manually.
-- Login: john@example.com / password123   OR   jane@example.com / password123
-- ============================================================
INSERT IGNORE INTO users (full_name, email, password, phone, currency) VALUES
('John Doe',   'john@example.com', '$2a$10$slDiNHCnGM5b3oIFTewSAeN6aFn9Y3u9NMKqjM4f/WCJRvFmX01Yq', '+1-555-0101', 'USD'),
('Jane Smith', 'jane@example.com', '$2a$10$slDiNHCnGM5b3oIFTewSAeN6aFn9Y3u9NMKqjM4f/WCJRvFmX01Yq', '+1-555-0202', 'USD');

-- ============================================================
-- INCOME – User 1 (John Doe), May–November 2026
-- Monthly salary $5,000 + variable freelancing
-- ============================================================
INSERT INTO income (user_id, amount, category, description, payment_method, transaction_date) VALUES
-- May 2026
(1, 5000.00, 'Salary',      'Monthly salary – May',           'Bank Transfer', '2026-05-01'),
(1,  850.00, 'Freelancing', 'Web design project – Client A',  'Bank Transfer', '2026-05-10'),
(1,  200.00, 'Investments', 'Dividend payout – May',          'Bank Transfer', '2026-05-15'),
-- June 2026
(1, 5000.00, 'Salary',      'Monthly salary – June',          'Bank Transfer', '2026-06-01'),
(1, 1200.00, 'Freelancing', 'Mobile app consulting',          'Bank Transfer', '2026-06-12'),
(1,  350.00, 'Freelancing', 'Logo & branding – Client B',     'Bank Transfer', '2026-06-25'),
-- July 2026
(1, 5000.00, 'Salary',      'Monthly salary – July',          'Bank Transfer', '2026-07-01'),
(1,  600.00, 'Freelancing', 'SEO audit – Client C',           'PayPal',        '2026-07-08'),
(1,  150.00, 'Gifts',       'Birthday gift from family',      'Cash',          '2026-07-20'),
(1,  200.00, 'Investments', 'Dividend payout – July',         'Bank Transfer', '2026-07-15'),
-- August 2026
(1, 5000.00, 'Salary',      'Monthly salary – August',        'Bank Transfer', '2026-08-01'),
(1, 1500.00, 'Freelancing', 'Full-stack project – Client D',  'Bank Transfer', '2026-08-05'),
(1,  400.00, 'Freelancing', 'API integration – Client E',     'Bank Transfer', '2026-08-20'),
-- September 2026
(1, 5000.00, 'Salary',      'Monthly salary – September',     'Bank Transfer', '2026-09-01'),
(1,  750.00, 'Freelancing', 'Dashboard UI – Client F',        'Bank Transfer', '2026-09-14'),
(1,  225.00, 'Investments', 'Dividend payout – September',    'Bank Transfer', '2026-09-15'),
-- October 2026
(1, 5000.00, 'Salary',      'Monthly salary – October',       'Bank Transfer', '2026-10-01'),
(1, 1100.00, 'Freelancing', 'E-commerce theme – Client G',    'Bank Transfer', '2026-10-09'),
(1,  300.00, 'Business',    'Side-project subscription revenue','Stripe',       '2026-10-22'),
-- November 2026 (partial month)
(1, 5000.00, 'Salary',      'Monthly salary – November',      'Bank Transfer', '2026-11-01'),
(1,  950.00, 'Freelancing', 'CMS customisation – Client H',   'Bank Transfer', '2026-11-10');

-- ============================================================
-- EXPENSES – User 1 (John Doe), May–November 2026
-- ============================================================
INSERT INTO expenses (user_id, amount, category, description, payment_method, transaction_date, notes) VALUES
-- ---- May 2026 ----
(1, 1500.00, 'Rent',             'Monthly rent – May',                   'Bank Transfer', '2026-05-01', NULL),
(1,  420.00, 'Groceries',        'Weekly grocery run',                   'Debit Card',    '2026-05-04', 'Costco & Trader Joe''s'),
(1,  180.00, 'Bills & Utilities','Electricity & internet – May',         'Bank Transfer', '2026-05-05', NULL),
(1,   65.00, 'Food',             'Team lunch outing',                    'Credit Card',   '2026-05-07', NULL),
(1,   45.00, 'Transportation',   'Monthly bus pass',                     'Debit Card',    '2026-05-08', NULL),
(1,   15.00, 'Entertainment',    'Netflix subscription',                 'Credit Card',   '2026-05-10', NULL),
(1,  120.00, 'Shopping',         'New running shoes',                    'Credit Card',   '2026-05-15', 'Nike sale'),
(1,   50.00, 'Healthcare',       'Pharmacy – vitamins',                  'Cash',          '2026-05-18', NULL),
(1,   38.00, 'Food',             'Restaurant dinner',                    'Credit Card',   '2026-05-22', NULL),
(1,   75.00, 'Education',        'Online course – Udemy',                'Credit Card',   '2026-05-28', 'React advanced course'),
-- ---- June 2026 ----
(1, 1500.00, 'Rent',             'Monthly rent – June',                  'Bank Transfer', '2026-06-01', NULL),
(1,  395.00, 'Groceries',        'Monthly groceries',                    'Debit Card',    '2026-06-03', NULL),
(1,  185.00, 'Bills & Utilities','Electricity & internet – June',        'Bank Transfer', '2026-06-05', NULL),
(1,   55.00, 'Transportation',   'Uber rides – June',                    'Credit Card',   '2026-06-10', NULL),
(1,  250.00, 'Shopping',         'Summer clothes haul',                  'Credit Card',   '2026-06-14', NULL),
(1,   90.00, 'Entertainment',    'Concert tickets',                      'Credit Card',   '2026-06-18', 'Jazz festival'),
(1,   48.00, 'Food',             'Coffee shop visits',                   'Cash',          '2026-06-20', NULL),
(1,   70.00, 'Healthcare',       'Doctor co-pay',                        'Debit Card',    '2026-06-23', NULL),
(1,  150.00, 'Travel',           'Weekend trip – hotel',                 'Credit Card',   '2026-06-28', 'Short trip upstate'),
-- ---- July 2026 ----
(1, 1500.00, 'Rent',             'Monthly rent – July',                  'Bank Transfer', '2026-07-01', NULL),
(1,  410.00, 'Groceries',        'Monthly groceries',                    'Debit Card',    '2026-07-05', NULL),
(1,  175.00, 'Bills & Utilities','Electricity & internet – July',        'Bank Transfer', '2026-07-06', NULL),
(1,   60.00, 'Transportation',   'Gas & parking – July',                 'Cash',          '2026-07-12', NULL),
(1,  320.00, 'Travel',           'Flight tickets – summer vacation',     'Credit Card',   '2026-07-15', 'Round trip Chicago'),
(1,  200.00, 'Travel',           'Hotel – summer vacation',              'Credit Card',   '2026-07-18', '3-night stay'),
(1,   85.00, 'Entertainment',    'Amusement park tickets',               'Cash',          '2026-07-19', NULL),
(1,   42.00, 'Food',             'Vacation dining',                      'Cash',          '2026-07-20', NULL),
(1,   15.00, 'Entertainment',    'Spotify subscription',                 'Credit Card',   '2026-07-22', NULL),
-- ---- August 2026 ----
(1, 1500.00, 'Rent',             'Monthly rent – August',                'Bank Transfer', '2026-08-01', NULL),
(1,  430.00, 'Groceries',        'Monthly groceries',                    'Debit Card',    '2026-08-03', NULL),
(1,  195.00, 'Bills & Utilities','Electricity (AC season) & internet',   'Bank Transfer', '2026-08-05', 'AC running high'),
(1,  180.00, 'Shopping',         'Back-to-school supplies',              'Debit Card',    '2026-08-10', NULL),
(1,  100.00, 'Education',        'Programming book bundle',              'Credit Card',   '2026-08-14', 'O''Reilly books'),
(1,   55.00, 'Transportation',   'Monthly commuter pass',                'Debit Card',    '2026-08-15', NULL),
(1,   62.00, 'Food',             'Birthday dinner (self)',               'Credit Card',   '2026-08-20', 'Favourite restaurant'),
(1,   40.00, 'Healthcare',       'Gym membership',                       'Debit Card',    '2026-08-25', NULL),
-- ---- September 2026 ----
(1, 1500.00, 'Rent',             'Monthly rent – September',             'Bank Transfer', '2026-09-01', NULL),
(1,  400.00, 'Groceries',        'Monthly groceries',                    'Debit Card',    '2026-09-04', NULL),
(1,  180.00, 'Bills & Utilities','Electricity & internet – September',   'Bank Transfer', '2026-09-05', NULL),
(1,   50.00, 'Transportation',   'Uber rides – September',               'Credit Card',   '2026-09-10', NULL),
(1,  130.00, 'Entertainment',    'Movie & bowling night',                'Credit Card',   '2026-09-13', 'Double feature'),
(1,  220.00, 'Shopping',         'Fall clothing',                        'Credit Card',   '2026-09-18', NULL),
(1,   80.00, 'Healthcare',       'Dental checkup co-pay',                'Debit Card',    '2026-09-22', NULL),
(1,   55.00, 'Food',             'Takeout meals',                        'Cash',          '2026-09-27', NULL),
-- ---- October 2026 ----
(1, 1500.00, 'Rent',             'Monthly rent – October',               'Bank Transfer', '2026-10-01', NULL),
(1,  415.00, 'Groceries',        'Monthly groceries',                    'Debit Card',    '2026-10-04', NULL),
(1,  185.00, 'Bills & Utilities','Electricity & internet – October',     'Bank Transfer', '2026-10-05', NULL),
(1,  280.00, 'Shopping',         'Halloween costume & decor',            'Credit Card',   '2026-10-10', NULL),
(1,   60.00, 'Entertainment',    'Haunted house event',                  'Cash',          '2026-10-20', NULL),
(1,   45.00, 'Transportation',   'Monthly bus pass',                     'Debit Card',    '2026-10-01', NULL),
(1,   90.00, 'Food',             'Dinner parties & takeout',             'Credit Card',   '2026-10-25', NULL),
(1,   75.00, 'Education',        'Online certification exam fee',        'Credit Card',   '2026-10-28', 'AWS Cloud Practitioner'),
(1,   40.00, 'Healthcare',       'Flu shot & pharmacy',                  'Cash',          '2026-10-15', NULL),
-- ---- November 2026 (partial) ----
(1, 1500.00, 'Rent',             'Monthly rent – November',              'Bank Transfer', '2026-11-01', NULL),
(1,  390.00, 'Groceries',        'Weekly groceries',                     'Debit Card',    '2026-11-02', NULL),
(1,  180.00, 'Bills & Utilities','Electricity & internet – November',    'Bank Transfer', '2026-11-05', NULL),
(1,   75.00, 'Food',             'Team lunch & coffee',                  'Credit Card',   '2026-11-07', NULL),
(1,   40.00, 'Transportation',   'Uber rides – early Nov',               'Credit Card',   '2026-11-09', NULL),
(1,  120.00, 'Shopping',         'Early Black Friday deals',             'Credit Card',   '2026-11-11', NULL),
(1,   15.00, 'Entertainment',    'Netflix subscription',                 'Credit Card',   '2026-11-10', NULL);

-- ============================================================
-- BUDGETS – User 1, November 2026
-- ============================================================
INSERT INTO budgets (user_id, category, monthly_limit, month, year) VALUES
(1, 'Food',             500.00,  11, 2026),
(1, 'Transportation',   200.00,  11, 2026),
(1, 'Shopping',         300.00,  11, 2026),
(1, 'Entertainment',    150.00,  11, 2026),
(1, 'Rent',            1500.00,  11, 2026),
(1, 'Bills & Utilities',200.00,  11, 2026),
(1, 'Groceries',        400.00,  11, 2026);

-- ============================================================
-- SAVINGS GOALS – User 1
-- ============================================================
INSERT INTO savings_goals (user_id, goal_name, target_amount, current_amount, target_date, description) VALUES
(1, 'Emergency Fund', 10000.00,  3500.00, '2027-06-30', 'Build a 2-month emergency safety net'),
(1, 'Vacation Fund',   5000.00,  1200.00, '2027-03-31', 'Trip to Europe – flights, hotels & experiences'),
(1, 'New Laptop',      2000.00,   800.00, '2027-01-31', 'MacBook Pro for work & freelancing');

-- ============================================================
-- SAVINGS CONTRIBUTIONS
-- goal_id 1 = Emergency Fund | goal_id 2 = Vacation | goal_id 3 = Laptop
-- ============================================================
INSERT INTO savings_contributions (goal_id, amount, contribution_date, description) VALUES
-- Emergency Fund contributions
(1,  500.00, '2026-05-31', 'May contribution'),
(1,  600.00, '2026-06-30', 'June contribution – extra freelancing income'),
(1,  500.00, '2026-07-31', 'July contribution'),
(1,  700.00, '2026-08-31', 'August contribution – bumped up'),
(1,  700.00, '2026-09-30', 'September contribution'),
(1,  500.00, '2026-10-31', 'October contribution'),
-- Vacation Fund contributions
(1,  200.00, '2026-06-30', 'Starting the vacation fund'),
(1,  300.00, '2026-07-31', 'July top-up'),
(1,  350.00, '2026-08-31', 'August top-up'),
(1,  200.00, '2026-09-30', 'September top-up'),
(1,  150.00, '2026-10-31', 'October top-up'),
-- New Laptop contributions
(1,  200.00, '2026-07-31', 'First laptop fund deposit'),
(1,  200.00, '2026-08-31', 'August deposit'),
(1,  200.00, '2026-09-30', 'September deposit'),
(1,  200.00, '2026-10-31', 'October deposit');

-- ============================================================
-- RECURRING TRANSACTIONS – User 1
-- ============================================================
INSERT INTO recurring_transactions
  (user_id, transaction_type, amount, category, description, payment_method, frequency, next_due_date, active)
VALUES
(1, 'expense', 1500.00, 'Rent',          'Monthly apartment rent',    'Bank Transfer', 'monthly', '2026-12-01', TRUE),
(1, 'expense',   15.00, 'Entertainment', 'Netflix streaming plan',    'Credit Card',   'monthly', '2026-12-10', TRUE);

-- ============================================================
-- NOTIFICATIONS – User 1
-- ============================================================
INSERT INTO notifications (user_id, message, notification_type, is_read) VALUES
(1, 'You have exceeded 90% of your Shopping budget for November 2026.',       'budget_alert',   FALSE),
(1, 'Your Vacation Fund is 24% funded – keep it up!',                         'savings_update', FALSE),
(1, 'Monthly salary of $5,000.00 has been recorded for November 2026.',       'income_added',   TRUE);
