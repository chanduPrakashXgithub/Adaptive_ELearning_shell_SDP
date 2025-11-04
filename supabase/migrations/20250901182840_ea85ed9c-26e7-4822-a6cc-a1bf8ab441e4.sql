-- Clean up duplicate modules and questions first
DELETE FROM quiz_questions WHERE quiz_id IN (
  SELECT q.id FROM quizzes q 
  JOIN modules m ON q.module_id = m.id 
  WHERE q.title LIKE '%Introduction to AI%' AND m.slug != 'introduction-to-ai'
);

DELETE FROM test_questions WHERE test_id IN (
  SELECT t.id FROM tests t 
  JOIN modules m ON t.module_id = m.id 
  WHERE t.title LIKE '%Introduction to AI%' AND m.slug != 'introduction-to-ai'
);

DELETE FROM quizzes WHERE module_id IN (
  SELECT m.id FROM modules m 
  WHERE slug != 'introduction-to-ai'
) AND title LIKE '%Introduction to AI%';

DELETE FROM tests WHERE module_id IN (
  SELECT m.id FROM modules m 
  WHERE slug != 'introduction-to-ai'
) AND title LIKE '%Introduction to AI%';

-- Update quiz and test titles to be module-specific
UPDATE quizzes SET 
  title = CASE 
    WHEN module_id = (SELECT id FROM modules WHERE slug = 'machine-learning-basics') 
      THEN 'Machine Learning Fundamentals Quiz'
    WHEN module_id = (SELECT id FROM modules WHERE slug = 'deep-learning-fundamentals') 
      THEN 'Deep Learning Concepts Quiz'
    WHEN module_id = (SELECT id FROM modules WHERE slug = 'neural-networks') 
      THEN 'Neural Networks Quiz'
    ELSE title
  END,
  description = CASE 
    WHEN module_id = (SELECT id FROM modules WHERE slug = 'machine-learning-basics') 
      THEN 'Test your knowledge of supervised and unsupervised learning'
    WHEN module_id = (SELECT id FROM modules WHERE slug = 'deep-learning-fundamentals') 
      THEN 'Assess your understanding of deep learning principles'
    WHEN module_id = (SELECT id FROM modules WHERE slug = 'neural-networks') 
      THEN 'Evaluate your neural network concepts knowledge'
    ELSE description
  END
WHERE title LIKE '%Introduction to AI%';

UPDATE tests SET 
  title = CASE 
    WHEN module_id = (SELECT id FROM modules WHERE slug = 'machine-learning-basics') 
      THEN 'Machine Learning Mastery Test'
    WHEN module_id = (SELECT id FROM modules WHERE slug = 'deep-learning-fundamentals') 
      THEN 'Deep Learning Assessment'
    WHEN module_id = (SELECT id FROM modules WHERE slug = 'neural-networks') 
      THEN 'Neural Networks Proficiency Test'
    ELSE title
  END,
  description = CASE 
    WHEN module_id = (SELECT id FROM modules WHERE slug = 'machine-learning-basics') 
      THEN 'Comprehensive assessment of machine learning concepts'
    WHEN module_id = (SELECT id FROM modules WHERE slug = 'deep-learning-fundamentals') 
      THEN 'Advanced evaluation of deep learning mastery'
    WHEN module_id = (SELECT id FROM modules WHERE slug = 'neural-networks') 
      THEN 'In-depth test of neural network understanding'
    ELSE description
  END
WHERE title LIKE '%Introduction to AI%';