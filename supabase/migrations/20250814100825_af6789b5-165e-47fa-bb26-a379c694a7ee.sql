-- Add quiz questions for all modules
INSERT INTO quiz_questions (quiz_id, question, options, correct_index, order_index, explanation) 
SELECT 
  q.id,
  CASE q.module_id
    WHEN (SELECT id FROM modules WHERE slug = 'introduction-to-ai') THEN 
      CASE ROW_NUMBER() OVER (ORDER BY q.id)
        WHEN 1 THEN 'What is artificial intelligence?'
        WHEN 2 THEN 'Which of the following is NOT a type of machine learning?'
        WHEN 3 THEN 'What is the Turing Test used for?'
        WHEN 4 THEN 'Which AI technique mimics the human brain?'
        WHEN 5 THEN 'What does NLP stand for in AI?'
      END
    WHEN (SELECT id FROM modules WHERE slug = 'machine-learning-basics') THEN
      CASE ROW_NUMBER() OVER (ORDER BY q.id)
        WHEN 1 THEN 'What is supervised learning?'
        WHEN 2 THEN 'Which algorithm is commonly used for classification?'
        WHEN 3 THEN 'What is overfitting in machine learning?'
        WHEN 4 THEN 'What is the purpose of cross-validation?'
        WHEN 5 THEN 'Which metric is used for regression problems?'
      END
    WHEN (SELECT id FROM modules WHERE slug = 'deep-learning-fundamentals') THEN
      CASE ROW_NUMBER() OVER (ORDER BY q.id)
        WHEN 1 THEN 'What is a neural network?'
        WHEN 2 THEN 'What is backpropagation?'
        WHEN 3 THEN 'Which activation function is commonly used?'
        WHEN 4 THEN 'What is gradient descent?'
        WHEN 5 THEN 'What does CNN stand for?'
      END
    WHEN (SELECT id FROM modules WHERE slug = 'neural-networks') THEN
      CASE ROW_NUMBER() OVER (ORDER BY q.id)
        WHEN 1 THEN 'What is a perceptron?'
        WHEN 2 THEN 'How many layers does a deep neural network have?'
        WHEN 3 THEN 'What is the vanishing gradient problem?'
        WHEN 4 THEN 'Which technique helps prevent overfitting?'
        WHEN 5 THEN 'What is transfer learning?'
      END
  END as question,
  CASE q.module_id
    WHEN (SELECT id FROM modules WHERE slug = 'introduction-to-ai') THEN 
      CASE ROW_NUMBER() OVER (ORDER BY q.id)
        WHEN 1 THEN ARRAY['A computer program that can think', 'Simulation of human intelligence in machines', 'A robot that looks like a human', 'Advanced calculator software']
        WHEN 2 THEN ARRAY['Supervised learning', 'Unsupervised learning', 'Reinforcement learning', 'Quantum learning']
        WHEN 3 THEN ARRAY['Testing computer speed', 'Measuring AI intelligence', 'Network connectivity test', 'Software debugging']
        WHEN 4 THEN ARRAY['Decision trees', 'Linear regression', 'Neural networks', 'K-means clustering']
        WHEN 5 THEN ARRAY['New Learning Protocol', 'Natural Language Processing', 'Neural Logic Programming', 'Network Layer Protocol']
      END
    WHEN (SELECT id FROM modules WHERE slug = 'machine-learning-basics') THEN
      CASE ROW_NUMBER() OVER (ORDER BY q.id)
        WHEN 1 THEN ARRAY['Learning with labeled data', 'Learning without data', 'Learning from mistakes', 'Learning by trial and error']
        WHEN 2 THEN ARRAY['K-means', 'Linear regression', 'Decision tree', 'PCA']
        WHEN 3 THEN ARRAY['Good model performance', 'Model memorizes training data', 'Fast training time', 'Simple model structure']
        WHEN 4 THEN ARRAY['Speed up training', 'Evaluate model performance', 'Reduce data size', 'Increase accuracy']
        WHEN 5 THEN ARRAY['Accuracy', 'Precision', 'Mean Squared Error', 'F1-score']
      END
    WHEN (SELECT id FROM modules WHERE slug = 'deep-learning-fundamentals') THEN
      CASE ROW_NUMBER() OVER (ORDER BY q.id)
        WHEN 1 THEN ARRAY['A fishing net', 'A network of interconnected nodes', 'A computer network', 'A social network']
        WHEN 2 THEN ARRAY['Forward pass algorithm', 'Backward error propagation', 'Data preprocessing', 'Model validation']
        WHEN 3 THEN ARRAY['Sigmoid', 'ReLU', 'Tanh', 'Linear']
        WHEN 4 THEN ARRAY['Data cleaning method', 'Optimization algorithm', 'Activation function', 'Loss function']
        WHEN 5 THEN ARRAY['Computer Neural Network', 'Convolutional Neural Network', 'Cognitive Neural Network', 'Continuous Neural Network']
      END
    WHEN (SELECT id FROM modules WHERE slug = 'neural-networks') THEN
      CASE ROW_NUMBER() OVER (ORDER BY q.id)
        WHEN 1 THEN ARRAY['Simple neural network unit', 'Complex algorithm', 'Data structure', 'Programming language']
        WHEN 2 THEN ARRAY['1-2 layers', 'More than 3 layers', '10 layers exactly', 'Always 5 layers']
        WHEN 3 THEN ARRAY['Gradients become very small', 'Training is too fast', 'Too much data', 'Model is too simple']
        WHEN 4 THEN ARRAY['Batch normalization', 'Dropout', 'Early stopping', 'All of the above']
        WHEN 5 THEN ARRAY['Using pre-trained models', 'Training from scratch', 'Data augmentation', 'Feature engineering']
      END
  END as options,
  CASE q.module_id
    WHEN (SELECT id FROM modules WHERE slug = 'introduction-to-ai') THEN 
      CASE ROW_NUMBER() OVER (ORDER BY q.id) WHEN 1 THEN 1 WHEN 2 THEN 3 WHEN 3 THEN 1 WHEN 4 THEN 2 WHEN 5 THEN 1 END
    WHEN (SELECT id FROM modules WHERE slug = 'machine-learning-basics') THEN
      CASE ROW_NUMBER() OVER (ORDER BY q.id) WHEN 1 THEN 0 WHEN 2 THEN 2 WHEN 3 THEN 1 WHEN 4 THEN 1 WHEN 5 THEN 2 END
    WHEN (SELECT id FROM modules WHERE slug = 'deep-learning-fundamentals') THEN
      CASE ROW_NUMBER() OVER (ORDER BY q.id) WHEN 1 THEN 1 WHEN 2 THEN 1 WHEN 3 THEN 1 WHEN 4 THEN 1 WHEN 5 THEN 1 END
    WHEN (SELECT id FROM modules WHERE slug = 'neural-networks') THEN
      CASE ROW_NUMBER() OVER (ORDER BY q.id) WHEN 1 THEN 0 WHEN 2 THEN 1 WHEN 3 THEN 0 WHEN 4 THEN 3 WHEN 5 THEN 0 END
  END as correct_index,
  (ROW_NUMBER() OVER (PARTITION BY q.id ORDER BY q.id) - 1) as order_index,
  'Explanation for this question.' as explanation
