
-- Insert 8 new diverse modules
INSERT INTO modules (slug, title, description) VALUES
('natural-language-processing', 'Natural Language Processing', 'Understanding and processing human language with AI, including tokenization, embeddings, and transformers.'),
('computer-vision', 'Computer Vision', 'Image processing, object detection, and visual recognition using deep learning techniques.'),
('reinforcement-learning', 'Reinforcement Learning', 'Agent-based learning through rewards and penalties, Q-learning, and policy gradients.'),
('data-science-analytics', 'Data Science & Analytics', 'Statistical analysis, data visualization, and extracting insights from large datasets.'),
('cloud-computing-devops', 'Cloud Computing & DevOps', 'Cloud platforms, containerization, CI/CD pipelines, and infrastructure as code.'),
('web-development', 'Web Development', 'Modern web technologies, frameworks, responsive design, and full-stack development.'),
('cybersecurity-fundamentals', 'Cybersecurity Fundamentals', 'Network security, encryption, vulnerability assessment, and security best practices.'),
('mobile-app-development', 'Mobile App Development', 'Building cross-platform and native mobile applications with modern frameworks.');

-- Add theory content for Natural Language Processing
INSERT INTO theory_contents (module_id, content_markdown, source_url, license)
SELECT id, 
'# Natural Language Processing (NLP)

Natural Language Processing is a branch of artificial intelligence that helps computers understand, interpret, and manipulate human language.

## Key Concepts

### Tokenization
Breaking down text into smaller units (tokens) such as words or subwords.

### Word Embeddings
Representing words as dense vectors that capture semantic meaning.

### Transformers
Modern architecture that uses self-attention mechanisms for processing sequential data.

## Applications
- Machine Translation
- Sentiment Analysis
- Chatbots and Virtual Assistants
- Text Summarization',
'https://en.wikipedia.org/wiki/Natural_language_processing',
'CC BY-SA 4.0'
FROM modules WHERE slug = 'natural-language-processing';

-- Add theory content for Computer Vision
INSERT INTO theory_contents (module_id, content_markdown, source_url, license)
SELECT id,
'# Computer Vision

Computer Vision enables machines to derive meaningful information from digital images and videos.

## Core Topics

### Image Processing
Techniques for enhancing and transforming images.

### Convolutional Neural Networks (CNNs)
Specialized networks for processing grid-like data such as images.

### Object Detection
Identifying and locating objects within images.

## Real-World Applications
- Facial Recognition
- Autonomous Vehicles
- Medical Image Analysis
- Augmented Reality',
'https://en.wikipedia.org/wiki/Computer_vision',
'CC BY-SA 4.0'
FROM modules WHERE slug = 'computer-vision';

-- Add theory content for Reinforcement Learning
INSERT INTO theory_contents (module_id, content_markdown, source_url, license)
SELECT id,
'# Reinforcement Learning

A type of machine learning where an agent learns to make decisions by interacting with an environment.

## Key Components

### Agent and Environment
The learner (agent) interacts with its surroundings (environment).

### Rewards and Penalties
Feedback signals that guide the learning process.

### Q-Learning
A value-based method that learns the value of actions in states.

## Use Cases
- Game Playing (Chess, Go)
- Robotics Control
- Resource Management
- Autonomous Navigation',
'https://en.wikipedia.org/wiki/Reinforcement_learning',
'CC BY-SA 4.0'
FROM modules WHERE slug = 'reinforcement-learning';

-- Add theory content for Data Science & Analytics
INSERT INTO theory_contents (module_id, content_markdown, source_url, license)
SELECT id,
'# Data Science & Analytics

The practice of extracting insights and knowledge from structured and unstructured data.

## Essential Skills

### Statistical Analysis
Understanding probability, distributions, and hypothesis testing.

### Data Visualization
Creating charts and graphs to communicate findings.

### Python Libraries
Pandas, NumPy, Matplotlib, and Seaborn for data manipulation.

## Career Paths
- Data Analyst
- Business Intelligence Analyst
- Data Engineer
- Research Scientist',
'https://en.wikipedia.org/wiki/Data_science',
'CC BY-SA 4.0'
FROM modules WHERE slug = 'data-science-analytics';

