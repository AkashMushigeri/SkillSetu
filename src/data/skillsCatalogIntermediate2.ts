import type { SkillItem } from './skillsData';

export const EXPANDED_INTERMEDIATE_AI_CLOUD_SKILLS: SkillItem[] = [
  // --- MACHINE LEARNING INTERMEDIATE ---
  {
    id: 'scikit-learn-int',
    name: 'Scikit-learn',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'AI & Machine Learning',
    icon: '🔬',
    aliases: ['sklearn', 'Scikit Learn ML Toolkit'],
    relatedSkills: ['Machine Learning', 'Python', 'Pandas'],
    description: 'Python machine learning framework: unified estimator API (fit, predict, transform), pipeline chaining, feature extraction, and model persistence (joblib).',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Machine Learning Engineer', 'Data Scientist', 'AI Developer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 26,
    estimatedTime: '15 Hours',
    learningObjectives: [
      'Master the standard scikit-learn estimator interface (fit, predict, transform)',
      'Construct end-to-end ColumnTransformers combining one-hot encoding and scaling',
      'Serialize trained models with joblib for production API serving'
    ],
    resources: [
      { id: 'skl-1', title: 'Scikit-learn Estimator Lifecycle & Pipeline Chaining', type: 'doc', duration: '35 min', completed: false, topic: 'Estimators' }
    ]
  },
  {
    id: 'regression-int',
    name: 'Regression',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'AI & Machine Learning',
    icon: '📉',
    aliases: ['Linear Regression', 'Ridge and Lasso', 'Polynomial Regression'],
    relatedSkills: ['Scikit-learn', 'Machine Learning', 'Feature Engineering'],
    description: 'Continuous predictive modeling: Ordinary Least Squares (OLS), assumptions of linear regression, L1 Lasso regularization (feature sparsity), and L2 Ridge regularization.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Data Scientist', 'Quantitative Analyst', 'ML Engineer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 22,
    estimatedTime: '12 Hours',
    learningObjectives: [
      'Verify linear regression assumptions: linearity, homoscedasticity, normality',
      'Apply L1 Lasso regularization to drive irrelevant feature coefficients to zero',
      'Tune L2 Ridge shrinkage parameter (alpha) to mitigate severe multicollinearity'
    ],
    resources: [
      { id: 'reg-1', title: 'Regularized Regression: Ridge vs Lasso Mathematics', type: 'doc', duration: '35 min', completed: false, topic: 'Regularization' }
    ]
  },
  {
    id: 'classification-int',
    name: 'Classification',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'AI & Machine Learning',
    icon: '🏷️',
    aliases: ['Binary Classification', 'Multi-class Classification', 'Logistic Regression'],
    relatedSkills: ['Scikit-learn', 'Machine Learning'],
    description: 'Categorical prediction: Logistic Regression with sigmoid/softmax, multi-class strategies (One-vs-Rest, One-vs-One), ROC-AUC curves, and threshold calibration.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Data Scientist', 'ML Engineer', 'Fraud Detection Specialist'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 24,
    estimatedTime: '14 Hours',
    learningObjectives: [
      'Understand the logistic sigmoid function mapping logits to probabilities [0, 1]',
      'Plot Receiver Operating Characteristic (ROC) and compute Area Under Curve (AUC)',
      'Adjust classification decision thresholds to optimize for recall vs precision'
    ],
    resources: [
      { id: 'clf-1', title: 'Logistic Regression, Sigmoid Function & ROC-AUC Curves', type: 'doc', duration: '35 min', completed: false, topic: 'Classification' }
    ]
  },
  {
    id: 'clustering-int',
    name: 'Clustering',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'AI & Machine Learning',
    icon: '🫧',
    aliases: ['Unsupervised Clustering', 'K-Means', 'DBSCAN', 'Hierarchical Clustering'],
    relatedSkills: ['Machine Learning', 'Data Science'],
    description: 'Unsupervised grouping: K-Means initialization (k-means++), silhouette coefficient scoring, density-based clustering (DBSCAN for noise/outliers), and dendrograms.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Customer Segmentation Specialist', 'Data Scientist', 'ML Engineer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 18,
    estimatedTime: '12 Hours',
    learningObjectives: [
      'Initialize K-Means centroids smartly with k-means++ to avoid poor local minima',
      'Evaluate cluster cohesion and separation using Silhouette Scores',
      'Apply DBSCAN to detect arbitrary-shaped clusters and noise points'
    ],
    resources: [
      { id: 'cls-1', title: 'K-Means vs DBSCAN: Geometry & Silhouette Evaluation', type: 'doc', duration: '35 min', completed: false, topic: 'Clustering' }
    ]
  },
  {
    id: 'decision-trees-int',
    name: 'Decision Trees',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'AI & Machine Learning',
    icon: '🌲',
    aliases: ['CART', 'Gini Impurity', 'Information Gain'],
    relatedSkills: ['Random Forest', 'Scikit-learn', 'Machine Learning'],
    description: 'Non-linear tree modeling: recursive binary splitting (CART), splitting criteria (Gini Impurity vs Entropy/Information Gain), pruning (ccp_alpha), and tree visualization.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['ML Engineer', 'Data Scientist', 'Risk Modeling Analyst'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 20,
    estimatedTime: '10 Hours',
    learningObjectives: [
      'Calculate Gini Impurity and Information Gain for continuous feature thresholds',
      'Prevent catastrophic tree overfitting using max_depth and min_samples_split',
      'Interpret feature importance scores derived from impurity decreases'
    ],
    resources: [
      { id: 'dt-1', title: 'Gini Impurity, Tree Splitting & Cost-Complexity Pruning', type: 'doc', duration: '30 min', completed: false, topic: 'Trees' }
    ]
  },
  {
    id: 'random-forest-int',
    name: 'Random Forest',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'AI & Machine Learning',
    icon: '🌳',
    aliases: ['Random Forest Classifier', 'Bagging Ensembles', 'Ensemble Trees'],
    relatedSkills: ['Decision Trees', 'XGBoost', 'Machine Learning'],
    description: 'Ensemble learning with Bagging: bootstrap aggregation of randomized decision trees, Out-of-Bag (OOB) error evaluation, and feature importance rankings.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Machine Learning Engineer', 'Data Scientist', 'Predictive Modeler'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 24,
    estimatedTime: '14 Hours',
    learningObjectives: [
      'Explain how bagging reduces model variance without increasing bias',
      'Evaluate ensemble generalization using Out-Of-Bag (OOB) score',
      'Tune n_estimators and max_features to balance performance and latency'
    ],
    resources: [
      { id: 'rf-1', title: 'Bootstrap Aggregation & Random Forest Mechanics', type: 'doc', duration: '35 min', completed: false, topic: 'RandomForest' }
    ]
  },
  {
    id: 'xgboost-int',
    name: 'XGBoost',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'AI & Machine Learning',
    icon: '🚀',
    aliases: ['Extreme Gradient Boosting', 'LightGBM', 'Gradient Boosted Trees'],
    relatedSkills: ['Random Forest', 'Scikit-learn', 'Machine Learning'],
    description: 'State-of-the-art gradient boosting for tabular data: sequential residual fitting, second-order Taylor expansion, shrinkage (learning_rate), early stopping, and GPU speedup.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Competitive ML Expert', 'Senior ML Engineer', 'Lead Data Scientist'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 25,
    estimatedTime: '16 Hours',
    learningObjectives: [
      'Understand how gradient boosting trains trees iteratively on residual pseudo-errors',
      'Configure regularization parameters (reg_alpha, reg_lambda) to prevent overfitting',
      'Implement early stopping on validation sets to select optimal iteration counts'
    ],
    resources: [
      { id: 'xgb-1', title: 'Gradient Boosting Theory & Second-Order Tree Splitting', type: 'doc', duration: '40 min', completed: false, topic: 'XGBoost' }
    ]
  },
  {
    id: 'svm-int',
    name: 'SVM',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'AI & Machine Learning',
    icon: '📏',
    aliases: ['Support Vector Machines', 'Kernel Trick', 'SVC'],
    relatedSkills: ['Scikit-learn', 'Machine Learning'],
    description: 'Maximal margin hyperplanes: support vectors, soft margin cost (C parameter), kernel trick (Radial Basis Function RBF, Polynomial), and gamma hyperparameter.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Data Scientist', 'Pattern Recognition Engineer', 'ML Researcher'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 18,
    estimatedTime: '12 Hours',
    learningObjectives: [
      'Formulate maximum margin optimization and understand support vector points',
      'Map non-linearly separable inputs into higher dimensions with RBF kernels',
      'Tune soft-margin penalty C and Gaussian kernel parameter gamma'
    ],
    resources: [
      { id: 'svm-1', title: 'Hyperplane Geometry, Dual Optimization & The Kernel Trick', type: 'doc', duration: '35 min', completed: false, topic: 'SVM' }
    ]
  },
  {
    id: 'knn-int',
    name: 'KNN',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'AI & Machine Learning',
    icon: '📍',
    aliases: ['K-Nearest Neighbors', 'Instance-Based Learning', 'Distance Metrics'],
    relatedSkills: ['Scikit-learn', 'Machine Learning'],
    description: 'Non-parametric distance-based learning: Euclidean and Manhattan distance metrics, choosing k, curse of dimensionality, feature scaling requirement, and KD-Trees.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Data Analyst', 'Junior ML Engineer', 'Data Scientist'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 16,
    estimatedTime: '8 Hours',
    learningObjectives: [
      'Compute distances between feature vectors using Euclidean and Manhattan norms',
      'Select optimal k using cross-validation to balance noise sensitivity vs bias',
      'Explain why feature scaling (StandardScaler) is mandatory before running KNN'
    ],
    resources: [
      { id: 'knn-1', title: 'Distance Metrics, Voting Rules & KD-Tree Accelerations', type: 'doc', duration: '30 min', completed: false, topic: 'KNN' }
    ]
  },
  {
    id: 'model-selection-int',
    name: 'Model Selection',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'AI & Machine Learning',
    icon: '🎯',
    aliases: ['Algorithm Benchmarking', 'Model Comparison', 'Bias-Variance Tradeoff'],
    relatedSkills: ['Scikit-learn', 'Cross Validation', 'Machine Learning'],
    description: 'Comparing predictive models: benchmarking multiple algorithms on identical folds, analyzing bias-variance trade-offs, learning curves, and selecting production candidates.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Lead Data Scientist', 'ML Architect', 'AI Solutions Engineer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 20,
    estimatedTime: '10 Hours',
    learningObjectives: [
      'Diagnose high bias vs high variance using training and validation learning curves',
      'Benchmark diverse model families (linear, tree-based, kernel, ensemble) systematically',
      'Balance prediction accuracy against inference latency and operational memory footprint'
    ],
    resources: [
      { id: 'ms-1', title: 'Learning Curves & The Bias-Variance Tradeoff in Production', type: 'doc', duration: '30 min', completed: false, topic: 'Selection' }
    ]
  },
  {
    id: 'cross-validation-int',
    name: 'Cross Validation',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'AI & Machine Learning',
    icon: '🔄',
    aliases: ['K-Fold Cross Validation', 'Stratified K-Fold', 'TimeSeriesSplit'],
    relatedSkills: ['Model Selection', 'Scikit-learn', 'Machine Learning'],
    description: 'Rigorous statistical validation: K-Fold CV, Stratified K-Fold for class imbalance, TimeSeriesSplit to prevent lookahead data leakage, and repeated cross-validation.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Data Scientist', 'ML Quality Engineer', 'Predictive Analyst'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 22,
    estimatedTime: '10 Hours',
    learningObjectives: [
      'Partition training records across K folds to obtain unbiased variance metrics',
      'Preserve target class distributions across folds using StratifiedKFold',
      'Validate time-series models without future data leakage with TimeSeriesSplit'
    ],
    resources: [
      { id: 'cvd-1', title: 'Stratified & Time-Series Cross Validation Protocols', type: 'doc', duration: '30 min', completed: false, topic: 'CrossVal' }
    ]
  },
  {
    id: 'hyperparameter-tuning-int',
    name: 'Hyperparameter Tuning',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'AI & Machine Learning',
    icon: '🎛️',
    aliases: ['GridSearchCV', 'RandomizedSearchCV', 'Optuna', 'Bayesian Optimization'],
    relatedSkills: ['Scikit-learn', 'Cross Validation', 'Machine Learning'],
    description: 'Systematic parameter search: exhaustive GridSearchCV, randomized distributions (RandomizedSearchCV), Bayesian optimization (Optuna), and early stopping.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Machine Learning Engineer', 'Data Scientist', 'AI Researcher'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 24,
    estimatedTime: '12 Hours',
    learningObjectives: [
      'Execute multi-parameter grid searches across cross-validation splits',
      'Sample continuous parameter probability distributions using RandomizedSearchCV',
      'Optimize complex objective functions with Optuna Bayesian TPE samplers'
    ],
    resources: [
      { id: 'hpt-1', title: 'GridSearch vs RandomSearch vs Bayesian Optuna', type: 'doc', duration: '35 min', completed: false, topic: 'Tuning' }
    ]
  },
  {
    id: 'ml-pipelines-int',
    name: 'ML Pipelines',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'AI & Machine Learning',
    icon: '🏭',
    aliases: ['scikit-learn Pipeline', 'FeatureUnion', 'Automated ML Workflow'],
    relatedSkills: ['Scikit-learn', 'Feature Engineering', 'Data Preprocessing'],
    description: 'Leak-free production machine learning workflows: chaining preprocessing transformers and final estimators in Pipeline objects, custom transformers, and column routing.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['MLOps Engineer', 'Machine Learning Engineer', 'Data Platform Developer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 23,
    estimatedTime: '14 Hours',
    learningObjectives: [
      'Prevent data leakage between train/test partitions using Pipeline encapsulation',
      'Route heterogeneous text, categorical, and numerical features via ColumnTransformer',
      'Write custom BaseEstimator and TransformerMixin classes'
    ],
    resources: [
      { id: 'mlp-1', title: 'ColumnTransformer & Custom scikit-learn Pipeline Construction', type: 'doc', duration: '35 min', completed: false, topic: 'Pipelines' }
    ]
  },
  {
    id: 'feature-selection-int',
    name: 'Feature Selection',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'AI & Machine Learning',
    icon: '✂️',
    aliases: ['Dimensionality Reduction', 'RFE', 'Variance Threshold', 'SelectKBest'],
    relatedSkills: ['Feature Engineering', 'Scikit-learn', 'Machine Learning'],
    description: 'Reducing feature space: filter methods (VarianceThreshold, mutual_info_classif), wrapper methods (Recursive Feature Elimination RFE), and embedded L1 Lasso feature selection.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Data Scientist', 'Machine Learning Engineer', 'Quantitative Analyst'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 19,
    estimatedTime: '10 Hours',
    learningObjectives: [
      'Filter out zero-variance and quasi-constant uninformative columns',
      'Prune correlated feature subsets using Recursive Feature Elimination (RFE)',
      'Rank feature importance scores against validation performance curves'
    ],
    resources: [
      { id: 'fs-1', title: 'Filter, Wrapper & Embedded Feature Selection Methods', type: 'doc', duration: '30 min', completed: false, topic: 'Selection' }
    ]
  },

  // --- DEEP LEARNING INTERMEDIATE ---
  {
    id: 'tensorflow-int',
    name: 'TensorFlow',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'AI & Machine Learning',
    icon: '🟧',
    aliases: ['TF', 'TensorFlow 2', 'Google TensorFlow'],
    relatedSkills: ['Keras', 'Neural Networks', 'Deep Learning'],
    description: 'Google deep learning ecosystem: tf.data input pipelines, computation graphs, automatic differentiation (GradientTape), layer subclassing, and TensorBoard visualization.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Deep Learning Engineer', 'Computer Vision Developer', 'AI Specialist'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 22,
    estimatedTime: '16 Hours',
    learningObjectives: [
      'Build performant GPU data streaming pipelines using tf.data.Dataset',
      'Calculate custom forward and backward passes using tf.GradientTape',
      'Monitor loss, accuracy, and layer weights visually in TensorBoard'
    ],
    resources: [
      { id: 'tf-1', title: 'TensorFlow 2 Tensors, GradientTape & tf.data Pipelines', type: 'doc', duration: '35 min', completed: false, topic: 'TensorFlow' }
    ]
  },
  {
    id: 'keras-int',
    name: 'Keras',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'AI & Machine Learning',
    icon: '🔴',
    aliases: ['Keras Core', 'High Level Deep Learning', 'tf.keras'],
    relatedSkills: ['TensorFlow', 'Neural Networks'],
    description: 'High-level deep learning API: Sequential vs Functional API models, built-in layers (Dense, Dropout, Conv2D), callbacks (EarlyStopping, ModelCheckpoint), and compile/fit lifecycle.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['AI Developer', 'Deep Learning Engineer', 'Data Scientist'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 21,
    estimatedTime: '14 Hours',
    learningObjectives: [
      'Construct multi-input and multi-output architectures with Keras Functional API',
      'Prevent overfitting using Dropout and BatchNormalization layers',
      'Save best model weights automatically with ModelCheckpoint callbacks'
    ],
    resources: [
      { id: 'ker-1', title: 'Keras Sequential & Functional APIs with Callbacks', type: 'doc', duration: '30 min', completed: false, topic: 'Keras' }
    ]
  },
  {
    id: 'pytorch-int',
    name: 'PyTorch',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'AI & Machine Learning',
    icon: '🔥',
    aliases: ['Torch', 'PyTorch DL Framework', 'Autograd'],
    relatedSkills: ['Deep Learning', 'Neural Networks', 'Computer Vision'],
    description: 'Modern research & production deep learning: torch.Tensor operations, autograd automatic differentiation, nn.Module subclassing, Dataset/DataLoader, and custom training loops.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['PyTorch Engineer', 'Deep Learning Researcher', 'AI Engineer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 26,
    estimatedTime: '18 Hours',
    learningObjectives: [
      'Manipulate Tensors on CPU and CUDA GPU devices (tensor.to("cuda"))',
      'Define neural architectures by subclassing torch.nn.Module',
      'Write explicit training loops: forward, loss, loss.backward(), optimizer.step()',
      'Batch and shuffle custom data using Dataset and DataLoader'
    ],
    resources: [
      { id: 'pt-1', title: 'PyTorch Tensors, Autograd & Custom Training Loops', type: 'doc', duration: '40 min', completed: false, topic: 'PyTorch' }
    ]
  },
  {
    id: 'neural-networks-int',
    name: 'Neural Networks',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'AI & Machine Learning',
    icon: '🧠',
    aliases: ['Artificial Neural Networks', 'ANN', 'Multilayer Perceptron', 'Backpropagation'],
    relatedSkills: ['Deep Learning', 'PyTorch', 'TensorFlow'],
    description: 'Foundations of deep learning: artificial neurons, activation functions (ReLU, Sigmoid, Tanh, GELU), loss functions (CrossEntropy, MSE), backpropagation, and SGD/Adam optimizers.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Deep Learning Associate', 'Machine Learning Engineer', 'AI Developer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 24,
    estimatedTime: '16 Hours',
    learningObjectives: [
      'Trace forward pass matrix multiplications (W*x + b) across multi-layer networks',
      'Compute error gradients backwards using chain-rule backpropagation',
      'Compare modern gradient descent optimizers: SGD with momentum, RMSprop, Adam'
    ],
    resources: [
      { id: 'nn-1', title: 'Backpropagation Calculus & Modern Optimizers (Adam/SGD)', type: 'doc', duration: '35 min', completed: false, topic: 'Backprop' }
    ]
  },
  {
    id: 'cnn-int',
    name: 'CNN',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'AI & Machine Learning',
    icon: '🖼️',
    aliases: ['Convolutional Neural Networks', 'ConvNets', 'Computer Vision DL'],
    relatedSkills: ['Computer Vision', 'Deep Learning', 'PyTorch'],
    description: 'Spatial feature extraction for imagery: convolution kernels, strides, padding, pooling layers (MaxPooling), feature map visualizers, and classic architectures (ResNet, VGG).',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Computer Vision Engineer', 'Image Processing Specialist', 'AI Developer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 22,
    estimatedTime: '16 Hours',
    learningObjectives: [
      'Understand spatial filtering with 2D convolution kernels, stride, and padding',
      'Downsample feature maps and induce translation invariance with MaxPooling',
      'Implement residual skip connections to train deep networks without vanishing gradients'
    ],
    resources: [
      { id: 'cnn-1', title: 'Convolutional Kernels, Feature Maps & Residual Skip Connections', type: 'doc', duration: '40 min', completed: false, topic: 'CNN' }
    ]
  },
  {
    id: 'rnn-int',
    name: 'RNN',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'AI & Machine Learning',
    icon: '🔄',
    aliases: ['Recurrent Neural Networks', 'Sequence Modeling', 'Temporal Deep Learning'],
    relatedSkills: ['LSTM', 'Deep Learning', 'NLP'],
    description: 'Sequential time-series and text models: recurrent hidden states, unrolling across time, exploding/vanishing gradient problems, and many-to-one vs many-to-many topologies.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['NLP Engineer', 'Time Series Modeler', 'Deep Learning Engineer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 18,
    estimatedTime: '12 Hours',
    learningObjectives: [
      'Model temporal dependencies with recurrent hidden state transitions',
      'Diagnose vanishing gradients across long unrolled sequential time steps',
      'Design sequence-to-sequence and sequence-to-label network topologies'
    ],
    resources: [
      { id: 'rnn-1', title: 'Recurrent State Updates & Vanishing Gradient Pitfalls', type: 'doc', duration: '30 min', completed: false, topic: 'RNN' }
    ]
  },
  {
    id: 'lstm-int',
    name: 'LSTM',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'AI & Machine Learning',
    icon: '⏱️',
    aliases: ['Long Short-Term Memory', 'GRU', 'Gated Recurrent Units'],
    relatedSkills: ['RNN', 'NLP', 'Deep Learning'],
    description: 'Gated memory cells for long sequences: Forget Gate, Input Gate, Output Gate, cell state highway, Gated Recurrent Units (GRU), and bidirectional recurrent layers.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['NLP Specialist', 'Quantitative Modeler', 'Deep Learning Engineer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 19,
    estimatedTime: '14 Hours',
    learningObjectives: [
      'Trace memory preservation through LSTM cell states and sigmoid gates',
      'Compare standard LSTM complexity with lightweight Gated Recurrent Units (GRU)',
      'Build bidirectional LSTMs to capture future and past contextual signals'
    ],
    resources: [
      { id: 'lstm-1', title: 'LSTM Cell Gating Architecture: Forget, Input & Output Gates', type: 'doc', duration: '35 min', completed: false, topic: 'LSTM' }
    ]
  },
  {
    id: 'transfer-learning-int',
    name: 'Transfer Learning',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'AI & Machine Learning',
    icon: '📦',
    aliases: ['Pre-trained Models', 'Fine-Tuning Basics', 'Feature Extraction'],
    relatedSkills: ['Deep Learning', 'PyTorch', 'Computer Vision'],
    description: 'Leveraging pretrained neural foundations: freezing backbone weights, replacing classification heads, differential learning rates, and fine-tuning on custom small datasets.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['AI Engineer', 'Deep Learning Specialist', 'Computer Vision Engineer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 22,
    estimatedTime: '12 Hours',
    learningObjectives: [
      'Load state-of-the-art vision models pretrained on ImageNet (ResNet, EfficientNet)',
      'Freeze feature extraction layers and train newly appended classification heads',
      'Unfreeze upper layers with low learning rates for fine-tuning'
    ],
    resources: [
      { id: 'tl-1', title: 'Transfer Learning: Layer Freezing & Differential Learning Rates', type: 'doc', duration: '35 min', completed: false, topic: 'TransferLearning' }
    ]
  },

  // --- AI / GENERATIVE AI INTERMEDIATE ---
  {
    id: 'nlp-int',
    name: 'NLP',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'AI & Machine Learning',
    icon: '💬',
    aliases: ['Natural Language Processing', 'Text Analytics', 'NLTK', 'spaCy'],
    relatedSkills: ['Python', 'Deep Learning', 'Generative AI'],
    description: 'Computational linguistics: tokenization, stop-word removal, lemmatization, TF-IDF vectorization, named entity recognition (NER), and sentiment classification.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['NLP Engineer', 'Data Scientist', 'AI Specialist'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 24,
    estimatedTime: '16 Hours',
    learningObjectives: [
      'Extract linguistic features (parts of speech, dependencies, entities) with spaCy',
      'Compute Term Frequency-Inverse Document Frequency (TF-IDF) sparse matrices',
      'Train text classification pipelines for sentiment and category prediction'
    ],
    resources: [
      { id: 'nlp-1', title: 'Tokenization, TF-IDF & Named Entity Recognition Pipelines', type: 'doc', duration: '35 min', completed: false, topic: 'NLP' }
    ]
  },
  {
    id: 'cv-int',
    name: 'Computer Vision',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'AI & Machine Learning',
    icon: '👁️',
    aliases: ['OpenCV', 'Image Processing', 'Visual AI'],
    relatedSkills: ['CNN', 'Deep Learning', 'Python'],
    description: 'Image processing & manipulation: OpenCV image matrices, color space conversions (RGB, HSV, Grayscale), edge detection (Canny), thresholding, and contour detection.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Computer Vision Engineer', 'Robotics Software Developer', 'Image Analyst'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 22,
    estimatedTime: '15 Hours',
    learningObjectives: [
      'Perform color space filtering and morphological transformations with OpenCV',
      'Detect object boundaries using Canny edge detection and Gaussian blurring',
      'Extract bounding boxes and geometric contours from binary mask images'
    ],
    resources: [
      { id: 'cvi-1', title: 'OpenCV Matrix Manipulation, Canny Edges & Contours', type: 'doc', duration: '35 min', completed: false, topic: 'OpenCV' }
    ]
  },
  {
    id: 'transformers-int',
    name: 'Transformers',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'AI & Machine Learning',
    icon: '⚡',
    aliases: ['Attention Is All You Need', 'Self-Attention', 'Transformer Models'],
    relatedSkills: ['NLP', 'Deep Learning', 'PyTorch'],
    description: 'Transformer architecture: Scaled Dot-Product Attention, Queries/Keys/Values (Q, K, V), Multi-Head Attention, positional encodings, and encoder-decoder stacks.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['NLP Engineer', 'Generative AI Developer', 'Deep Learning Researcher'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 26,
    estimatedTime: '18 Hours',
    learningObjectives: [
      'Calculate Scaled Dot-Product Attention matrices: softmax(Q*K^T / sqrt(d_k)) * V',
      'Explain Multi-Head Attention capturing diverse semantic subspaces simultaneously',
      'Understand sinusoidal positional encodings providing sequence order without recurrence'
    ],
    resources: [
      { id: 'trf-1', title: 'Self-Attention Mechanics: Scaled Dot-Product & Multi-Head Attention', type: 'doc', duration: '40 min', completed: false, topic: 'Attention' }
    ]
  },
  {
    id: 'hugging-face-int',
    name: 'Hugging Face',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'AI & Machine Learning',
    icon: '🤗',
    aliases: ['HuggingFace Transformers', 'HF Hub', 'Datasets'],
    relatedSkills: ['Transformers', 'NLP', 'Python'],
    description: 'Hugging Face ecosystem: AutoTokenizer, AutoModelForSequenceClassification, pipeline abstraction, model loading from Hugging Face Hub, and Trainer API.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Generative AI Engineer', 'NLP Developer', 'AI Application Builder'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 25,
    estimatedTime: '14 Hours',
    learningObjectives: [
      'Tokenize multi-sentence inputs using pretrained tokenizers with padding and truncation',
      'Download and run inference with thousands of open-source models using pipeline()',
      'Fine-tune classification heads using Hugging Face Trainer and evaluate metrics'
    ],
    resources: [
      { id: 'hf-1', title: 'AutoModel & AutoTokenizer Pipelines in Hugging Face', type: 'doc', duration: '35 min', completed: false, topic: 'HuggingFace' }
    ]
  },
  {
    id: 'llm-fundamentals-int',
    name: 'LLM Fundamentals',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'AI & Machine Learning',
    icon: '🤖',
    aliases: ['Large Language Models', 'Next Token Prediction', 'Context Windows'],
    relatedSkills: ['Transformers', 'Prompt Engineering', 'Generative AI'],
    description: 'Generative language models: causal autoregressive next-token generation, temperature and top-p sampling, token economics, context window limits, and hallucination risks.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Generative AI Developer', 'AI Solutions Architect', 'Full Stack AI Developer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 28,
    estimatedTime: '12 Hours',
    learningObjectives: [
      'Explain autoregressive token prediction and probability distributions over vocabularies',
      'Tune sampling hyperparameters: Temperature (creativity) vs Top-P (nucleus sampling)',
      'Calculate token footprints and manage prompt context window constraints'
    ],
    resources: [
      { id: 'llm-1', title: 'Next-Token Generation, Temperature Sampling & Token Economics', type: 'doc', duration: '35 min', completed: false, topic: 'LLMs' }
    ]
  },
  {
    id: 'prompt-engineering-int',
    name: 'Prompt Engineering',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'AI & Machine Learning',
    icon: '✨',
    aliases: ['In-Context Learning', 'Few-Shot Prompting', 'Chain of Thought'],
    relatedSkills: ['LLM Fundamentals', 'RAG', 'AI API Integration'],
    description: 'Steering Foundation Models: zero-shot vs few-shot prompting, system message constraints, Chain-of-Thought (CoT) reasoning, structured JSON outputs, and guardrails.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['AI Prompt Engineer', 'Full Stack AI Developer', 'Product Designer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 24,
    estimatedTime: '10 Hours',
    learningObjectives: [
      'Structure prompts with explicit role instructions, context, input, and format rules',
      'Trigger multi-step deductive reasoning using Chain-of-Thought (CoT) examples',
      'Force strict JSON schema compliant responses from OpenAI and Gemini models'
    ],
    resources: [
      { id: 'pe-1', title: 'Chain-of-Thought, Few-Shot Demonstrations & JSON Mode', type: 'doc', duration: '30 min', completed: false, topic: 'Prompting' }
    ]
  },
  {
    id: 'rag-int',
    name: 'RAG',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'AI & Machine Learning',
    icon: '📚',
    aliases: ['Retrieval-Augmented Generation', 'Document Question Answering'],
    relatedSkills: ['Embeddings', 'Vector Databases', 'Prompt Engineering'],
    description: 'Grounding LLMs with private data: document chunking strategies, embedding generation, vector similarity search, context injection, and answer synthesis.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['AI Engineer', 'RAG Specialist', 'Enterprise AI Architect'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 26,
    estimatedTime: '15 Hours',
    learningObjectives: [
      'Split PDF and markdown documents into semantically coherent overlapping chunks',
      'Generate dense text embeddings using OpenAI or Hugging Face models',
      'Retrieve top-K matching chunks and synthesize grounded answers with citations'
    ],
    resources: [
      { id: 'rag-1', title: 'Document Chunking, Vector Retrieval & Synthesis Pipelines', type: 'doc', duration: '35 min', completed: false, topic: 'RAG' }
    ]
  },
  {
    id: 'embeddings-int',
    name: 'Embeddings',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'AI & Machine Learning',
    icon: '🧭',
    aliases: ['Dense Vectors', 'Vector Representations', 'Cosine Similarity'],
    relatedSkills: ['RAG', 'Vector Databases', 'NLP'],
    description: 'High-dimensional semantic spaces: dense vector representation of text/code, cosine similarity vs dot product, cross-encoder ranking, and semantic clustering.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Search Engineer', 'Machine Learning Engineer', 'AI Developer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 22,
    estimatedTime: '10 Hours',
    learningObjectives: [
      'Generate and store 768 / 1536 dimensional semantic dense vector embeddings',
      'Compute cosine similarity metrics between user queries and stored documents',
      'Identify semantic clusters and semantic duplicates in large text corpora'
    ],
    resources: [
      { id: 'emb-1', title: 'Semantic Vectors, Cosine Distance & Normalization', type: 'doc', duration: '30 min', completed: false, topic: 'Embeddings' }
    ]
  },
  {
    id: 'vector-dbs-int',
    name: 'Vector Databases',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'AI & Machine Learning',
    icon: '🗄️',
    aliases: ['ChromaDB', 'Pinecone', 'Milvus', 'Qdrant', 'Vector Search DB'],
    relatedSkills: ['Embeddings', 'RAG', 'Databases'],
    description: 'Storage for vector embeddings: approximate nearest neighbor (ANN) search, HNSW indexing algorithms, metadata filtering, ChromaDB, and Pinecone operations.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['AI Systems Engineer', 'Data Engineer', 'Backend AI Developer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 24,
    estimatedTime: '12 Hours',
    learningObjectives: [
      'Set up and query local embedded ChromaDB and cloud-managed Pinecone databases',
      'Perform hybrid queries filtering by metadata (tags, user_id) alongside vector distances',
      'Understand Hierarchical Navigable Small World (HNSW) graph indexing trade-offs'
    ],
    resources: [
      { id: 'vdb-1', title: 'HNSW Indexing & Hybrid Metadata Filtering in Vector DBs', type: 'doc', duration: '35 min', completed: false, topic: 'VectorDB' }
    ]
  },
  {
    id: 'ai-api-integration-int',
    name: 'AI API Integration',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'AI & Machine Learning',
    icon: '🔌',
    aliases: ['OpenAI SDK', 'Google Gemini API', 'Anthropic API', 'AI SDK'],
    relatedSkills: ['Web Development', 'Backend Development', 'Prompt Engineering'],
    description: 'Calling frontier AI models in software: streaming responses (SSE), structured schema generation, tool/function calling definitions, and rate-limit backoffs.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Full Stack AI Developer', 'Product Engineer', 'Backend Developer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 26,
    estimatedTime: '12 Hours',
    learningObjectives: [
      'Stream real-time LLM token responses to frontend clients using Server-Sent Events',
      'Define JSON schema tool definitions for automated model function execution',
      'Implement defensive token-bucket rate limiters and multi-provider fallbacks'
    ],
    resources: [
      { id: 'aai-1', title: 'Streaming Responses, Tool Calling & Multi-Provider Fallbacks', type: 'doc', duration: '35 min', completed: false, topic: 'AIAPI' }
    ]
  },

  // --- CLOUD INTERMEDIATE ---
  {
    id: 'aws-int',
    name: 'AWS',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Cloud & DevOps',
    icon: '🔶',
    aliases: ['Amazon Web Services', 'AWS Cloud Services'],
    relatedSkills: ['Cloud & DevOps', 'EC2', 'S3', 'Lambda'],
    description: 'Amazon Web Services development: VPC subnetting, security groups, route tables, application load balancers (ALB), autoscaling groups, and CloudFormation/SAM.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['AWS Cloud Engineer', 'DevOps Engineer', 'Backend Developer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 28,
    estimatedTime: '18 Hours',
    learningObjectives: [
      'Design public and private subnets inside a custom Virtual Private Cloud (VPC)',
      'Route external internet traffic through Internet Gateways and NAT Gateways',
      'Configure Application Load Balancers (ALB) across multi-AZ target groups'
    ],
    resources: [
      { id: 'aws-1', title: 'VPC Architecture, Subnetting & Application Load Balancers', type: 'doc', duration: '40 min', completed: false, topic: 'VPC' }
    ]
  },
  {
    id: 'ec2-int',
    name: 'EC2',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Cloud & DevOps',
    icon: '🖥️',
    aliases: ['Amazon EC2', 'Virtual Machines in Cloud', 'EBS Volumes'],
    relatedSkills: ['AWS', 'Linux Administration'],
    description: 'Elastic Compute Cloud: instance types (compute, memory, general), EBS storage volumes, security group stateful rules, user data bootstrap scripts, and SSH tunneling.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Cloud Operations Engineer', 'DevOps Engineer', 'Infrastructure Specialist'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 22,
    estimatedTime: '12 Hours',
    learningObjectives: [
      'Select cost-optimal EC2 instance families (t3, c6i, m6i) for varied workloads',
      'Automate server initialization using bash user-data bootstrap scripts',
      'Manage Elastic Block Store (EBS) volume attachment, resizing, and snapshots'
    ],
    resources: [
      { id: 'ec2-1', title: 'EC2 Instance Lifecycle, Security Groups & User Data Scripts', type: 'doc', duration: '35 min', completed: false, topic: 'EC2' }
    ]
  },
  {
    id: 's3-int',
    name: 'S3',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Cloud & DevOps',
    icon: '🪣',
    aliases: ['Amazon S3', 'Object Storage', 'S3 Bucket Policies'],
    relatedSkills: ['AWS', 'Cloud Storage'],
    description: 'Simple Storage Service: bucket security policies, CORS configuration, presigned URLs for direct browser uploads, storage tiers (Standard, Glacier), and lifecycle rules.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Cloud Engineer', 'Backend Developer', 'Data Platform Engineer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 22,
    estimatedTime: '10 Hours',
    learningObjectives: [
      'Write least-privilege JSON S3 bucket policies and configure Block Public Access',
      'Generate secure presigned URLs to allow direct client-to-S3 uploads',
      'Configure lifecycle transition rules to archive stale objects into S3 Glacier'
    ],
    resources: [
      { id: 's3-1', title: 'S3 Security Policies, Presigned URLs & Glacier Lifecycles', type: 'doc', duration: '30 min', completed: false, topic: 'S3' }
    ]
  },
  {
    id: 'lambda-int',
    name: 'Lambda',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Cloud & DevOps',
    icon: '⚡',
    aliases: ['AWS Lambda', 'Serverless Functions', 'Event-Driven Compute'],
    relatedSkills: ['AWS', 'Serverless Architecture', 'Node.js'],
    description: 'Serverless compute: event sources (S3 triggers, API Gateway, SQS queues), execution environment cold starts, IAM execution roles, memory limits, and Lambda layers.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Serverless Developer', 'Cloud Engineer', 'Backend Developer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 24,
    estimatedTime: '12 Hours',
    learningObjectives: [
      'Write event-driven Lambda handler functions triggered by S3 and HTTP events',
      'Mitigate serverless cold-start latency using provisioned concurrency and light runtimes',
      'Package shared library dependencies cleanly using AWS Lambda Layers'
    ],
    resources: [
      { id: 'lmb-1', title: 'AWS Lambda Handlers, Event Triggers & Cold-Start Optimization', type: 'doc', duration: '35 min', completed: false, topic: 'Lambda' }
    ]
  },
  {
    id: 'iam-int',
    name: 'IAM',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Cloud & DevOps',
    icon: '🛡️',
    aliases: ['AWS IAM', 'Identity and Access Management', 'IAM Roles and Policies'],
    relatedSkills: ['AWS', 'Cloud Security'],
    description: 'Cloud identity and governance: IAM Users, Groups, Roles, Policies (Allow/Deny, Resource, Condition keys), instance profiles for EC2, and temporary STS credentials.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Cloud Security Engineer', 'DevOps Specialist', 'AWS Solutions Architect'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 22,
    estimatedTime: '12 Hours',
    learningObjectives: [
      'Construct granular JSON IAM policies following strict least-privilege standards',
      'Attach IAM Roles to EC2 and Lambda to eliminate hardcoded secret credentials',
      'Assume cross-account IAM roles via AWS Security Token Service (STS)'
    ],
    resources: [
      { id: 'iam-1', title: 'Least-Privilege JSON Policies, Roles & STS Token Exchanges', type: 'doc', duration: '35 min', completed: false, topic: 'IAM' }
    ]
  },
  {
    id: 'rds-int',
    name: 'RDS',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Cloud & DevOps',
    icon: '🗄️',
    aliases: ['Amazon RDS', 'Relational Database Service', 'Multi-AZ Databases'],
    relatedSkills: ['AWS', 'PostgreSQL', 'MySQL'],
    description: 'Managed relational cloud databases: automated backups, snapshots, Multi-AZ high availability failover, Read Replicas for horizontal read scaling, and parameter groups.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Database Administrator', 'Cloud Engineer', 'Backend Developer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 20,
    estimatedTime: '10 Hours',
    learningObjectives: [
      'Provision Multi-AZ RDS PostgreSQL/MySQL clusters with automatic synchronous standby',
      'Scale read-heavy query traffic across asynchronous Read Replicas',
      'Perform point-in-time recovery using automated daily snapshots'
    ],
    resources: [
      { id: 'rds-1', title: 'Multi-AZ RDS Failover & Read Replica Topologies', type: 'doc', duration: '30 min', completed: false, topic: 'RDS' }
    ]
  },
  {
    id: 'cloudwatch-int',
    name: 'CloudWatch',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Cloud & DevOps',
    icon: '⏱️',
    aliases: ['AWS CloudWatch', 'CloudWatch Alarms', 'CloudWatch Logs'],
    relatedSkills: ['AWS', 'DevOps', 'Observability'],
    description: 'AWS monitoring and observability: collecting metrics (CPUUtilization, NetworkIn), structured JSON log groups, metric alarms with SNS email alerts, and dashboards.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['DevOps Engineer', 'Site Reliability Engineer', 'Cloud Support Specialist'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 19,
    estimatedTime: '10 Hours',
    learningObjectives: [
      'Stream application logs to CloudWatch Log Groups via the CloudWatch agent',
      'Create metric alarms triggering automated EC2 autoscaling or SNS paging alerts',
      'Assemble operational dashboards displaying real-time infrastructure telemetry'
    ],
    resources: [
      { id: 'cw-1', title: 'Metric Alarms, SNS Notifications & Log Group Filters', type: 'doc', duration: '30 min', completed: false, topic: 'CloudWatch' }
    ]
  },
  {
    id: 'azure-int',
    name: 'Azure',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Cloud & DevOps',
    icon: '🔷',
    aliases: ['Microsoft Azure Production', 'Azure Cloud'],
    relatedSkills: ['Cloud & DevOps', 'Azure Fundamentals'],
    description: 'Microsoft Azure enterprise architecture: Azure App Services, Azure SQL Database, Azure Functions serverless, Virtual Network peering, and Azure DevOps integration.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Azure Cloud Engineer', 'Enterprise Systems Engineer', 'DevOps Specialist'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 22,
    estimatedTime: '16 Hours',
    learningObjectives: [
      'Deploy containerized web services onto fully managed Azure App Services',
      'Configure Virtual Network (VNet) peering for secure private cloud communication',
      'Build event-driven micro-workflows using Azure Functions and Queue storage'
    ],
    resources: [
      { id: 'az-1', title: 'Azure App Services, VNet Peering & Managed SQL Databases', type: 'doc', duration: '35 min', completed: false, topic: 'Azure' }
    ]
  },
  {
    id: 'gcp-int',
    name: 'Google Cloud',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Cloud & DevOps',
    icon: '🌐',
    aliases: ['Google Cloud Platform', 'GCP', 'GCP Production'],
    relatedSkills: ['Cloud & DevOps', 'Google Cloud Fundamentals'],
    description: 'Google Cloud Platform development: Cloud Run serverless container deployments, Cloud SQL managed databases, Cloud Pub/Sub messaging, and VPC service controls.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['GCP Cloud Engineer', 'Data Platform Developer', 'DevOps Engineer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 20,
    estimatedTime: '15 Hours',
    learningObjectives: [
      'Deploy auto-scaling containerized microservices to Google Cloud Run',
      'Connect secure applications to Cloud SQL instances via the Cloud SQL Auth Proxy',
      'Publish and consume asynchronous event messages using Cloud Pub/Sub'
    ],
    resources: [
      { id: 'gcp-1', title: 'Google Cloud Run Container Deployments & Cloud Pub/Sub', type: 'doc', duration: '35 min', completed: false, topic: 'GCP' }
    ]
  },
  {
    id: 'cloud-deployment-int',
    name: 'Cloud Deployment',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Cloud & DevOps',
    icon: '🚀',
    aliases: ['App Deployment', 'Vercel Deployment', 'Render', 'Production Hosting'],
    relatedSkills: ['Cloud & DevOps', 'Web Development'],
    description: 'Deploying production software: PaaS deployment platforms (Vercel, Render, Railway), custom DNS domains, SSL/TLS certificate automation, and environment secret injection.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Full Stack Developer', 'Release Engineer', 'Frontend Engineer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 25,
    estimatedTime: '10 Hours',
    learningObjectives: [
      'Deploy Next.js and React full-stack apps to Vercel with preview channels',
      'Configure custom domain names, CNAME DNS records, and automatic Let’s Encrypt SSL',
      'Manage production environment variables and database credentials safely'
    ],
    resources: [
      { id: 'cld-1', title: 'Production Hosting, DNS Records & Secret Management', type: 'doc', duration: '30 min', completed: false, topic: 'Hosting' }
    ]
  },

  // --- DEVOPS INTERMEDIATE ---
  {
    id: 'docker-int',
    name: 'Docker',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Cloud & DevOps',
    icon: '🐳',
    aliases: ['Docker Compose', 'Container Orchestration Basics', 'Multi-Stage Docker'],
    relatedSkills: ['Docker Basics', 'Linux Basics', 'DevOps'],
    description: 'Production container workflows: multi-stage Docker builds for minimal image size, docker-compose multi-service stacks (web, db, redis), volume mounts, and network bridges.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['DevOps Engineer', 'Software Engineer', 'Backend Developer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 26,
    estimatedTime: '14 Hours',
    learningObjectives: [
      'Write multi-stage Dockerfiles that eliminate dev tooling from final production images',
      'Orchestrate local full-stack environments with docker-compose.yml',
      'Persist database data across container restarts using named Docker Volumes',
      'Isolate inter-container communications using custom Docker bridge networks'
    ],
    resources: [
      { id: 'dki-1', title: 'Multi-Stage Docker Builds & docker-compose Stacks', type: 'doc', duration: '35 min', completed: false, topic: 'Docker' }
    ]
  },
  {
    id: 'k8s-basics-int',
    name: 'Kubernetes Basics',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Cloud & DevOps',
    icon: '☸️',
    aliases: ['K8s Intro', 'Kubernetes Pods & Services'],
    relatedSkills: ['Docker', 'DevOps', 'Cloud & DevOps'],
    description: 'Foundations of Kubernetes cluster orchestration: Pods, ReplicaSets, Deployments (rolling updates, rollbacks), Services (ClusterIP, NodePort, LoadBalancer), and kubectl.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Junior DevOps Engineer', 'Platform Engineer', 'Cloud Associate'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 24,
    estimatedTime: '15 Hours',
    learningObjectives: [
      'Understand the Kubernetes control plane: API Server, etcd, scheduler, kubelet',
      'Declare self-healing application Deployments in YAML and perform rolling updates',
      'Expose container endpoints internally and externally using Kubernetes Services',
      'Inspect pod statuses, logs, and events using the kubectl command line'
    ],
    resources: [
      { id: 'k8sb-1', title: 'Kubernetes Architecture: Pods, Deployments & Services', type: 'doc', duration: '35 min', completed: false, topic: 'K8s' }
    ]
  },
  {
    id: 'github-actions-int',
    name: 'GitHub Actions',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Cloud & DevOps',
    icon: '⚙️',
    aliases: ['GitHub CI/CD', 'Automated Workflows', 'YAML Workflows'],
    relatedSkills: ['Git & GitHub', 'CI/CD', 'DevOps'],
    description: 'Automated software delivery on GitHub: workflow YAML syntax, event triggers (pull_request, push), matrix builds, repository secrets, caching node_modules, and Docker publishing.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['DevOps Engineer', 'Release Engineer', 'Full Stack Developer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 24,
    estimatedTime: '12 Hours',
    learningObjectives: [
      'Write multi-step CI workflows with actions/checkout and actions/setup-node',
      'Run unit tests and linters concurrently across multiple Node/Python versions',
      'Inject sensitive API tokens securely using GitHub Repository Secrets'
    ],
    resources: [
      { id: 'gha-1', title: 'GitHub Actions YAML Syntax, Matrix Builds & Secrets', type: 'doc', duration: '30 min', completed: false, topic: 'Actions' }
    ]
  },
  {
    id: 'cicd-int',
    name: 'CI/CD',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Cloud & DevOps',
    icon: '🔄',
    aliases: ['Continuous Integration Continuous Delivery', 'Automated Deployment Pipelines'],
    relatedSkills: ['GitHub Actions', 'DevOps', 'Docker'],
    description: 'Production release engineering: automated build verification, semantic release tagging, blue-green deployment strategies, canary rollouts, and rollback triggers.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Release Manager', 'DevOps Engineer', 'Site Reliability Engineer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 25,
    estimatedTime: '14 Hours',
    learningObjectives: [
      'Automate semantic version bumping and changelog generation upon merged PRs',
      'Execute zero-downtime Blue-Green and Canary deployment cutovers',
      'Trigger automated pipeline rollbacks when smoke test assertions fail'
    ],
    resources: [
      { id: 'ccd-1', title: 'Zero-Downtime Blue-Green & Canary Deployment Strategies', type: 'doc', duration: '35 min', completed: false, topic: 'CICD' }
    ]
  },
  {
    id: 'nginx-int',
    name: 'Nginx',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Cloud & DevOps',
    icon: '🚦',
    aliases: ['Reverse Proxy Nginx', 'Nginx Web Server', 'Load Balancing Nginx'],
    relatedSkills: ['Linux Administration', 'Web Development', 'DevOps'],
    description: 'High-performance web server & reverse proxy: nginx.conf configuration, reverse proxying (proxy_pass), upstream load balancing algorithms, SSL termination, and rate limiting.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Systems Administrator', 'DevOps Engineer', 'Infrastructure Specialist'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 20,
    estimatedTime: '12 Hours',
    learningObjectives: [
      'Configure Nginx as a reverse proxy passing HTTP traffic to Node/Python servers',
      'Distribute incoming client requests with round-robin and least_conn load balancing',
      'Terminate TLS/SSL certificates and redirect HTTP traffic to secure HTTPS'
    ],
    resources: [
      { id: 'ngx-1', title: 'Reverse Proxying, SSL Termination & Upstream Load Balancing', type: 'doc', duration: '35 min', completed: false, topic: 'Nginx' }
    ]
  },
  {
    id: 'infra-basics-int',
    name: 'Infrastructure Basics',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Cloud & DevOps',
    icon: '🏗️',
    aliases: ['Core Infrastructure', 'Networking in Cloud', 'VPC & Subnets'],
    relatedSkills: ['Cloud Computing Fundamentals', 'DevOps', 'Computer Networks'],
    description: 'Foundations of physical and virtual infrastructure: bare metal vs hypervisors, software-defined networking (SDN), storage area networks (SAN/NAS), and disaster recovery.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Infrastructure Engineer', 'Systems Administrator', 'Cloud Associate'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 18,
    estimatedTime: '10 Hours',
    learningObjectives: [
      'Compare Type-1 bare metal hypervisors (KVM, ESXi) with Type-2 virtualization',
      'Understand software-defined networking (SDN) and overlay virtual networks',
      'Calculate Recovery Time Objective (RTO) and Recovery Point Objective (RPO)'
    ],
    resources: [
      { id: 'inf-1', title: 'Hypervisors, SDN Overlays & Disaster Recovery RTO/RPO', type: 'doc', duration: '30 min', completed: false, topic: 'Infra' }
    ]
  },

  // --- CYBERSECURITY INTERMEDIATE ---
  {
    id: 'ethical-hacking-int',
    name: 'Ethical Hacking',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Cybersecurity',
    icon: '🕵️',
    aliases: ['White Hat Hacking', 'Penetration Testing', 'Kali Linux Basics'],
    relatedSkills: ['Network Security', 'Cybersecurity', 'Web Security'],
    description: 'Ethical offensive security: reconnaissance, OSINT, network scanning (Nmap), vulnerability exploitation (Metasploit), privilege escalation, and responsible disclosure.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Ethical Hacker', 'Penetration Tester', 'Security Consultant'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 22,
    estimatedTime: '16 Hours',
    learningObjectives: [
      'Conduct passive and active target reconnaissance adhering to legal rules of engagement',
      'Perform detailed port scans and OS banner enumeration using Nmap',
      'Validate vulnerabilities using the Metasploit exploitation framework'
    ],
    resources: [
      { id: 'ehk-1', title: 'Reconnaissance, Nmap Port Scanning & Metasploit Framework', type: 'doc', duration: '40 min', completed: false, topic: 'Recon' }
    ]
  },
  {
    id: 'netsec-int',
    name: 'Network Security',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Cybersecurity',
    icon: '🔒',
    aliases: ['Network Defense', 'Wireshark Packet Analysis', 'IDS/IPS'],
    relatedSkills: ['Computer Networks', 'Cybersecurity'],
    description: 'Securing enterprise networks: packet inspection with Wireshark, Intrusion Detection and Prevention Systems (Snort, Suricata), VPN tunnels (IPsec, WireGuard), and 802.1X.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Network Security Engineer', 'SOC Analyst', 'Security Specialist'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 21,
    estimatedTime: '15 Hours',
    learningObjectives: [
      'Capture and inspect TCP/IP packet handshakes and anomalies with Wireshark',
      'Write signature detection rules for Snort/Suricata Intrusion Detection Systems',
      'Establish encrypted point-to-point network tunnels using WireGuard and IPsec'
    ],
    resources: [
      { id: 'nsi-1', title: 'Wireshark Packet Capture & Snort IDS Signature Rules', type: 'doc', duration: '35 min', completed: false, topic: 'Wireshark' }
    ]
  },
  {
    id: 'cryptography-int',
    name: 'Cryptography',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Cybersecurity',
    icon: '🔐',
    aliases: ['Applied Cryptography', 'RSA & AES', 'PKI Architecture'],
    relatedSkills: ['Encryption Basics', 'Cybersecurity'],
    description: 'Applied cryptographic engineering: block cipher modes (AES-GCM for authenticated encryption), asymmetric RSA and Elliptic Curve (ECC), Diffie-Hellman, and PKI.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Cryptographic Engineer', 'Security Architect', 'Blockchain Developer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 19,
    estimatedTime: '15 Hours',
    learningObjectives: [
      'Implement authenticated symmetric encryption with AES-256-GCM',
      'Compare RSA and Elliptic Curve Cryptography (ECC / Ed25519) performance and key sizes',
      'Establish shared secrets across insecure channels with Diffie-Hellman'
    ],
    resources: [
      { id: 'cry-1', title: 'AES-GCM Authenticated Encryption & Elliptic Curve Math', type: 'doc', duration: '35 min', completed: false, topic: 'Crypto' }
    ]
  },
  {
    id: 'web-security-int',
    name: 'Web Security',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Cybersecurity',
    icon: '🛡️',
    aliases: ['AppSec Basics', 'Cross-Site Scripting Mitigation', 'CORS & CSP'],
    relatedSkills: ['OWASP Top 10', 'Web Development'],
    description: 'Securing web applications: Content Security Policy (CSP) headers, CORS preflight mechanisms, protecting against Stored and Reflected XSS, and secure session management.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Application Security Engineer', 'Full Stack Developer', 'Security QA'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 22,
    estimatedTime: '14 Hours',
    learningObjectives: [
      'Draft restrictive Content Security Policies (CSP) preventing arbitrary script execution',
      'Configure CORS headers properly without unsafe wildcard Access-Control-Allow-Origin: *',
      'Sanitize and escape dynamic user inputs to neutralize XSS vulnerabilities'
    ],
    resources: [
      { id: 'ws-1', title: 'Content Security Policy (CSP), CORS & XSS Prevention', type: 'doc', duration: '35 min', completed: false, topic: 'WebSec' }
    ]
  },
  {
    id: 'owasp-top10-int',
    name: 'OWASP Top 10',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Cybersecurity',
    icon: '🚨',
    aliases: ['OWASP Top 10 Vulnerabilities', 'Web Security Risks'],
    relatedSkills: ['Web Security', 'Ethical Hacking', 'Cybersecurity'],
    description: 'Definitive list of critical web vulnerabilities: Broken Access Control, Cryptographic Failures, Injection (SQLi/Command), Insecure Design, Security Misconfiguration, and SSRF.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Application Security Engineer', 'Penetration Tester', 'Full Stack Developer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 25,
    estimatedTime: '16 Hours',
    learningObjectives: [
      'Audit applications systematically against each of the current OWASP Top 10 risks',
      'Remediate Server-Side Request Forgery (SSRF) and Insecure Direct Object References (IDOR)',
      'Enforce parameterized SQL prepared statements to eliminate SQL Injection completely'
    ],
    resources: [
      { id: 'ow10-1', title: 'OWASP Top 10 Deep Dive & Hands-On Vulnerability Remediation', type: 'doc', duration: '40 min', completed: false, topic: 'OWASP10' }
    ]
  },
  {
    id: 'vulnerability-assessment-int',
    name: 'Vulnerability Assessment',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Cybersecurity',
    icon: '🔍',
    aliases: ['VAPT', 'Security Scanning', 'Nessus Vulnerability Scan'],
    relatedSkills: ['Ethical Hacking', 'Cybersecurity'],
    description: 'Automated vulnerability scanning: using Nessus and OpenVAS, analyzing Common Vulnerabilities and Exposures (CVE), CVSS v3.1 severity scoring, and vulnerability reports.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Vulnerability Analyst', 'Security Operations Engineer', 'Auditor'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 19,
    estimatedTime: '12 Hours',
    learningObjectives: [
      'Configure automated vulnerability scans using Nessus / OpenVAS scanners',
      'Calculate and prioritize risk using the Common Vulnerability Scoring System (CVSS)',
      'Generate executive vulnerability assessment remediation roadmaps'
    ],
    resources: [
      { id: 'va-1', title: 'Automated Scanning with Nessus & CVSS Scoring Prioritization', type: 'doc', duration: '35 min', completed: false, topic: 'Scanning' }
    ]
  },
  {
    id: 'pen-testing-basics-int',
    name: 'Penetration Testing Basics',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Cybersecurity',
    icon: '🎯',
    aliases: ['Pen Testing', 'Offensive Security Basics', 'Manual Exploitation'],
    relatedSkills: ['Ethical Hacking', 'OWASP Top 10'],
    description: 'Methodologies of penetration testing: PTES framework, scoping and rules of engagement, pivoting, manual exploitation with Burp Suite, and writing actionable finding reports.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Junior Penetration Tester', 'Security Consultant', 'Red Team Associate'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 20,
    estimatedTime: '16 Hours',
    learningObjectives: [
      'Execute penetration tests adhering to the PTES technical standard guidelines',
      'Intercept and modify live HTTP requests manually using Burp Suite Proxy',
      'Document findings with reproduction steps, business impact, and remediation code'
    ],
    resources: [
      { id: 'ptb-1', title: 'PTES Methodology & Burp Suite Proxy Interception', type: 'doc', duration: '35 min', completed: false, topic: 'PenTest' }
    ]
  },
  {
    id: 'security-testing-int',
    name: 'Security Testing',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Cybersecurity',
    icon: '🧪',
    aliases: ['DAST & SAST', 'Static Code Analysis', 'Dynamic Security Testing'],
    relatedSkills: ['Cybersecurity', 'CI/CD', 'Software Engineering'],
    description: 'Integrating security into automated testing: Static Application Security Testing (SAST with SonarQube), Dynamic Application Security Testing (DAST with OWASP ZAP), and dependency scanning.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['DevSecOps Engineer', 'Security QA Engineer', 'Software Engineer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 22,
    estimatedTime: '14 Hours',
    learningObjectives: [
      'Integrate SAST static analysis scanners into automated pull request workflows',
      'Execute automated DAST vulnerability scans against staging web servers',
      'Detect vulnerable open-source dependencies using npm audit and Snyk'
    ],
    resources: [
      { id: 'st-1', title: 'SAST & DAST Pipeline Integration with SonarQube & ZAP', type: 'doc', duration: '35 min', completed: false, topic: 'SecTesting' }
    ]
  },

  // --- IOT INTERMEDIATE ---
  {
    id: 'arduino-int',
    name: 'Arduino',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'IoT & Embedded',
    icon: '♾️',
    aliases: ['Arduino Uno', 'Arduino C++', 'Physical Computing'],
    relatedSkills: ['Embedded Systems', 'Sensors', 'C Programming'],
    description: 'Microcontroller hardware programming: Arduino C/C++ sketch structure (setup, loop), GPIO digital/analog pins, PWM motor control, serial monitor debugging, and libraries.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['IoT Developer', 'Hardware Engineer', 'Embedded Systems Intern'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 15,
    estimatedTime: '12 Hours',
    learningObjectives: [
      'Program digital I/O pins and analog inputs (analogRead 10-bit ADC)',
      'Generate Pulse Width Modulation (PWM) signals to control LED fading and motor speeds',
      'Interface hardware displays (OLED, LCD) using I2C communication libraries'
    ],
    resources: [
      { id: 'ard-1', title: 'Arduino GPIO Control, PWM & Sensor Interfacing', type: 'doc', duration: '30 min', completed: false, topic: 'Arduino' }
    ]
  },
  {
    id: 'raspberry-pi-int',
    name: 'Raspberry Pi',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'IoT & Embedded',
    icon: '🍓',
    aliases: ['RPi', 'Single Board Computer', 'Raspberry Pi OS'],
    relatedSkills: ['Linux Basics', 'Python', 'Embedded Systems'],
    description: 'Single-board computer engineering: Raspberry Pi OS, headless SSH configuration, controlling hardware pins via Python RPi.GPIO, camera modules, and running edge services.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['IoT Systems Engineer', 'Robotics Engineer', 'Edge Developer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 16,
    estimatedTime: '12 Hours',
    learningObjectives: [
      'Configure headless Raspberry Pi installations with SSH and static IP networking',
      'Control physical sensors and relays using Python gpiozero and RPi.GPIO',
      'Deploy camera modules and stream video feeds using OpenCV on Linux'
    ],
    resources: [
      { id: 'rpi-1', title: 'Raspberry Pi Headless Setup & GPIO Python Scripting', type: 'doc', duration: '30 min', completed: false, topic: 'RPi' }
    ]
  },
  {
    id: 'esp32-int',
    name: 'ESP32',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'IoT & Embedded',
    icon: '📡',
    aliases: ['ESP8266', 'WiFi Bluetooth Microcontroller', 'ESP-IDF'],
    relatedSkills: ['Embedded Systems', 'IoT Networking', 'C++'],
    description: 'Wi-Fi & Bluetooth microcontroller: dual-core Xtensa processor, deep sleep power management, connecting to Wi-Fi access points, Bluetooth Low Energy (BLE), and OTA updates.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Firmware Engineer', 'IoT Developer', 'Hardware Designer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 18,
    estimatedTime: '14 Hours',
    learningObjectives: [
      'Connect ESP32 microcontrollers securely to WPA2/WPA3 Wi-Fi networks',
      'Broadcast environmental sensor beacons using Bluetooth Low Energy (BLE)',
      'Optimize battery lifespans with ultra-low power deep sleep wake cycles'
    ],
    resources: [
      { id: 'esp-1', title: 'ESP32 Wi-Fi Connectivity, Deep Sleep & BLE Advertising', type: 'doc', duration: '35 min', completed: false, topic: 'ESP32' }
    ]
  },
  {
    id: 'mqtt-int',
    name: 'MQTT',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'IoT & Embedded',
    icon: '📻',
    aliases: ['MQTT Protocol', 'Mosquitto', 'PubSub IoT Protocol'],
    relatedSkills: ['IoT Networking', 'Embedded Systems'],
    description: 'Lightweight machine-to-machine publish/subscribe protocol: topic hierarchies, QoS delivery levels (0, 1, 2), Mosquitto broker setup, retained messages, and Last Will and Testament.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['IoT Architect', 'Telemetry Engineer', 'Embedded Developer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 17,
    estimatedTime: '10 Hours',
    learningObjectives: [
      'Structure clean hierarchical MQTT topics with single and multi-level wildcards',
      'Select appropriate Quality of Service levels (QoS 0, 1, 2) balancing bandwidth and reliability',
      'Configure Last Will and Testament (LWT) messages for ungraceful disconnect alerts'
    ],
    resources: [
      { id: 'mqt-1', title: 'MQTT Broker Architecture, QoS Levels & Topic Design', type: 'doc', duration: '30 min', completed: false, topic: 'MQTT' }
    ]
  },
  {
    id: 'sensors-int',
    name: 'Sensors',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'IoT & Embedded',
    icon: '🌡️',
    aliases: ['Sensor Interfacing', 'I2C and SPI', 'Analog and Digital Sensors'],
    relatedSkills: ['Embedded Systems', 'Arduino', 'ESP32'],
    description: 'Hardware transducer engineering: digital bus protocols (I2C address arbitration, SPI master-slave lines, UART), analog calibration, noise filtering, and actuator drivers.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Hardware Engineer', 'Instrumentation Engineer', 'IoT Developer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 16,
    estimatedTime: '12 Hours',
    learningObjectives: [
      'Communicate with multiple digital peripheral sensors over 2-wire I2C buses',
      'Achieve high-speed synchronous data transfers using 4-wire SPI buses',
      'Filter analog sensor jitter and electrical noise with moving average filters'
    ],
    resources: [
      { id: 'sns-1', title: 'I2C vs SPI Bus Protocols & Analog Noise Filtering', type: 'doc', duration: '35 min', completed: false, topic: 'Sensors' }
    ]
  },
  {
    id: 'embedded-systems-int',
    name: 'Embedded Systems',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'IoT & Embedded',
    icon: '🔌',
    aliases: ['Microcontroller Programming', 'Firmware Development', 'Bare Metal C'],
    relatedSkills: ['C Programming', 'Operating Systems', 'Sensors'],
    description: 'Firmware design: bare-metal register manipulation, memory-mapped I/O, interrupt service routines (ISR), hardware timers, watchdogs, and low-level debugging.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Firmware Engineer', 'Embedded Software Developer', 'Robotics Engineer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 18,
    estimatedTime: '16 Hours',
    learningObjectives: [
      'Read and write hardware registers directly via memory-mapped I/O pointers',
      'Write safe, non-blocking Interrupt Service Routines (ISRs) using volatile flags',
      'Configure hardware watchdog timers to reset hung microcontroller states'
    ],
    resources: [
      { id: 'emb-1', title: 'Memory-Mapped I/O, Interrupt Service Routines & Watchdogs', type: 'doc', duration: '35 min', completed: false, topic: 'Embedded' }
    ]
  },
  {
    id: 'iot-networking-int',
    name: 'IoT Networking',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'IoT & Embedded',
    icon: '🌐',
    aliases: ['BLE', 'Zigbee', 'LoRaWAN', 'Wireless Sensor Networks'],
    relatedSkills: ['Computer Networks', 'MQTT', 'Embedded Systems'],
    description: 'Wireless sensor protocols: Bluetooth Low Energy (GATT services and characteristics), Zigbee mesh topologies, LoRaWAN long-range low-power radio, and cellular IoT (NB-IoT).',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['IoT Network Engineer', 'Telecommunications Specialist', 'Field Systems Developer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 15,
    estimatedTime: '14 Hours',
    learningObjectives: [
      'Model Bluetooth Low Energy GATT Server profiles, services, and characteristics',
      'Deploy long-range kilometer-scale telemetry using LoRaWAN gateway architectures',
      'Compare power-budget vs data-bandwidth trade-offs across BLE, Zigbee, and Wi-Fi'
    ],
    resources: [
      { id: 'itn-1', title: 'BLE GATT Profiles vs LoRaWAN Long-Range Transmissions', type: 'doc', duration: '35 min', completed: false, topic: 'Wireless' }
    ]
  }
];