FROM quizzes q
CROSS JOIN generate_series(1, 5) as series
WHERE NOT EXISTS (SELECT 1 FROM quiz_questions WHERE quiz_id = q.id);

-- Add test questions for all modules  
INSERT INTO test_questions (test_id, question, options, correct_index, order_index, explanation)
SELECT 
  t.id,
  CASE t.module_id
    WHEN (SELECT id FROM modules WHERE slug = 'introduction-to-ai') THEN 
      CASE ROW_NUMBER() OVER (ORDER BY t.id)
        WHEN 1 THEN 'Define artificial intelligence and its main goals.'
        WHEN 2 THEN 'Explain the difference between narrow and general AI.'
        WHEN 3 THEN 'What are the main branches of AI?'
      END
    WHEN (SELECT id FROM modules WHERE slug = 'machine-learning-basics') THEN
      CASE ROW_NUMBER() OVER (ORDER BY t.id)
        WHEN 1 THEN 'Compare supervised vs unsupervised learning.'
        WHEN 2 THEN 'Explain the bias-variance tradeoff.'
        WHEN 3 THEN 'What is feature engineering and why is it important?'
      END
    WHEN (SELECT id FROM modules WHERE slug = 'deep-learning-fundamentals') THEN
      CASE ROW_NUMBER() OVER (ORDER BY t.id)
        WHEN 1 THEN 'Explain how backpropagation works in neural networks.'
        WHEN 2 THEN 'What are the advantages of deep learning over traditional ML?'
        WHEN 3 THEN 'Describe the vanishing gradient problem and solutions.'
      END
    WHEN (SELECT id FROM modules WHERE slug = 'neural-networks') THEN
      CASE ROW_NUMBER() OVER (ORDER BY t.id)
        WHEN 1 THEN 'Design a neural network architecture for image classification.'
        WHEN 2 THEN 'Explain different types of neural network layers.'
        WHEN 3 THEN 'How do you prevent overfitting in neural networks?'
      END
  END as question,
  ARRAY['Option A', 'Option B', 'Option C', 'Option D'] as options,
  0 as correct_index,
  (ROW_NUMBER() OVER (PARTITION BY t.id ORDER BY t.id) - 1) as order_index,
  'Detailed explanation for this test question.' as explanation
FROM tests t
CROSS JOIN generate_series(1, 3) as series
WHERE NOT EXISTS (SELECT 1 FROM test_questions WHERE test_id = t.id);