-- Add theory content for Cloud Computing & DevOps
INSERT INTO theory_contents (module_id, content_markdown, source_url, license)
SELECT id,
'# Cloud Computing & DevOps

Modern practices for deploying, managing, and scaling applications in the cloud.

## Cloud Platforms

### AWS, Azure, GCP
Major cloud service providers offering scalable infrastructure.

### Containerization
Docker and Kubernetes for application packaging and orchestration.

### CI/CD Pipelines
Automated testing and deployment workflows.

## Benefits
- Scalability
- Cost Efficiency
- High Availability
- Faster Deployment',
'https://en.wikipedia.org/wiki/Cloud_computing',
'CC BY-SA 4.0'
FROM modules WHERE slug = 'cloud-computing-devops';

-- Add theory content for Web Development
INSERT INTO theory_contents (module_id, content_markdown, source_url, license)
SELECT id,
'# Web Development

Building websites and web applications using modern technologies and frameworks.

## Frontend Development

### HTML, CSS, JavaScript
Core technologies for creating user interfaces.

### React, Vue, Angular
Popular frameworks for building interactive applications.

### Responsive Design
Creating layouts that work across all devices.

## Backend Development
- Node.js and Express
- RESTful APIs
- Database Integration
- Authentication & Security',
'https://en.wikipedia.org/wiki/Web_development',
'CC BY-SA 4.0'
FROM modules WHERE slug = 'web-development';

-- Add theory content for Cybersecurity
INSERT INTO theory_contents (module_id, content_markdown, source_url, license)
SELECT id,
'# Cybersecurity Fundamentals

Protecting computer systems, networks, and data from digital attacks.

## Security Principles

### CIA Triad
Confidentiality, Integrity, and Availability.

### Encryption
Securing data through cryptographic methods.

### Threat Detection
Identifying and responding to security incidents.

## Common Threats
- Malware and Viruses
- Phishing Attacks
- SQL Injection
- DDoS Attacks',
'https://en.wikipedia.org/wiki/Computer_security',
'CC BY-SA 4.0'
FROM modules WHERE slug = 'cybersecurity-fundamentals';

-- Add theory content for Mobile App Development
INSERT INTO theory_contents (module_id, content_markdown, source_url, license)
SELECT id,
'# Mobile App Development

Creating applications for mobile devices using native and cross-platform technologies.

## Development Approaches

### Native Development
Platform-specific apps using Swift (iOS) or Kotlin (Android).

### Cross-Platform
React Native, Flutter for building apps for multiple platforms.

### Mobile UI/UX
Designing intuitive touch-based interfaces.

## Key Considerations
- Performance Optimization
- Battery Efficiency
- Offline Functionality
- App Store Guidelines',
'https://en.wikipedia.org/wiki/Mobile_app_development',
'CC BY-SA 4.0'
FROM modules WHERE slug = 'mobile-app-development';

-- Add quizzes for each new module
INSERT INTO quizzes (module_id, title, description)
SELECT id, 
  title || ' Quiz',
  'Test your understanding of ' || title || ' concepts'
FROM modules 
WHERE slug IN ('natural-language-processing', 'computer-vision', 'reinforcement-learning', 
               'data-science-analytics', 'cloud-computing-devops', 'web-development', 
               'cybersecurity-fundamentals', 'mobile-app-development');

-- Add quiz questions for NLP
INSERT INTO quiz_questions (quiz_id, question, options, correct_index, order_index, explanation)
SELECT q.id,
  'What is tokenization in NLP?',
  ARRAY['Converting text to binary', 'Breaking text into smaller units', 'Encrypting text', 'Translating text'],
  1,
  0,
  'Tokenization is the process of breaking down text into smaller units like words or subwords.'
FROM quizzes q
JOIN modules m ON q.module_id = m.id
WHERE m.slug = 'natural-language-processing';

INSERT INTO quiz_questions (quiz_id, question, options, correct_index, order_index, explanation)
SELECT q.id,
  'Which architecture revolutionized NLP with self-attention?',
  ARRAY['RNN', 'CNN', 'Transformer', 'SVM'],
  2,
  1,
  'Transformers use self-attention mechanisms and have become the foundation of modern NLP.'
