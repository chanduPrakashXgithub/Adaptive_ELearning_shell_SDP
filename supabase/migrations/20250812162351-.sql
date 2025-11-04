-- Fix: recreate policies without IF NOT EXISTS

-- 1) Modules
create table if not exists public.modules (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.modules enable row level security;

drop policy if exists "Modules are readable by everyone" on public.modules;
create policy "Modules are readable by everyone"
  on public.modules for select using (true);

create or replace trigger trg_modules_updated
before update on public.modules
for each row execute function public.update_updated_at_column();

-- 2) Theory contents
create table if not exists public.theory_contents (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(id) on delete cascade,
  source_url text,
  license text,
  content_markdown text,
  content_html text,
  content_format text not null default 'markdown',
  version int not null default 1,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_theory_contents_module on public.theory_contents(module_id, published desc, version desc);
alter table public.theory_contents enable row level security;

drop policy if exists "Theory is readable by everyone" on public.theory_contents;
create policy "Theory is readable by everyone"
  on public.theory_contents for select using (true);

create or replace trigger trg_theory_contents_updated
before update on public.theory_contents
for each row execute function public.update_updated_at_column();

-- 3) Quizzes and questions
create table if not exists public.quizzes (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(id) on delete cascade,
  title text not null,
  description text,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_quizzes_module on public.quizzes(module_id, published desc);
alter table public.quizzes enable row level security;

drop policy if exists "Quizzes are readable by everyone" on public.quizzes;
create policy "Quizzes are readable by everyone"
  on public.quizzes for select using (true);

create or replace trigger trg_quizzes_updated
before update on public.quizzes
for each row execute function public.update_updated_at_column();

create table if not exists public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  question text not null,
  options text[] not null,
  correct_index int not null,
  explanation text,
  order_index int not null default 0
);
create index if not exists idx_quiz_questions_quiz on public.quiz_questions(quiz_id, order_index);
alter table public.quiz_questions enable row level security;

drop policy if exists "Quiz questions are readable by everyone" on public.quiz_questions;
create policy "Quiz questions are readable by everyone"
  on public.quiz_questions for select using (true);

-- 4) Tests and questions
create table if not exists public.tests (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(id) on delete cascade,
  title text not null,
  description text,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_tests_module on public.tests(module_id, published desc);
alter table public.tests enable row level security;

drop policy if exists "Tests are readable by everyone" on public.tests;
create policy "Tests are readable by everyone"
  on public.tests for select using (true);

create or replace trigger trg_tests_updated
before update on public.tests
for each row execute function public.update_updated_at_column();

create table if not exists public.test_questions (
  id uuid primary key default gen_random_uuid(),
  test_id uuid not null references public.tests(id) on delete cascade,
  question text not null,
  options text[] not null,
  correct_index int not null,
  explanation text,
  order_index int not null default 0
);
create index if not exists idx_test_questions_test on public.test_questions(test_id, order_index);
alter table public.test_questions enable row level security;

drop policy if exists "Test questions are readable by everyone" on public.test_questions;
create policy "Test questions are readable by everyone"
  on public.test_questions for select using (true);

-- 5) Attempts (per-user)
create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  answers jsonb not null default '[]'::jsonb,
  score int,
  started_at timestamptz not null default now(),
  completed_at timestamptz
);
create index if not exists idx_quiz_attempts_user on public.quiz_attempts(user_id);
create index if not exists idx_quiz_attempts_quiz on public.quiz_attempts(quiz_id);
alter table public.quiz_attempts enable row level security;

drop policy if exists "Users can view their own quiz attempts" on public.quiz_attempts;
create policy "Users can view their own quiz attempts"
  on public.quiz_attempts for select using (auth.uid() = user_id);

drop policy if exists "Users can create their own quiz attempts" on public.quiz_attempts;
create policy "Users can create their own quiz attempts"
  on public.quiz_attempts for insert with check (auth.uid() = user_id);


drop policy if exists "Users can update their own quiz attempts" on public.quiz_attempts;
create policy "Users can update their own quiz attempts"
  on public.quiz_attempts for update using (auth.uid() = user_id);


drop policy if exists "Users can delete their own quiz attempts" on public.quiz_attempts;
create policy "Users can delete their own quiz attempts"
  on public.quiz_attempts for delete using (auth.uid() = user_id);

create table if not exists public.test_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  test_id uuid not null references public.tests(id) on delete cascade,
  answers jsonb not null default '[]'::jsonb,
  score int,
  started_at timestamptz not null default now(),
  completed_at timestamptz
);
create index if not exists idx_test_attempts_user on public.test_attempts(user_id);
create index if not exists idx_test_attempts_test on public.test_attempts(test_id);
alter table public.test_attempts enable row level security;