FROM quizzes q
JOIN modules m ON q.module_id = m.id
WHERE m.slug = 'natural-language-processing';

-- Add quiz questions for Computer Vision
INSERT INTO quiz_questions (quiz_id, question, options, correct_index, order_index, explanation)
SELECT q.id,
  'What type of neural network is primarily used for image processing?',
  ARRAY['RNN', 'CNN', 'GAN', 'Transformer'],
  1,
  0,
  'Convolutional Neural Networks (CNNs) are designed specifically for processing grid-like data such as images.'
FROM quizzes q
JOIN modules m ON q.module_id = m.id
WHERE m.slug = 'computer-vision';

INSERT INTO quiz_questions (quiz_id, question, options, correct_index, order_index, explanation)
SELECT q.id,
  'Which application is NOT typically part of computer vision?',
  ARRAY['Facial recognition', 'Speech synthesis', 'Object detection', 'Medical imaging'],
  1,
  1,
  'Speech synthesis is an audio/NLP task, not a computer vision application.'
FROM quizzes q
JOIN modules m ON q.module_id = m.id
WHERE m.slug = 'computer-vision';

-- Add quiz questions for Reinforcement Learning
INSERT INTO quiz_questions (quiz_id, question, options, correct_index, order_index, explanation)
SELECT q.id,
  'In reinforcement learning, what guides the agent''s learning?',
  ARRAY['Labels', 'Rewards and penalties', 'Training data', 'Test cases'],
  1,
  0,
  'Reinforcement learning uses rewards and penalties as feedback to guide the agent''s learning process.'
FROM quizzes q
JOIN modules m ON q.module_id = m.id
WHERE m.slug = 'reinforcement-learning';

INSERT INTO quiz_questions (quiz_id, question, options, correct_index, order_index, explanation)
SELECT q.id,
  'Which game was famously mastered by DeepMind''s AlphaGo using RL?',
  ARRAY['Chess', 'Go', 'Poker', 'Tetris'],
  1,
  1,
  'AlphaGo used reinforcement learning and defeated world champions in the game of Go.'
FROM quizzes q
JOIN modules m ON q.module_id = m.id
WHERE m.slug = 'reinforcement-learning';

-- Add quiz questions for Data Science
INSERT INTO quiz_questions (quiz_id, question, options, correct_index, order_index, explanation)
SELECT q.id,
  'Which Python library is primarily used for data manipulation?',
  ARRAY['Matplotlib', 'Pandas', 'TensorFlow', 'Flask'],
  1,
  0,
  'Pandas is the go-to library for data manipulation and analysis in Python.'
FROM quizzes q
JOIN modules m ON q.module_id = m.id
WHERE m.slug = 'data-science-analytics';

INSERT INTO quiz_questions (quiz_id, question, options, correct_index, order_index, explanation)
SELECT q.id,
  'What does EDA stand for in data science?',
  ARRAY['Extensive Data Analysis', 'Exploratory Data Analysis', 'External Data Access', 'Efficient Data Architecture'],
  1,
  1,
  'Exploratory Data Analysis (EDA) is the process of analyzing datasets to summarize their main characteristics.'
FROM quizzes q
JOIN modules m ON q.module_id = m.id
WHERE m.slug = 'data-science-analytics';

-- Add quiz questions for Cloud & DevOps
INSERT INTO quiz_questions (quiz_id, question, options, correct_index, order_index, explanation)
SELECT q.id,
  'What does CI/CD stand for?',
  ARRAY['Cloud Integration/Cloud Deployment', 'Continuous Integration/Continuous Deployment', 'Code Inspection/Code Development', 'Container Installation/Container Distribution'],
  1,
  0,
  'CI/CD stands for Continuous Integration and Continuous Deployment, automating the software delivery process.'
FROM quizzes q
JOIN modules m ON q.module_id = m.id
WHERE m.slug = 'cloud-computing-devops';

INSERT INTO quiz_questions (quiz_id, question, options, correct_index, order_index, explanation)
SELECT q.id,
  'Which tool is used for container orchestration?',
  ARRAY['Git', 'Jenkins', 'Kubernetes', 'npm'],
  2,
  1,
  'Kubernetes is the leading platform for orchestrating containerized applications.'
FROM quizzes q
JOIN modules m ON q.module_id = m.id
WHERE m.slug = 'cloud-computing-devops';

-- Add quiz questions for Web Development
INSERT INTO quiz_questions (quiz_id, question, options, correct_index, order_index, explanation)
SELECT q.id,
  'Which of these is NOT a JavaScript framework?',
  ARRAY['React', 'Vue', 'Angular', 'Django'],
  3,
  0,
  'Django is a Python web framework, not a JavaScript framework.'
FROM quizzes q
JOIN modules m ON q.module_id = m.id
WHERE m.slug = 'web-development';

INSERT INTO quiz_questions (quiz_id, question, options, correct_index, order_index, explanation)
SELECT q.id,
  'What does API stand for?',
  ARRAY['Application Programming Interface', 'Advanced Programming Integration', 'Automated Process Implementation', 'Application Process Interface'],
  0,
  1,
  'API stands for Application Programming Interface, allowing different software to communicate.'
FROM quizzes q
JOIN modules m ON q.module_id = m.id
WHERE m.slug = 'web-development';

-- Add quiz questions for Cybersecurity
INSERT INTO quiz_questions (quiz_id, question, options, correct_index, order_index, explanation)
SELECT q.id,
  'What does the CIA triad stand for in cybersecurity?',
  ARRAY['Code, Integration, Access', 'Confidentiality, Integrity, Availability', 'Cyber, Information, Analytics', 'Certification, Implementation, Authorization'],
  1,
  0,
  'The CIA triad represents the three pillars of information security: Confidentiality, Integrity, and Availability.'
FROM quizzes q
JOIN modules m ON q.module_id = m.id
WHERE m.slug = 'cybersecurity-fundamentals';

INSERT INTO quiz_questions (quiz_id, question, options, correct_index, order_index, explanation)
SELECT q.id,
  'What type of attack floods a system with traffic?',
  ARRAY['Phishing', 'SQL Injection', 'DDoS', 'Malware'],
  2,
  1,
  'DDoS (Distributed Denial of Service) attacks overwhelm systems with massive traffic.'
FROM quizzes q
JOIN modules m ON q.module_id = m.id
WHERE m.slug = 'cybersecurity-fundamentals';

-- Add quiz questions for Mobile Development
INSERT INTO quiz_questions (quiz_id, question, options, correct_index, order_index, explanation)
SELECT q.id,
  'Which language is used for iOS native development?',
  ARRAY['Java', 'Kotlin', 'Swift', 'Python'],
  2,
  0,
  'Swift is Apple''s programming language for iOS and macOS development.'
FROM quizzes q
JOIN modules m ON q.module_id = m.id
WHERE m.slug = 'mobile-app-development';

INSERT INTO quiz_questions (quiz_id, question, options, correct_index, order_index, explanation)
SELECT q.id,
  'Which framework allows building cross-platform mobile apps?',
  ARRAY['Spring Boot', 'Flutter', 'Laravel', 'Express'],
  1,
  1,
  'Flutter is Google''s framework for building natively compiled applications for mobile, web, and desktop from a single codebase.'
FROM quizzes q
JOIN modules m ON q.module_id = m.id
WHERE m.slug = 'mobile-app-development';

-- Add tests for each new module
INSERT INTO tests (module_id, title, description)
SELECT id,
  title || ' Assessment',
  'Comprehensive assessment of your ' || title || ' knowledge'
FROM modules
WHERE slug IN ('natural-language-processing', 'computer-vision', 'reinforcement-learning',
               'data-science-analytics', 'cloud-computing-devops', 'web-development',
               'cybersecurity-fundamentals', 'mobile-app-development');

-- Add test questions for NLP
INSERT INTO test_questions (test_id, question, options, correct_index, order_index, explanation)
SELECT t.id,
  'Explain the purpose of word embeddings in NLP.',
  ARRAY['To compress text files', 'To represent words as dense vectors capturing semantic meaning', 'To translate between languages', 'To count word frequency'],
  1,
  0,
  'Word embeddings convert words into numerical vectors that capture their semantic relationships and meaning.'