drop policy if exists "Users can view their own test attempts" on public.test_attempts;
create policy "Users can view their own test attempts"
  on public.test_attempts for select using (auth.uid() = user_id);

drop policy if exists "Users can create their own test attempts" on public.test_attempts;
create policy "Users can create their own test attempts"
  on public.test_attempts for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update their own test attempts" on public.test_attempts;
create policy "Users can update their own test attempts"
  on public.test_attempts for update using (auth.uid() = user_id);

drop policy if exists "Users can delete their own test attempts" on public.test_attempts;
create policy "Users can delete their own test attempts"
  on public.test_attempts for delete using (auth.uid() = user_id);

-- 6) User module progress
create table if not exists public.user_module_progress (
  user_id uuid not null,
  module_id uuid not null references public.modules(id) on delete cascade,
  theory_completed boolean not null default false,
  quizzes_attempted int not null default 0,
  tests_attempted int not null default 0,
  time_spent_seconds int not null default 0,
  percent_complete numeric(5,2) not null default 0,
  last_activity_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, module_id)
);
create index if not exists idx_progress_user on public.user_module_progress(user_id);
create index if not exists idx_progress_module on public.user_module_progress(module_id);
alter table public.user_module_progress enable row level security;

drop policy if exists "Users can view their own module progress" on public.user_module_progress;
create policy "Users can view their own module progress"
  on public.user_module_progress for select using (auth.uid() = user_id);

drop policy if exists "Users can upsert their own module progress" on public.user_module_progress;
create policy "Users can upsert their own module progress"
  on public.user_module_progress for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update their own module progress" on public.user_module_progress;
create policy "Users can update their own module progress"
  on public.user_module_progress for update using (auth.uid() = user_id);

drop policy if exists "Users can delete their own module progress" on public.user_module_progress;
create policy "Users can delete their own module progress"
  on public.user_module_progress for delete using (auth.uid() = user_id);

create or replace trigger trg_progress_updated
before update on public.user_module_progress
for each row execute function public.update_updated_at_column();

-- Seeds
insert into public.modules (slug, title, description)
values
  ('introduction-to-ai', 'Introduction to AI', 'Foundational concepts, history, and applications of Artificial Intelligence.'),
  ('machine-learning-basics', 'Machine Learning Basics', 'Core ML paradigms, workflows, and algorithms.'),
  ('deep-learning-fundamentals', 'Deep Learning Fundamentals', 'Neural networks, backpropagation, and key DL concepts.'),
  ('neural-networks', 'Neural Networks', 'Architectures, activation functions, training, and evaluation.')
on conflict (slug) do nothing;

with mods as (
  select id, slug from public.modules where slug in (
    'introduction-to-ai','machine-learning-basics','deep-learning-fundamentals','neural-networks'
  )
)
insert into public.quizzes (module_id, title, description)
select id, initcap(replace(slug,'-',' ')) || ' Quiz', 'Quick knowledge check.' from mods
on conflict do nothing;

insert into public.quiz_questions (quiz_id, question, options, correct_index, explanation, order_index)
select q.id, 'Which of the following is a supervised learning task?', array['Clustering','Classification','Dimensionality Reduction','Association Rule Mining'], 1, 'Classification is a supervised learning task.', 0
from public.quizzes q
on conflict do nothing;

insert into public.quiz_questions (quiz_id, question, options, correct_index, explanation, order_index)
select q.id, 'Backpropagation is primarily used to:', array['Optimize hyperparameters','Update network weights','Normalize data','Generate features'], 1, 'Backpropagation updates weights via gradient descent.', 1
from public.quizzes q
on conflict do nothing;

with mods2 as (
  select id, slug from public.modules where slug in (
    'introduction-to-ai','machine-learning-basics','deep-learning-fundamentals','neural-networks'
  )
)
insert into public.tests (module_id, title, description)
select id, initcap(replace(slug,'-',' ')) || ' Test', 'Short summative assessment.' from mods2
on conflict do nothing;

insert into public.test_questions (test_id, question, options, correct_index, explanation, order_index)
select t.id, 'A perceptron can learn which type of decision boundary?', array['Non-linear','Linear','Quadratic','Cubic'], 1, 'Single-layer perceptrons learn linear decision boundaries.', 0
from public.tests t
on conflict do nothing;

insert into public.test_questions (test_id, question, options, correct_index, explanation, order_index)
select t.id, 'Which metric is appropriate for imbalanced classification?', array['Accuracy','Precision/Recall','MSE','R^2'], 1, 'Precision/Recall or F1 are better for imbalanced data.', 1
from public.tests t
on conflict do nothing;