FROM tests t
JOIN modules m ON t.module_id = m.id
WHERE m.slug = 'natural-language-processing';

-- Add test questions for Computer Vision
INSERT INTO test_questions (test_id, question, options, correct_index, order_index, explanation)
SELECT t.id,
  'What is the main advantage of CNNs over traditional neural networks for images?',
  ARRAY['Faster training', 'Spatial feature extraction with parameter sharing', 'Requires less data', 'Works only with color images'],
  1,
  0,
  'CNNs use convolutional layers that preserve spatial relationships and share parameters, making them ideal for image data.'
FROM tests t
JOIN modules m ON t.module_id = m.id
WHERE m.slug = 'computer-vision';

-- Add test questions for Reinforcement Learning
INSERT INTO test_questions (test_id, question, options, correct_index, order_index, explanation)
SELECT t.id,
  'What is the exploration-exploitation tradeoff in RL?',
  ARRAY['Training vs testing balance', 'Balancing trying new actions vs using known good actions', 'Memory vs speed optimization', 'Supervised vs unsupervised learning'],
  1,
  0,
  'The exploration-exploitation tradeoff involves balancing between exploring new actions to discover better strategies and exploiting known actions that yield good rewards.'
FROM tests t
JOIN modules m ON t.module_id = m.id
WHERE m.slug = 'reinforcement-learning';

-- Add test questions for Data Science
INSERT INTO test_questions (test_id, question, options, correct_index, order_index, explanation)
SELECT t.id,
  'Why is data visualization important in data science?',
  ARRAY['Makes data look pretty', 'Helps communicate insights and identify patterns', 'Required by law', 'Reduces file size'],
  1,
  0,
  'Data visualization helps communicate complex findings clearly and allows analysts to identify patterns, trends, and outliers.'
FROM tests t
JOIN modules m ON t.module_id = m.id
WHERE m.slug = 'data-science-analytics';

-- Add test questions for Cloud & DevOps
INSERT INTO test_questions (test_id, question, options, correct_index, order_index, explanation)
SELECT t.id,
  'What is the primary benefit of containerization?',
  ARRAY['Cheaper hosting', 'Consistent environment across development and production', 'Faster code execution', 'Better graphics'],
  1,
  0,
  'Containerization ensures applications run consistently across different environments by packaging code with all its dependencies.'
FROM tests t
JOIN modules m ON t.module_id = m.id
WHERE m.slug = 'cloud-computing-devops';

-- Add test questions for Web Development
INSERT INTO test_questions (test_id, question, options, correct_index, order_index, explanation)
SELECT t.id,
  'What is the purpose of a RESTful API?',
  ARRAY['Design websites', 'Enable communication between client and server using HTTP', 'Store databases', 'Create animations'],
  1,
  0,
  'RESTful APIs provide a standardized way for clients and servers to communicate over HTTP, enabling data exchange.'
FROM tests t
JOIN modules m ON t.module_id = m.id
WHERE m.slug = 'web-development';

-- Add test questions for Cybersecurity
INSERT INTO test_questions (test_id, question, options, correct_index, order_index, explanation)
SELECT t.id,
  'What is the purpose of encryption?',
  ARRAY['Speed up data transfer', 'Protect data confidentiality by converting it to unreadable format', 'Compress files', 'Delete viruses'],
  1,
  0,
  'Encryption converts data into an unreadable format that can only be decrypted with the correct key, ensuring confidentiality.'
FROM tests t
JOIN modules m ON t.module_id = m.id
WHERE m.slug = 'cybersecurity-fundamentals';

-- Add test questions for Mobile Development
INSERT INTO test_questions (test_id, question, options, correct_index, order_index, explanation)
SELECT t.id,
  'What is a key consideration for mobile app performance?',
  ARRAY['Large file sizes', 'Battery efficiency and optimization', 'Using many animations', 'Maximum features'],
  1,
  0,
  'Mobile apps must be optimized for battery efficiency since devices have limited power, affecting user experience.'
FROM tests t
JOIN modules m ON t.module_id = m.id
WHERE m.slug = 'mobile-app-development';
