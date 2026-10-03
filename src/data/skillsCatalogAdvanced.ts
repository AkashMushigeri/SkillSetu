import type { SkillItem } from './skillsData';

export const EXPANDED_ADVANCED_SKILLS: SkillItem[] = [
  // ==========================================
  // --- SOFTWARE ENGINEERING & ARCHITECTURE ---
  // ==========================================
  {
    id: 'system-design-adv',
    name: 'System Design',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Software Architecture',
    icon: '🏗️',
    aliases: ['High-Level Design', 'HLD', 'Scalable Architecture', 'System Architecture'],
    relatedSkills: ['Distributed Systems', 'Microservices', 'Database Architecture', 'Scalability'],
    description: 'Design massive, fault-tolerant, and highly available web architectures: capacity estimation, trade-off analysis (CAP theorem), load balancing, caching tiers, and data partitioning.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Principal Architect', 'Staff Software Engineer', 'Lead Backend Engineer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 52,
    estimatedTime: '36 Hours',
    learningObjectives: [
      'Perform back-of-the-envelope calculations for throughput, storage, and latency constraints',
      'Architect resilient systems applying CAP theorem, PACELC, and graceful degradation',
      'Design distributed caching hierarchies (CDN, Redis cluster, write-through/write-back)',
      'Design real-world systems like URL shorteners, distributed rate limiters, and video streaming feeds'
    ],
    resources: [
      { id: 'sd-1', title: 'System Design Interview Blueprint', type: 'doc', duration: '50 min', completed: false, topic: 'Fundamentals' },
      { id: 'sd-2', title: 'Designing Distributed Rate Limiters', type: 'practice', duration: '60 min', completed: false, topic: 'Rate Limiting' }
    ]
  },
  {
    id: 'distributed-systems-adv',
    name: 'Distributed Systems',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Software Architecture',
    icon: '🌐',
    aliases: ['Distributed Computing', 'Consensus Algorithms', 'Raft Paxos'],
    relatedSkills: ['System Design', 'Microservices', 'Event-Driven Architecture', 'Distributed Databases'],
    description: 'Deep dive into decentralized state, distributed consensus (Raft, Paxos), vector clocks, leader election, split-brain mitigation, and distributed transactions (2PC, Saga).',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Distributed Systems Engineer', 'Cloud Infrastructure Architect', 'Senior Backend Engineer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 44,
    estimatedTime: '40 Hours',
    learningObjectives: [
      'Understand consensus protocols including Raft leader election and log replication',
      'Implement distributed locking mechanisms using Redis Redlock and ZooKeeper/etcd',
      'Manage eventual consistency, vector clocks, and conflict-free replicated data types (CRDTs)',
      'Orchestrate distributed transactions using the Saga pattern and compensating actions'
    ],
    resources: [
      { id: 'ds-1', title: 'Distributed Consensus: Raft Protocol in Depth', type: 'video', duration: '45 min', completed: false, topic: 'Consensus' },
      { id: 'ds-2', title: 'Implementing the Saga Pattern with Outbox', type: 'practice', duration: '60 min', completed: false, topic: 'Transactions' }
    ]
  },
  {
    id: 'microservices-adv',
    name: 'Microservices',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Software Architecture',
    icon: '🧩',
    aliases: ['Microservice Architecture', 'Microservices Design', 'Service Decomposition'],
    relatedSkills: ['System Design', 'Docker', 'Kubernetes', 'API Gateway', 'gRPC'],
    description: 'Decoupling monolithic platforms into independently deployable, loosely coupled microservices with domain boundaries, service discovery, and circuit breakers.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Cloud Architect', 'Senior Backend Engineer', 'Enterprise Solutions Architect'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 48,
    estimatedTime: '32 Hours',
    learningObjectives: [
      'Decompose monoliths using the Strangler Fig pattern and bounded contexts',
      'Configure service discovery, client-side load balancing, and API gateways',
      'Implement fault tolerance with circuit breakers (Resilience4j), retries, and rate limits',
      'Establish centralized telemetry, distributed tracing (OpenTelemetry), and logging'
    ],
    resources: [
      { id: 'ms-1', title: 'Monolith to Microservices Migration Strategies', type: 'doc', duration: '40 min', completed: false, topic: 'Decomposition' },
      { id: 'ms-2', title: 'Building Resilient Microservices with Resilience4j', type: 'practice', duration: '55 min', completed: false, topic: 'Resilience' }
    ]
  },
  {
    id: 'event-driven-adv',
    name: 'Event-Driven Architecture',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Software Architecture',
    icon: '⚡',
    aliases: ['EDA', 'Event Sourcing', 'CQRS', 'PubSub Architecture'],
    relatedSkills: ['Apache Kafka', 'RabbitMQ', 'Distributed Systems', 'Microservices'],
    description: 'Design asynchronous, event-driven backends using event streaming, event sourcing, CQRS (Command Query Responsibility Segregation), and transactional outboxes.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Staff Backend Engineer', 'Data Streaming Engineer', 'Event Platform Architect'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 39,
    estimatedTime: '28 Hours',
    learningObjectives: [
      'Implement CQRS patterns with separate read and write data stores',
      'Audit and reconstruct state machines using Event Sourcing architectures',
      'Guarantee at-least-once and exactly-once message delivery semantics',
      'Ensure zero message loss using the Transactional Outbox pattern with Debezium CDC'
    ],
    resources: [
      { id: 'eda-1', title: 'CQRS and Event Sourcing Architectural Patterns', type: 'doc', duration: '45 min', completed: false, topic: 'CQRS' },
      { id: 'eda-2', title: 'Implementing Transactional Outbox with Kafka', type: 'practice', duration: '60 min', completed: false, topic: 'Outbox' }
    ]
  },
  {
    id: 'ddd-adv',
    name: 'Domain-Driven Design',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Software Architecture',
    icon: '📐',
    aliases: ['DDD', 'Strategic Design', 'Tactical DDD', 'Ubiquitous Language'],
    relatedSkills: ['Software Architecture', 'Microservices', 'Clean Architecture'],
    description: 'Align complex business domains with software design using Ubiquitous Language, Bounded Contexts, Aggregates, Entities, Value Objects, and Domain Events.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Principal Software Engineer', 'Enterprise Architect', 'Lead Developer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 26,
    estimatedTime: '24 Hours',
    learningObjectives: [
      'Facilitate Event Storming workshops to map complex enterprise business domains',
      'Define Bounded Contexts and establish Context Maps between distinct teams',
      'Model Aggregates to preserve transaction consistency boundaries and domain invariants',
      'Decouple infrastructure from core business logic using Hexagonal/Ports & Adapters'
    ],
    resources: [
      { id: 'ddd-1', title: 'Strategic & Tactical Domain-Driven Design', type: 'doc', duration: '40 min', completed: false, topic: 'Fundamentals' },
      { id: 'ddd-2', title: 'Refactoring an Order Aggregate in Pure Domain Logic', type: 'practice', duration: '50 min', completed: false, topic: 'Aggregates' }
    ]
  },
  {
    id: 'software-arch-adv',
    name: 'Software Architecture',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Software Architecture',
    icon: '🏛️',
    aliases: ['Clean Architecture', 'Hexagonal Architecture', 'Enterprise Architecture', 'Onion Architecture'],
    relatedSkills: ['Domain-Driven Design', 'Design Patterns', 'System Design'],
    description: 'Enterprise architecture paradigms: Clean Architecture, Onion Architecture, Hexagonal (Ports & Adapters), modular monoliths, ADRs (Architectural Decision Records), and code governance.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Enterprise Architect', 'Technical Lead', 'Software Solutions Architect'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 38,
    estimatedTime: '26 Hours',
    learningObjectives: [
      'Implement Onion and Clean Architecture dependency rule enforcement in enterprise codebases',
      'Document and evaluate architectural tradeoffs using Architecture Decision Records (ADRs)',
      'Design modular monoliths with strict module boundary encapsulation and verification',
      'Define non-functional requirement (NFR) gates for security, latency, and reliability'
    ],
    resources: [
      { id: 'sa-1', title: 'Clean Architecture in Production Microservices', type: 'video', duration: '40 min', completed: false, topic: 'Clean Arch' },
      { id: 'sa-2', title: 'Authoring RFCs and Architectural Decision Records', type: 'practice', duration: '35 min', completed: false, topic: 'ADRs' }
    ]
  },
  {
    id: 'scalability-adv',
    name: 'Scalability',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Software Architecture',
    icon: '📈',
    aliases: ['High Availability', 'Horizontal Scaling', 'HA Architecture', 'Fault Tolerance'],
    relatedSkills: ['System Design', 'Performance Engineering', 'Database Architecture', 'SRE'],
    description: 'Scale platforms to 10M+ daily active users: horizontal autoscaling, stateless services, multi-region active-active deployments, zero-downtime rolling releases, and circuit breakers.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Staff Site Reliability Engineer', 'Cloud Infrastructure Architect', 'Scale Lead'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 42,
    estimatedTime: '28 Hours',
    learningObjectives: [
      'Design multi-AZ and multi-region active-active cloud topologies',
      'Implement auto-scaling policies triggered by custom metrics and queues (KEDA)',
      'Achieve 99.999% availability using canary deployments and automatic rollback loops',
      'Eliminate single points of failure (SPOF) across networks, load balancers, and storage'
    ],
    resources: [
      { id: 'sc-1', title: 'Building for 99.999% Availability & Disaster Recovery', type: 'doc', duration: '45 min', completed: false, topic: 'High Availability' },
      { id: 'sc-2', title: 'Configuring Multi-Region Active-Active Deployments', type: 'practice', duration: '60 min', completed: false, topic: 'Multi-Region' }
    ]
  },
  {
    id: 'perf-engineering-adv',
    name: 'Performance Engineering',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Software Architecture',
    icon: '🏎️',
    aliases: ['APM', 'Profiling', 'Latency Optimization', 'Memory Profiling', 'Load Testing'],
    relatedSkills: ['System Design', 'SRE', 'Query Optimization', 'Advanced C++'],
    description: 'Systematic performance profiling and tuning: memory leak detection, flame graphs, CPU cache efficiency, garbage collection tuning, asynchronous I/O bottlenecks, and k6 load tests.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Performance Engineer', 'Staff Systems Engineer', 'Backend Specialist'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 30,
    estimatedTime: '26 Hours',
    learningObjectives: [
      'Diagnose CPU and memory bottlenecks using Linux perf, pprof, and flame graphs',
      'Optimize JVM, V8, and Python runtime garbage collection pauses and heap allocation',
      'Design realistic stress and soak tests using k6, Locust, and Gatling',
      'Minimize P99 and P99.9 latency spikes through non-blocking concurrency and connection pooling'
    ],
    resources: [
      { id: 'pe-1', title: 'CPU Flame Graphs and Profiling Node/Go Services', type: 'video', duration: '45 min', completed: false, topic: 'Profiling' },
      { id: 'pe-2', title: 'High-Throughput k6 Stress Testing Pipeline', type: 'practice', duration: '50 min', completed: false, topic: 'Load Testing' }
    ]
  },
  {
    id: 'adv-design-patterns-adv',
    name: 'Advanced Design Patterns',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Software Architecture',
    icon: '🎯',
    aliases: ['GoF Patterns', 'Enterprise Integration Patterns', 'Concurrency Patterns'],
    relatedSkills: ['Design Patterns', 'Object-Oriented Programming', 'Software Architecture'],
    description: 'Master advanced creational, structural, and behavioral patterns alongside enterprise integration patterns (Aggregator, Scatter-Gather, Wire Tap) and concurrency patterns (Worker Pool, Reactor).',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Senior Software Engineer', 'Lead Architect', 'Framework Developer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 32,
    estimatedTime: '22 Hours',
    learningObjectives: [
      'Apply GoF structural and behavioral patterns in complex multi-threaded environments',
      'Implement enterprise integration patterns for message routing and message transformation',
      'Build reactive actor systems and worker pool concurrency models',
      'Refactor anti-patterns and code smells into maintainable, decoupled architectures'
    ],
    resources: [
      { id: 'adp-1', title: 'Enterprise Integration & Concurrency Patterns Guide', type: 'doc', duration: '40 min', completed: false, topic: 'Patterns' },
      { id: 'adp-2', title: 'Building a Thread-Safe Worker Pool in Go/Java', type: 'practice', duration: '45 min', completed: false, topic: 'Concurrency' }
    ]
  },

  // ==========================================
  // --- BACKEND & FRAMEWORKS ---
  // ==========================================
  {
    id: 'adv-nodejs-adv',
    name: 'Advanced Node.js',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Backend Development',
    icon: '🟢',
    aliases: ['Node Streams', 'Node Cluster', 'V8 Engine', 'Libuv'],
    relatedSkills: ['Node.js', 'Express.js', 'Performance Engineering', 'WebSockets'],
    description: 'Master Node.js internals: libuv event loop phases, V8 garbage collection, C++ native addons, cluster module, worker threads, backpressure in transform streams, and memory heap snapshots.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Senior Node.js Developer', 'Lead Backend Engineer', 'Full Stack Architect'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 45,
    estimatedTime: '28 Hours',
    learningObjectives: [
      'Analyze libuv event loop microtask vs macrotask execution phases',
      'Process gigabyte datasets efficiently using Transform Streams and custom backpressure',
      'Parallelize CPU-intensive tasks using Worker Threads and shared ArrayBuffers',
      'Debug memory leaks using Chrome DevTools heap snapshots and Clinic.js'
    ],
    resources: [
      { id: 'an-1', title: 'Deep Dive: Event Loop & Libuv Architecture', type: 'video', duration: '45 min', completed: false, topic: 'Event Loop' },
      { id: 'an-2', title: 'Stream Processing with Custom Transform Pipelines', type: 'practice', duration: '50 min', completed: false, topic: 'Streams' }
    ]
  },
  {
    id: 'spring-boot-adv',
    name: 'Spring Boot',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Backend Development',
    icon: '🍃',
    aliases: ['Spring Cloud', 'Spring Framework', 'Java Spring Boot', 'Spring Security'],
    relatedSkills: ['Java', 'Microservices', 'Docker', 'PostgreSQL'],
    description: 'Production enterprise Java development: Spring Boot 3, Spring Data JPA/Hibernate optimization, Spring Security with OAuth2/JWT, Spring Cloud Netflix/Consul, and Spring WebFlux reactive streams.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Senior Java Engineer', 'Enterprise Backend Developer', 'Spring Cloud Specialist'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 50,
    estimatedTime: '34 Hours',
    learningObjectives: [
      'Architect robust enterprise REST services with Spring Boot and Spring Data JPA',
      'Secure microservices using Spring Security, OAuth2 Resource Server, and JWT validation',
      'Solve N+1 query problems using entity graphs and JPA projection techniques',
      'Build non-blocking reactive microservices using Spring WebFlux and Project Reactor'
    ],
    resources: [
      { id: 'sb-1', title: 'Spring Security 6 & OAuth2 Resource Server Architecture', type: 'doc', duration: '45 min', completed: false, topic: 'Security' },
      { id: 'sb-2', title: 'Optimizing Hibernate Queries and Entity Graphs', type: 'practice', duration: '50 min', completed: false, topic: 'JPA' }
    ]
  },
  {
    id: 'fastapi-adv',
    name: 'FastAPI',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Backend Development',
    icon: '⚡',
    aliases: ['FastAPI Python', 'Asynchronous Python Backend', 'Pydantic API'],
    relatedSkills: ['Python', 'Docker', 'AI API Integration', 'PostgreSQL'],
    description: 'Build high-performance, asynchronous REST and GraphQL APIs in Python using FastAPI, Pydantic v2 validation, Starlette ASGI, async SQLAlchemy, and automated OpenAPI documentation.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['FastAPI Backend Developer', 'AI/ML Platform Engineer', 'Python Architect'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 42,
    estimatedTime: '24 Hours',
    learningObjectives: [
      'Leverage async/await def handlers with ASGI servers (Uvicorn, Gunicorn)',
      'Implement strict request/response data contracts and custom validators with Pydantic v2',
      'Connect async relational databases using Asyncpg and SQLAlchemy 2.0 with connection pools',
      'Secure endpoints with OAuth2 password bearer flow and scope-based permission gates'
    ],
    resources: [
      { id: 'fa-1', title: 'Asynchronous Architecture with FastAPI & SQLAlchemy', type: 'video', duration: '40 min', completed: false, topic: 'Async APIs' },
      { id: 'fa-2', title: 'Production Dockerization & Gunicorn Tuning for FastAPI', type: 'practice', duration: '45 min', completed: false, topic: 'Deployment' }
    ]
  },
  {
    id: 'django-adv',
    name: 'Django',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Backend Development',
    icon: '🎸',
    aliases: ['Django REST Framework', 'DRF', 'Python Django'],
    relatedSkills: ['Python', 'PostgreSQL', 'Docker', 'Celery'],
    description: 'Enterprise full-stack and REST engineering with Python Django: Django ORM query optimization (select_related, prefetch_related), DRF serializers/viewsets, Celery async tasks, and Redis caching.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Senior Python Developer', 'Django Full Stack Engineer', 'Backend Lead'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 36,
    estimatedTime: '26 Hours',
    learningObjectives: [
      'Eliminate redundant database queries using select_related and prefetch_related optimizations',
      'Build robust API endpoints using Django REST Framework generic viewsets and serializers',
      'Process long-running background jobs asynchronously using Celery and Redis message broker',
      'Implement database transactions and custom middleware for authentication and logging'
    ],
    resources: [
      { id: 'dj-1', title: 'Django ORM Optimization & Profiling in Production', type: 'doc', duration: '40 min', completed: false, topic: 'ORM Tuning' },
      { id: 'dj-2', title: 'Scaling Celery Workers with Redis and Flower Monitoring', type: 'practice', duration: '50 min', completed: false, topic: 'Celery' }
    ]
  },
  {
    id: 'graphql-adv',
    name: 'GraphQL',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Backend Development',
    icon: '🕸️',
    aliases: ['Apollo GraphQL', 'GraphQL Federation', 'Schema Stitching', 'DataLoader'],
    relatedSkills: ['REST API Development', 'React.js', 'Next.js', 'Node.js'],
    description: 'Design flexible, high-performance GraphQL APIs: Apollo Server/Client, GraphQL Federation, schema stitching, real-time subscriptions with WebSockets, and solving N+1 queries with DataLoader.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Full Stack Architect', 'GraphQL Specialist', 'Senior API Engineer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 35,
    estimatedTime: '24 Hours',
    learningObjectives: [
      'Design strongly typed GraphQL schemas with queries, mutations, and union types',
      'Eliminate N+1 database queries using DataLoader batching and caching mechanisms',
      'Federate distributed subgraph schemas into a single unified supergraph gateway',
      'Implement real-time updates via GraphQL subscriptions over WebSockets'
    ],
    resources: [
      { id: 'gql-1', title: 'Apollo Federation & Subgraph Schema Design', type: 'doc', duration: '45 min', completed: false, topic: 'Federation' },
      { id: 'gql-2', title: 'Building High-Performance Resolvers with DataLoader', type: 'practice', duration: '40 min', completed: false, topic: 'DataLoader' }
    ]
  },
  {
    id: 'grpc-adv',
    name: 'gRPC',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Backend Development',
    icon: '🔌',
    aliases: ['Protocol Buffers', 'Protobuf', 'RPC', 'HTTP/2 Communication'],
    relatedSkills: ['Microservices', 'Distributed Systems', 'Go', 'API Gateway'],
    description: 'High-performance inter-service communication using gRPC and Protocol Buffers: unary, server streaming, client streaming, bi-directional streaming, HTTP/2 multiplexing, and interceptors.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Distributed Systems Engineer', 'Senior Backend Engineer', 'Infrastructure Developer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 31,
    estimatedTime: '22 Hours',
    learningObjectives: [
      'Define clean, versioned Protobuf contracts (.proto files) and generate polyglot client stubs',
      'Implement all four gRPC communication modes: unary, client, server, and bidirectional streaming',
      'Add authentication, deadline propagation, and logging using gRPC interceptors',
      'Optimize network serialization and latency compared to traditional JSON over REST'
    ],
    resources: [
      { id: 'grpc-1', title: 'Protobuf v3 & gRPC Microservice Communications', type: 'video', duration: '40 min', completed: false, topic: 'Protobuf' },
      { id: 'grpc-2', title: 'Implementing Bi-Directional Streaming with gRPC', type: 'practice', duration: '45 min', completed: false, topic: 'Streaming' }
    ]
  },
  {
    id: 'message-queues-adv',
    name: 'Message Queues',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Backend Development',
    icon: '📬',
    aliases: ['RabbitMQ', 'AMQP', 'ActiveMQ', 'Message Broker', 'Celery Broker'],
    relatedSkills: ['Apache Kafka', 'Event-Driven Architecture', 'Microservices', 'Distributed Systems'],
    description: 'Asynchronous task decoupling and reliable message delivery using AMQP and RabbitMQ: exchange types (direct, topic, fanout, headers), dead-letter queues, acknowledgment flags, and priority queues.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Senior Backend Engineer', 'Cloud Infrastructure Engineer', 'Messaging Specialist'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 34,
    estimatedTime: '20 Hours',
    learningObjectives: [
      'Route messages precisely using RabbitMQ Topic and Direct exchanges',
      'Implement dead-lettering, message TTLs, and exponential backoff retry policies',
      'Configure manual message acknowledgments (ACK/NACK) to prevent lost tasks',
      'Cluster RabbitMQ brokers with quorum queues for high availability'
    ],
    resources: [
      { id: 'mq-1', title: 'RabbitMQ Exchange Architecture & Dead Letter Exchanges', type: 'doc', duration: '35 min', completed: false, topic: 'RabbitMQ' },
      { id: 'mq-2', title: 'Building Fault-Tolerant AMQP Consumers with Retries', type: 'practice', duration: '45 min', completed: false, topic: 'Consumers' }
    ]
  },
  {
    id: 'kafka-adv',
    name: 'Apache Kafka',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Backend Development',
    icon: '🪵',
    aliases: ['Kafka Streams', 'Kafka Connect', 'Event Streaming Platform', 'Confluent'],
    relatedSkills: ['Event-Driven Architecture', 'Real-Time Streaming', 'Distributed Systems', 'Big Data Architecture'],
    description: 'Enterprise event streaming platform: Kafka cluster architecture (brokers, topics, partitions, consumer groups, KRaft), Kafka Streams stateful processing, Kafka Connect, and Schema Registry.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Kafka Platform Engineer', 'Data Streaming Specialist', 'Senior Distributed Backend Engineer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 46,
    estimatedTime: '32 Hours',
    learningObjectives: [
      'Master partition distribution, replication factors, and consumer group offset management',
      'Enforce message compatibility across evolving producers with Confluent Schema Registry (Avro)',
      'Build real-time stateful stream processing topologies with Kafka Streams and windowed aggregations',
      'Deploy production KRaft clusters and monitor consumer lag using Burrow/Prometheus'
    ],
    resources: [
      { id: 'kf-1', title: 'Kafka Internals: Partitions, Offsets & KRaft Consensus', type: 'video', duration: '50 min', completed: false, topic: 'Internals' },
      { id: 'kf-2', title: 'Building a Real-Time Event Pipeline with Kafka Streams', type: 'practice', duration: '60 min', completed: false, topic: 'Kafka Streams' }
    ]
  },
  {
    id: 'api-gateway-adv',
    name: 'API Gateway',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Backend Development',
    icon: '⛩️',
    aliases: ['Kong Gateway', 'AWS API Gateway', 'Envoy Gateway', 'Traefik', 'Reverse Proxy'],
    relatedSkills: ['Microservices', 'Service Mesh', 'Authentication', 'System Design'],
    description: 'Centralized API traffic management: edge routing, token validation, rate limiting, SSL termination, request/response transformations, and observability using Kong, Envoy, or AWS API Gateway.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Cloud Infrastructure Architect', 'Senior API Engineer', 'DevOps Specialist'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 33,
    estimatedTime: '20 Hours',
    learningObjectives: [
      'Configure centralized JWT validation and API key authentication at the edge',
      'Implement dynamic token-bucket rate limiting and DDoS traffic throttling',
      'Manage routing policies, path rewriting, and response caching for backend microservices',
      'Integrate distributed tracing headers across edge gateways into service meshes'
    ],
    resources: [
      { id: 'gw-1', title: 'Kong API Gateway Architecture and Plugin Ecosystem', type: 'doc', duration: '35 min', completed: false, topic: 'Kong' },
      { id: 'gw-2', title: 'Configuring Rate Limiting and JWT Auth on Envoy', type: 'practice', duration: '45 min', completed: false, topic: 'Envoy' }
    ]
  },
  {
    id: 'service-mesh-adv',
    name: 'Service Mesh',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Backend Development',
    icon: '🕸️',
    aliases: ['Istio', 'Linkerd', 'Envoy Proxy', 'mTLS Mesh'],
    relatedSkills: ['Kubernetes Basics', 'Microservices', 'Network Security', 'Distributed Systems'],
    description: 'Infrastructure-layer service-to-service communication: sidecar proxies, mutual TLS (mTLS) zero trust encryption, traffic shifting (canary, blue-green), and telemetry with Istio or Linkerd.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Kubernetes Platform Engineer', 'DevOps Architect', 'Security Systems Engineer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 28,
    estimatedTime: '24 Hours',
    learningObjectives: [
      'Deploy and configure Istio control plane and Envoy sidecar injection in Kubernetes',
      'Enforce strict mutual TLS (mTLS) for zero-trust microservice communication',
      'Implement traffic shifting, fault injection, and circuit breaking via VirtualServices',
      'Visualize mesh service graphs and request metrics using Kiali and Jaeger'
    ],
    resources: [
      { id: 'sm-1', title: 'Istio Service Mesh: Architecture and mTLS Enforcement', type: 'video', duration: '45 min', completed: false, topic: 'Istio' },
      { id: 'sm-2', title: 'Canary Traffic Splitting using VirtualService in Istio', type: 'practice', duration: '50 min', completed: false, topic: 'Traffic Splitting' }
    ]
  },

  // ==========================================
  // --- DATABASES & DATA ARCHITECTURE ---
  // ==========================================
  {
    id: 'db-arch-adv',
    name: 'Database Architecture',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Databases',
    icon: '🏛️',
    aliases: ['Enterprise DB Design', 'Storage Engine Architecture', 'WAL and Buffer Pool'],
    relatedSkills: ['Distributed Databases', 'Advanced SQL', 'Sharding & Replication', 'Query Optimization'],
    description: 'Deep dive into database storage engines, B-Tree and LSM-Tree storage structures, Write-Ahead Logging (WAL), transaction isolation levels (MVCC), and buffer pool memory management.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Database Architect', 'Principal Data Engineer', 'Senior Backend Infrastructure Engineer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 37,
    estimatedTime: '30 Hours',
    learningObjectives: [
      'Compare B+Tree (relational) vs Log-Structured Merge-Tree (LSM) storage engines',
      'Analyze Multi-Version Concurrency Control (MVCC) and transaction isolation anomalies',
      'Tweak buffer pool page caches, dirty page flush rates, and WAL checkpointing',
      'Architect robust multi-tier data storage strategies balancing speed, durability, and cost'
    ],
    resources: [
      { id: 'da-1', title: 'Database Internals: Storage Engines & MVCC Explored', type: 'doc', duration: '45 min', completed: false, topic: 'Storage Engines' },
      { id: 'da-2', title: 'Analyzing Lock Contention and Deadlocks in PostgreSQL', type: 'practice', duration: '50 min', completed: false, topic: 'Locks' }
    ]
  },
  {
    id: 'distributed-dbs-adv',
    name: 'Distributed Databases',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Databases',
    icon: '🌐',
    aliases: ['Cassandra', 'ScyllaDB', 'CockroachDB', 'DynamoDB', 'Spanner'],
    relatedSkills: ['Database Architecture', 'Distributed Systems', 'Sharding & Replication'],
    description: 'Manage horizontally distributed, globally replicated data stores: Dynamo-style systems (Cassandra, DynamoDB), Google Spanner derivatives (CockroachDB), and distributed ACID guarantees.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Distributed Database Administrator', 'Cloud Data Architect', 'Backend Infrastructure Engineer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 35,
    estimatedTime: '28 Hours',
    learningObjectives: [
      'Model queries around partition keys and clustering keys in Apache Cassandra / ScyllaDB',
      'Understand Paxos/Raft consensus for distributed transactions in CockroachDB',
      'Tune read/write consistency levels (ONE, QUORUM, ALL) against latency SLAs',
      'Handle split-brain scenarios, gossip protocols, and anti-entropy repair processes'
    ],
    resources: [
      { id: 'ddb-1', title: 'Apache Cassandra Architecture & Data Modeling Rules', type: 'video', duration: '45 min', completed: false, topic: 'Cassandra' },
      { id: 'ddb-2', title: 'Deploying High-Availability CockroachDB Multi-Node Cluster', type: 'practice', duration: '55 min', completed: false, topic: 'CockroachDB' }
    ]
  },
  {
    id: 'sharding-replication-adv',
    name: 'Sharding & Replication',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Databases',
    icon: '🔀',
    aliases: ['Database Sharding', 'Horizontal Partitioning', 'Read Replicas', 'Consistent Hashing'],
    relatedSkills: ['Database Architecture', 'Distributed Databases', 'System Design'],
    description: 'Scale relational and NoSQL databases horizontally: primary-replica streaming replication, logical replication, sharding schemes, consistent hashing rings, and resharding with zero downtime.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Senior DBA', 'Infrastructure Architect', 'Lead Scalability Engineer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 33,
    estimatedTime: '24 Hours',
    learningObjectives: [
      'Design consistent hashing rings with virtual nodes for uniform data distribution',
      'Set up PostgreSQL streaming replication with Patroni for automatic failover',
      'Implement application-level vs proxy-level sharding (Citus, Vitess) for PostgreSQL/MySQL',
      'Execute zero-downtime database sharding and cross-shard query optimization'
    ],
    resources: [
      { id: 'sr-1', title: 'Consistent Hashing & Dynamic Sharding in Practice', type: 'doc', duration: '40 min', completed: false, topic: 'Consistent Hashing' },
      { id: 'sr-2', title: 'Automated Failover with Patroni and PostgreSQL Replicas', type: 'practice', duration: '55 min', completed: false, topic: 'Replication' }
    ]
  },
  {
    id: 'adv-query-opt-adv',
    name: 'Advanced Query Optimization',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Databases',
    icon: '⚡',
    aliases: ['EXPLAIN ANALYZE', 'Cost-Based Optimizer', 'Index Optimization', 'SQL Tuning'],
    relatedSkills: ['Advanced SQL', 'PostgreSQL', 'MySQL', 'Database Architecture'],
    description: 'Diagnose and accelerate complex queries: Cost-Based Optimizer (CBO) plan trees, index-only scans, bitmap scans, hash joins vs nested loops, and query rewrite techniques.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Database Performance Specialist', 'Senior SQL Engineer', 'Backend Optimizer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 36,
    estimatedTime: '22 Hours',
    learningObjectives: [
      'Deconstruct complex PostgreSQL/MySQL EXPLAIN (ANALYZE, BUFFERS) query execution plans',
      'Identify and remediate sequential scans, bad row estimates, and disk spill sorts',
      'Design specialized indexes: partial indexes, expression indexes, and BRIN indexes',
      'Refactor slow correlated subqueries and window aggregations into high-performance CTEs'
    ],
    resources: [
      { id: 'qo-1', title: 'Mastering EXPLAIN ANALYZE in PostgreSQL & MySQL', type: 'video', duration: '45 min', completed: false, topic: 'Execution Plans' },
      { id: 'qo-2', title: 'Optimizing Joins and BRIN Indexes on Terabyte Tables', type: 'practice', duration: '45 min', completed: false, topic: 'Indexing' }
    ]
  },
  {
    id: 'snowflake-adv',
    name: 'Snowflake',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Databases',
    icon: '❄️',
    aliases: ['Snowflake Cloud Data Warehouse', 'Snowpark', 'Snowpipe', 'Snowflake Architecture'],
    relatedSkills: ['BigQuery', 'ETL Pipelines', 'Data Lakes', 'Advanced SQL'],
    description: 'Enterprise cloud data warehousing with Snowflake: multi-cluster shared data architecture, virtual warehouses, Snowpipe automated ingestion, time travel, and Snowpark Python.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Snowflake Data Architect', 'Cloud Data Engineer', 'Enterprise Analytics Engineer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 38,
    estimatedTime: '26 Hours',
    learningObjectives: [
      'Configure auto-scaling virtual warehouses and resource monitors to optimize cloud cost',
      'Build continuous streaming data ingestion pipelines using Snowpipe and cloud events',
      'Implement Zero-Copy Cloning, Time Travel, and Data Sharing for development and compliance',
      'Author and execute data transformations in Python and DataFrames using Snowpark'
    ],
    resources: [
      { id: 'sf-1', title: 'Snowflake Architecture: Storage, Compute & Cloud Services', type: 'doc', duration: '40 min', completed: false, topic: 'Architecture' },
      { id: 'sf-2', title: 'Automating Ingestion with Snowpipe & AWS S3 Notifications', type: 'practice', duration: '50 min', completed: false, topic: 'Snowpipe' }
    ]
  },
  {
    id: 'bigquery-adv',
    name: 'BigQuery',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Databases',
    icon: '📊',
    aliases: ['Google BigQuery', 'BigQuery ML', 'BigQuery Partitioning', 'BigQuery Slots'],
    relatedSkills: ['Snowflake', 'Google Cloud', 'ETL Pipelines', 'Big Data Architecture'],
    description: 'Serverless petabyte-scale analytics on Google Cloud BigQuery: partition and clustering strategies, slot reservations, BigQuery ML, materialized views, and BI Engine caching.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['BigQuery Data Architect', 'GCP Data Engineer', 'Senior Analytics Specialist'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 36,
    estimatedTime: '24 Hours',
    learningObjectives: [
      'Minimize data scanning and query costs using time-unit partitioning and table clustering',
      'Train machine learning models directly inside BigQuery using BigQuery ML (BQML)',
      'Analyze query execution execution stages, slot utilization, and shuffle bytes',
      'Set up BigQuery BI Engine reservation for sub-second dashboard query acceleration'
    ],
    resources: [
      { id: 'bq-1', title: 'BigQuery Cost & Performance Optimization Blueprint', type: 'doc', duration: '40 min', completed: false, topic: 'Optimization' },
      { id: 'bq-2', title: 'Building Predictive Models in BigQuery ML', type: 'practice', duration: '45 min', completed: false, topic: 'BQML' }
    ]
  },

  // ==========================================
  // --- AI / GENERATIVE AI / LLM ---
  // ==========================================
  {
    id: 'reinforcement-learning-adv',
    name: 'Reinforcement Learning',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Artificial Intelligence',
    icon: '🤖',
    aliases: ['RL', 'Q-Learning', 'Deep Q Networks', 'DQN', 'PPO', 'Policy Gradients', 'RLHF'],
    relatedSkills: ['PyTorch', 'Neural Networks', 'Machine Learning', 'AI Agents'],
    description: 'Autonomous decision-making algorithms: Markov Decision Processes (MDP), Q-Learning, Deep Q-Networks (DQN), Policy Gradient methods (PPO, TRPO), Actor-Critic, and RLHF.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Reinforcement Learning Scientist', 'Robotics AI Engineer', 'AI Research Scientist'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 28,
    estimatedTime: '34 Hours',
    learningObjectives: [
      'Model real-world agent environments using OpenAI Gymnasium and MDP definitions',
      'Implement Deep Q-Networks (DQN) with experience replay and target networks',
      'Train continuous action control models using Proximal Policy Optimization (PPO)',
      'Understand Reinforcement Learning from Human Feedback (RLHF) used in aligning LLMs'
    ],
    resources: [
      { id: 'rl-1', title: 'Deep Reinforcement Learning: DQN and PPO Mathematics', type: 'video', duration: '50 min', completed: false, topic: 'PPO' },
      { id: 'rl-2', title: 'Training a Gymnasium Environment Agent with Stable-Baselines3', type: 'practice', duration: '60 min', completed: false, topic: 'Gymnasium' }
    ]
  },
  {
    id: 'fine-tuning-llms-adv',
    name: 'Fine-Tuning LLMs',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Artificial Intelligence',
    icon: '🔧',
    aliases: ['LoRA', 'QLoRA', 'PEFT', 'Instruction Tuning', 'Model Alignment', 'DPO'],
    relatedSkills: ['LLM Fundamentals', 'Hugging Face', 'PyTorch', 'Transformers'],
    description: 'Customize and align open-source foundation models (Llama 3, Mistral): Parameter-Efficient Fine-Tuning (PEFT, LoRA, QLoRA), Direct Preference Optimization (DPO), and dataset curation.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['LLM Engineer', 'AI Research Engineer', 'Applied GenAI Scientist'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 46,
    estimatedTime: '30 Hours',
    learningObjectives: [
      'Format and tokenize instruction-tuning and conversational datasets (Alpaca, ChatML)',
      'Fine-tune 7B-70B parameter models on consumer GPUs using 4-bit QLoRA and PEFT',
      'Align models with human preferences using Direct Preference Optimization (DPO)',
      'Evaluate model quality against benchmark suites using lm-evaluation-harness'
    ],
    resources: [
      { id: 'ft-1', title: 'PEFT and QLoRA Fine-Tuning with Hugging Face TRL', type: 'doc', duration: '45 min', completed: false, topic: 'QLoRA' },
      { id: 'ft-2', title: 'Fine-Tuning Mistral 7B on Custom Enterprise Domain Data', type: 'practice', duration: '60 min', completed: false, topic: 'Hands-on Tuning' }
    ]
  },
  {
    id: 'rag-systems-adv',
    name: 'RAG Systems',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Artificial Intelligence',
    icon: '📚',
    aliases: ['Advanced RAG', 'Retrieval-Augmented Generation', 'Self-RAG', 'HyDE', 'Reranking'],
    relatedSkills: ['RAG', 'Vector Databases', 'LangChain', 'LlamaIndex', 'Semantic Search'],
    description: 'Production-grade enterprise RAG pipelines: advanced chunking strategies, semantic routing, multi-query expansion, HyDE, cross-encoder reranking, and hallucination evaluation (Ragas, TruLens).',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['RAG Solutions Architect', 'Senior AI Engineer', 'NLP Systems Developer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 52,
    estimatedTime: '30 Hours',
    learningObjectives: [
      'Implement multi-representation indexing and parent-child document chunking strategies',
      'Improve retrieval accuracy using Hypothetical Document Embeddings (HyDE) and Cohere Rerank',
      'Build hybrid keyword (BM25) and dense vector search fusion with Reciprocal Rank Fusion (RRF)',
      'Measure faithfulness, answer relevancy, and context recall using Ragas evaluation metrics'
    ],
    resources: [
      { id: 'rag-1', title: 'Advanced RAG Techniques: Self-Query, Rerank & HyDE', type: 'video', duration: '45 min', completed: false, topic: 'Retrieval' },
      { id: 'rag-2', title: 'Building a Production RAG Pipeline Evaluated with Ragas', type: 'practice', duration: '60 min', completed: false, topic: 'Evaluation' }
    ]
  },
  {
    id: 'ai-agents-adv',
    name: 'AI Agents',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Artificial Intelligence',
    icon: '🕵️',
    aliases: ['Agentic AI', 'Multi-Agent Systems', 'Autonomous Agents', 'LangGraph', 'CrewAI', 'AutoGen'],
    relatedSkills: ['LLM Fundamentals', 'Prompt Engineering', 'LangChain', 'Python'],
    description: 'Design autonomous agentic systems: reasoning loops (ReAct, Plan-and-Solve), memory architectures, tool calling, human-in-the-loop, and multi-agent coordination using LangGraph, CrewAI, and AutoGen.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Agentic AI Engineer', 'Autonomous Systems Developer', 'Lead AI Architect'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 48,
    estimatedTime: '28 Hours',
    learningObjectives: [
      'Build cyclical, stateful agent workflows with branch decisions using LangGraph',
      'Equip agents with tool execution: code execution sandbox, web search, and custom REST APIs',
      'Orchestrate collaborative multi-agent teams with CrewAI for role-specialized tasks',
      'Implement long-term episodic and semantic memory architectures for agents'
    ],
    resources: [
      { id: 'ag-1', title: 'LangGraph Stateful Multi-Agent Architecture', type: 'doc', duration: '45 min', completed: false, topic: 'LangGraph' },
      { id: 'ag-2', title: 'Building an Autonomous Research & Code Execution Agent', type: 'practice', duration: '60 min', completed: false, topic: 'Tool Calling' }
    ]
  },
  {
    id: 'multimodal-ai-adv',
    name: 'Multimodal AI',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Artificial Intelligence',
    icon: '👁️‍🗨️',
    aliases: ['Vision-Language Models', 'VLM', 'CLIP', 'Whisper', 'Audio-Visual AI'],
    relatedSkills: ['Computer Vision', 'Deep Learning', 'PyTorch', 'Transformers'],
    description: 'Harness multimodal models unifying text, images, video, and audio: CLIP cross-modal embeddings, Vision-Language Models (GPT-4o, LLaVA), Whisper audio transcription, and diffusion generation.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Multimodal AI Engineer', 'Vision AI Specialist', 'Senior Research Scientist'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 34,
    estimatedTime: '26 Hours',
    learningObjectives: [
      'Perform zero-shot image classification and cross-modal search using OpenAI CLIP',
      'Query and extract structured data from diagrams, tables, and photos with LLaVA/GPT-4o',
      'Build end-to-end speech-to-text-to-action pipelines using Whisper and TTS models',
      'Understand latent diffusion architectures (Stable Diffusion) for generative imagery'
    ],
    resources: [
      { id: 'mm-1', title: 'Vision-Language Models (VLM) Architecture & Prompting', type: 'video', duration: '40 min', completed: false, topic: 'VLMs' },
      { id: 'mm-2', title: 'Building a Multimodal Document Parser with LLaVA and CLIP', type: 'practice', duration: '50 min', completed: false, topic: 'Document Parsing' }
    ]
  },
  {
    id: 'mlops-adv',
    name: 'MLOps',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Artificial Intelligence',
    icon: '🔄',
    aliases: ['Machine Learning Operations', 'Model CI/CD', 'Model Monitoring', 'Data Drift'],
    relatedSkills: ['ML Pipelines', 'Docker', 'Kubernetes Basics', 'CI/CD'],
    description: 'End-to-end Machine Learning lifecycle automation: automated training pipelines (Kubeflow, Airflow), feature stores (Feast), model registries, drift detection, and continuous training (CT).',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['MLOps Engineer', 'Machine Learning Platform Engineer', 'DataOps Lead'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 44,
    estimatedTime: '30 Hours',
    learningObjectives: [
      'Automate continuous ML pipelines with data validation using Great Expectations',
      'Manage real-time and offline training features using Feast feature store',
      'Detect concept drift and data drift in live production traffic using Evidently AI',
      'Implement GitOps automated model deployment with canary rollback checks'
    ],
    resources: [
      { id: 'mlops-1', title: 'MLOps Architecture: Feature Stores, CT & Drift Monitoring', type: 'doc', duration: '45 min', completed: false, topic: 'Architecture' },
      { id: 'mlops-2', title: 'Setting Up an Automated Kubeflow Training Pipeline', type: 'practice', duration: '60 min', completed: false, topic: 'Kubeflow' }
    ]
  },
  {
    id: 'model-deployment-adv',
    name: 'Model Deployment & Monitoring',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Artificial Intelligence',
    icon: '🚀',
    aliases: ['Model Serving', 'Triton Inference Server', 'vLLM', 'TGI', 'TensorRT-LLM'],
    relatedSkills: ['MLOps', 'Docker', 'FastAPI', 'Kubernetes Basics'],
    description: 'High-throughput, low-latency AI inference serving: vLLM continuous batching, TensorRT-LLM quantization, NVIDIA Triton Inference Server, ONNX Runtime, and latency SLA monitoring.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['AI Inference Engineer', 'ML Platform Engineer', 'High Performance Computing Specialist'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 40,
    estimatedTime: '26 Hours',
    learningObjectives: [
      'Deploy open-source LLMs with continuous batching and PagedAttention using vLLM',
      'Accelerate deep learning models 3x-5x using TensorRT and ONNX Runtime quantization (INT8/FP8)',
      'Serve multi-model ensembles on GPUs using NVIDIA Triton Inference Server',
      'Track inference latency, tokens-per-second throughput, and GPU memory saturation'
    ],
    resources: [
      { id: 'md-1', title: 'High-Throughput LLM Serving with vLLM & PagedAttention', type: 'video', duration: '40 min', completed: false, topic: 'vLLM' },
      { id: 'md-2', title: 'Deploying Triton Inference Server with TensorRT Models', type: 'practice', duration: '55 min', completed: false, topic: 'Triton' }
    ]
  },
  {
    id: 'mlflow-adv',
    name: 'MLflow',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Artificial Intelligence',
    icon: '🧪',
    aliases: ['MLflow Tracking', 'MLflow Model Registry', 'Experiment Tracking'],
    relatedSkills: ['MLOps', 'Scikit-learn', 'PyTorch', 'Model Selection'],
    description: 'Enterprise machine learning experiment tracking and governance: MLflow Tracking, hyperparameter logging, artifact storage, Model Registry lifecycle stages, and MLflow Recipes.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Machine Learning Engineer', 'Data Science Lead', 'MLOps Specialist'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 35,
    estimatedTime: '20 Hours',
    learningObjectives: [
      'Log parameters, metrics, system metrics, and model checkpoints across distributed runs',
      'Manage model lifecycle transitions (Staging -> Production -> Archived) in the Model Registry',
      'Package reproducible data science code using MLflow Projects with Conda/Docker',
      'Serve registered models directly as REST endpoints with MLflow Models'
    ],
    resources: [
      { id: 'mf-1', title: 'MLflow Tracking & Model Governance in Enterprise Teams', type: 'doc', duration: '35 min', completed: false, topic: 'Governance' },
      { id: 'mf-2', title: 'Tracking PyTorch Runs and Promoting to Production in MLflow', type: 'practice', duration: '45 min', completed: false, topic: 'Registry' }
    ]
  },
  {
    id: 'transformer-arch-adv',
    name: 'Transformer Architecture',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Artificial Intelligence',
    icon: '🔮',
    aliases: ['Self-Attention', 'Multi-Head Attention', 'Attention Is All You Need', 'Positional Encoding', 'FlashAttention'],
    relatedSkills: ['Transformers', 'PyTorch', 'Deep Learning', 'NLP'],
    description: 'Mathematical foundations of modern AI: Scaled Dot-Product Attention, Multi-Head Attention, RoPE (Rotary Position Embedding), FlashAttention, LayerNorm vs RMSNorm, and SwiGLU activation.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['AI Research Scientist', 'Deep Learning Architect', 'NLP Engineer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 38,
    estimatedTime: '28 Hours',
    learningObjectives: [
      'Derive the mathematical formulation of Scaled Dot-Product and Multi-Head Attention',
      'Code a complete decoder-only Transformer from scratch in PyTorch with RoPE',
      'Understand memory-bound GPU attention bottlenecks and FlashAttention IO awareness',
      'Analyze architectural trade-offs: GQA (Grouped Query Attention) and sliding window attention'
    ],
    resources: [
      { id: 'ta-1', title: 'Attention Is All You Need: Deconstructed & Coded in PyTorch', type: 'video', duration: '50 min', completed: false, topic: 'Mathematics' },
      { id: 'ta-2', title: 'Implementing FlashAttention & RoPE in a Custom Mini-LLM', type: 'practice', duration: '60 min', completed: false, topic: 'Coding Transformer' }
    ]
  },
  {
    id: 'bert-gpt-adv',
    name: 'BERT & GPT Architectures',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Artificial Intelligence',
    icon: '📖',
    aliases: ['Autoregressive Models', 'Masked Language Modeling', 'Encoder vs Decoder', 'LLM Architectures'],
    relatedSkills: ['Transformer Architecture', 'Transformers', 'NLP', 'Fine-Tuning LLMs'],
    description: 'Comparative deep-dive into encoder-only (BERT, RoBERTa), decoder-only (GPT-2, GPT-3, LLaMA), and encoder-decoder (T5) architectures: pre-training objectives, causal masking, and scaling laws.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['NLP Research Engineer', 'Applied AI Scientist', 'Language Model Specialist'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 32,
    estimatedTime: '22 Hours',
    learningObjectives: [
      'Compare Masked Language Modeling (MLM) vs Next Token Prediction causal pre-training',
      'Understand Chinchilla scaling laws balancing model parameters and training token volume',
      'Fine-tune BERT for multi-class classification and token NER extraction',
      'Generate coherent long-form text using top-k, top-p (nucleus), and temperature sampling'
    ],
    resources: [
      { id: 'bg-1', title: 'Encoder vs Decoder: Architectural Tradeoffs and Scaling Laws', type: 'doc', duration: '40 min', completed: false, topic: 'Architectures' },
      { id: 'bg-2', title: 'Implementing Causal Masking and KV Cache in GPT Decoders', type: 'practice', duration: '50 min', completed: false, topic: 'KV Cache' }
    ]
  },
  {
    id: 'semantic-search-adv',
    name: 'Semantic Search & Vector Search',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Artificial Intelligence',
    icon: '🔍',
    aliases: ['Vector Search', 'Approximate Nearest Neighbors', 'HNSW', 'IVFFlat', 'Embeddings Search'],
    relatedSkills: ['Vector Databases', 'Embeddings', 'RAG Systems', 'NLP'],
    description: 'Vector indexing mathematics and search algorithms: Hierarchical Navigable Small World (HNSW), Inverted File Index (IVF), product quantization (PQ), hybrid search, and Milvus/Qdrant/Pinecone.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Search Infrastructure Engineer', 'Information Retrieval Scientist', 'AI Platform Engineer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 42,
    estimatedTime: '24 Hours',
    learningObjectives: [
      'Understand graph-based Approximate Nearest Neighbor (ANN) search with HNSW',
      'Compress millions of vectors into memory using Product Quantization (PQ)',
      'Benchmark cosine distance, Euclidean (L2), and dot product similarity metrics',
      'Build enterprise search combining sparse BM25 and dense embedding representations'
    ],
    resources: [
      { id: 'ss-1', title: 'HNSW and Inverted Index Mathematics in Vector Databases', type: 'video', duration: '40 min', completed: false, topic: 'HNSW' },
      { id: 'ss-2', title: 'Building a Sub-Millisecond Hybrid Vector Search Engine', type: 'practice', duration: '45 min', completed: false, topic: 'Hybrid Search' }
    ]
  },
  {
    id: 'langchain-adv',
    name: 'LangChain',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Artificial Intelligence',
    icon: '🦜',
    aliases: ['LangChain Framework', 'LCEL', 'LangChain Expression Language'],
    relatedSkills: ['LLM Fundamentals', 'RAG', 'AI Agents', 'LlamaIndex'],
    description: 'Enterprise application development with LangChain: LangChain Expression Language (LCEL), custom runnables, streaming callbacks, document loaders, vector store retrievers, and LangSmith tracing.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['LangChain Developer', 'Generative AI Engineer', 'AI Solutions Architect'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 44,
    estimatedTime: '24 Hours',
    learningObjectives: [
      'Compose declarative, async, streaming pipelines using LangChain Expression Language (LCEL)',
      'Construct complex routing logic with RunnableBranch and RunnableParallel',
      'Profile prompt token costs, latency bottlenecks, and output quality with LangSmith',
      'Integrate production document loaders and recursive chunk splitters'
    ],
    resources: [
      { id: 'lc-1', title: 'Mastering LangChain Expression Language (LCEL) & Streaming', type: 'doc', duration: '40 min', completed: false, topic: 'LCEL' },
      { id: 'lc-2', title: 'End-to-End Tracing and Debugging with LangSmith', type: 'practice', duration: '45 min', completed: false, topic: 'LangSmith' }
    ]
  },
  {
    id: 'llamaindex-adv',
    name: 'LlamaIndex',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Artificial Intelligence',
    icon: '🦙',
    aliases: ['GPT Index', 'Data Framework for LLMs', 'LlamaIndex Workflows'],
    relatedSkills: ['RAG', 'LangChain', 'Vector Databases', 'Prompt Engineering'],
    description: 'Data ingestion and advanced retrieval framework for LLMs: hierarchical indices, knowledge graph indexing, query engines, LlamaIndex Workflows event-driven pipelines, and router query engines.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['LlamaIndex Specialist', 'RAG Engineer', 'Knowledge Graph Architect'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 36,
    estimatedTime: '22 Hours',
    learningObjectives: [
      'Construct hierarchical index structures and summary indices over unstructured PDF data',
      'Build knowledge graph indices (GraphRAG) linking entity nodes and relational edges',
      'Route complex user prompts dynamically across multiple specialized sub-indices',
      'Build asynchronous, event-driven agentic pipelines with LlamaIndex Workflows'
    ],
    resources: [
      { id: 'li-1', title: 'LlamaIndex Data Framework: Advanced Query Engines & Routing', type: 'video', duration: '40 min', completed: false, topic: 'Query Engines' },
      { id: 'li-2', title: 'Building a Knowledge Graph RAG with LlamaIndex and Neo4j', type: 'practice', duration: '50 min', completed: false, topic: 'GraphRAG' }
    ]
  },

  // ==========================================
  // --- COMPUTER VISION & AUDIO ---
  // ==========================================
  {
    id: 'image-segmentation-adv',
    name: 'Image Segmentation',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Computer Vision',
    icon: '✂️',
    aliases: ['Semantic Segmentation', 'Instance Segmentation', 'U-Net', 'Mask R-CNN', 'SAM', 'Segment Anything'],
    relatedSkills: ['Computer Vision', 'PyTorch', 'Deep Learning', 'YOLO'],
    description: 'Pixel-level visual understanding: Semantic segmentation (U-Net, DeepLabv3+), instance segmentation (Mask R-CNN), and foundation models (Meta Segment Anything SAM).',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Computer Vision Scientist', 'Medical Imaging AI Engineer', 'Autonomous Vehicle Specialist'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 30,
    estimatedTime: '26 Hours',
    learningObjectives: [
      'Train U-Net architectures with skip connections for biomedical image segmentation',
      'Implement instance segmentation and RoIAlign feature extraction using Mask R-CNN',
      'Zero-shot segment arbitrary visual scenes using Meta Segment Anything Model (SAM)',
      'Calculate Intersection over Union (IoU) and Dice coefficient evaluation metrics'
    ],
    resources: [
      { id: 'is-1', title: 'Pixel-Level Segmentation: U-Net to Segment Anything (SAM)', type: 'doc', duration: '45 min', completed: false, topic: 'Segmentation' },
      { id: 'is-2', title: 'Training a Custom DeepLabV3+ Model in PyTorch', type: 'practice', duration: '55 min', completed: false, topic: 'DeepLab' }
    ]
  },
  {
    id: 'yolo-adv',
    name: 'YOLO',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Computer Vision',
    icon: '🎯',
    aliases: ['YOLOv8', 'YOLOv9', 'YOLOv10', 'Real-Time Object Detection', 'Ultralytics'],
    relatedSkills: ['Computer Vision', 'OpenCV', 'PyTorch', 'Model Deployment'],
    description: 'Real-time multi-object detection: YOLO architectures (YOLOv8, YOLOv9, YOLOv10), anchor-free detection heads, NMS (Non-Maximum Suppression), and edge export (ONNX, TensorRT).',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Computer Vision Engineer', 'Edge AI Developer', 'Surveillance AI Specialist'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 38,
    estimatedTime: '24 Hours',
    learningObjectives: [
      'Train YOLOv8/v10 on custom annotated bounding box datasets using Ultralytics',
      'Tune Non-Maximum Suppression (NMS) thresholds and anchor assignments to balance mAP vs speed',
      'Export trained weights to ONNX and TensorRT engines for 60+ FPS edge execution',
      'Integrate multi-object tracking using ByteTrack and DeepSORT for video surveillance'
    ],
    resources: [
      { id: 'yo-1', title: 'YOLO Evolution: Architecture Changes from v5 to v10', type: 'video', duration: '40 min', completed: false, topic: 'YOLO' },
      { id: 'yo-2', title: 'Real-Time Multi-Object Tracking with YOLOv8 and ByteTrack', type: 'practice', duration: '50 min', completed: false, topic: 'Tracking' }
    ]
  },
  {
    id: 'opencv-adv',
    name: 'OpenCV Advanced',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Computer Vision',
    icon: '📷',
    aliases: ['Advanced OpenCV', 'OpenCV C++', 'Image Processing Pipelines', 'Feature Matching'],
    relatedSkills: ['Computer Vision', 'YOLO', 'Python Programming', 'Advanced C++'],
    description: 'High-throughput computer vision pipelines: camera calibration, homography, perspective transforms, optical flow (Lucas-Kanade), SIFT/ORB feature matching, and CUDA GPU acceleration.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Senior Computer Vision Engineer', 'Robotics Software Developer', 'Image Processing Specialist'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 32,
    estimatedTime: '24 Hours',
    learningObjectives: [
      'Calibrate pinhole cameras to eliminate lens distortion using checkerboard patterns',
      'Calculate homography matrices for document scanner perspective warping',
      'Track motion vectors across video frames using Lucas-Kanade dense optical flow',
      'Accelerate image filtering and transformation matrices using OpenCV CUDA backend'
    ],
    resources: [
      { id: 'ocv-1', title: 'Camera Calibration, Homography & Perspective Warping', type: 'doc', duration: '40 min', completed: false, topic: 'Calibration' },
      { id: 'ocv-2', title: 'Feature Matching with SIFT, FLANN and RANSAC in OpenCV', type: 'practice', duration: '45 min', completed: false, topic: 'Feature Matching' }
    ]
  },
  {
    id: 'vit-adv',
    name: 'Vision Transformers',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Computer Vision',
    icon: '👁️',
    aliases: ['ViT', 'Swin Transformer', 'Self-Attention in Vision', 'Patch Projection'],
    relatedSkills: ['Transformer Architecture', 'Computer Vision', 'PyTorch', 'Deep Learning'],
    description: 'Applying transformer self-attention to computer vision: patch extraction, linear projection, class token embedding, Swin Transformer hierarchical windows, and self-supervised DINO.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Vision AI Scientist', 'Deep Learning Researcher', 'Senior Computer Vision Engineer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 29,
    estimatedTime: '26 Hours',
    learningObjectives: [
      'Extract and project 16x16 image patches into transformer token sequence embeddings',
      'Analyze global receptive fields of Vision Transformers vs local convolutional kernels',
      'Fine-tune Swin Transformers for classification and dense downstream vision tasks',
      'Understand self-supervised visual representation learning with DINOv2'
    ],
    resources: [
      { id: 'vit-1', title: 'Vision Transformers (ViT) & Swin: Architecture & Math', type: 'video', duration: '45 min', completed: false, topic: 'ViT Math' },
      { id: 'vit-2', title: 'Fine-Tuning a Pretrained ViT on Medical Images in PyTorch', type: 'practice', duration: '55 min', completed: false, topic: 'Fine-Tuning' }
    ]
  },
  {
    id: 'ocr-adv',
    name: 'OCR',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Computer Vision',
    icon: '📄',
    aliases: ['Optical Character Recognition', 'Tesseract', 'EasyOCR', 'PaddleOCR', 'Document AI'],
    relatedSkills: ['Computer Vision', 'OpenCV Advanced', 'NLP', 'Multimodal AI'],
    description: 'Document extraction and text recognition: text detection (EAST, DBNet), text recognition (CRNN, CTC loss), PaddleOCR, EasyOCR, and spatial Document AI key-value extraction.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Document AI Engineer', 'NLP/CV Specialist', 'Applied AI Developer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 27,
    estimatedTime: '20 Hours',
    learningObjectives: [
      'Detect irregular text bounding polygons using Differentiable Binarization (DBNet)',
      'Recognize sequence text characters using CRNN architectures with Connectionist Temporal Classification (CTC)',
      'Pre-process low-quality scanned receipts with adaptive thresholding and deskewing in OpenCV',
      'Extract structured JSON key-value tables from scanned invoices using LayoutLM'
    ],
    resources: [
      { id: 'ocr-1', title: 'Deep Learning OCR: Text Detection & CTC Recognition Pipeline', type: 'doc', duration: '35 min', completed: false, topic: 'OCR' },
      { id: 'ocr-2', title: 'Automated Invoice Processing with PaddleOCR and LayoutLM', type: 'practice', duration: '45 min', completed: false, topic: 'Document AI' }
    ]
  },
  {
    id: 'facial-recognition-adv',
    name: 'Facial Recognition',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Computer Vision',
    icon: '👤',
    aliases: ['Face Verification', 'ArcFace', 'FaceNet', 'Facial Landmark Detection', 'InsightFace'],
    relatedSkills: ['Computer Vision', 'Deep Learning', 'PyTorch', 'Vector Databases'],
    description: 'Biometric face verification and identification: face detection (RetinaFace), facial landmark alignment (68 landmarks), deep metric embedding (ArcFace, CosFace), and liveness detection.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Biometrics AI Engineer', 'Computer Vision Specialist', 'Security AI Developer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 25,
    estimatedTime: '22 Hours',
    learningObjectives: [
      'Detect multi-scale faces and 5-point landmarks using RetinaFace',
      'Align facial poses geometrically using affine transformation matrices',
      'Generate discriminative identity embeddings with Additive Angular Margin Loss (ArcFace)',
      'Implement anti-spoofing and presentation attack liveness detection'
    ],
    resources: [
      { id: 'fr-1', title: 'ArcFace: Additive Angular Margin Loss for Face Recognition', type: 'video', duration: '40 min', completed: false, topic: 'ArcFace' },
      { id: 'fr-2', title: 'Building a Real-Time Facial Recognition Pipeline with InsightFace', type: 'practice', duration: '50 min', completed: false, topic: 'InsightFace' }
    ]
  },

  // ==========================================
  // --- CLOUD & INFRASTRUCTURE ---
  // ==========================================
  {
    id: 'aws-adv-adv',
    name: 'AWS Advanced',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Cloud Computing',
    icon: '☁️',
    aliases: ['AWS Solutions Architect', 'Amazon Web Services Advanced', 'EKS', 'ECS', 'SageMaker', 'Bedrock'],
    relatedSkills: ['AWS', 'Kubernetes Basics', 'Terraform', 'System Design'],
    description: 'Enterprise AWS architecture: Elastic Kubernetes Service (EKS), Elastic Container Service (ECS), Amazon SageMaker machine learning pipelines, Amazon Bedrock generative AI, Transit Gateway, and Organizations.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['AWS Solutions Architect Professional', 'Cloud Platform Lead', 'Enterprise Cloud Architect'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 56,
    estimatedTime: '36 Hours',
    learningObjectives: [
      'Architect production Kubernetes clusters with AWS EKS, Karpenter autoscaling, and IAM roles for service accounts (IRSA)',
      'Design multi-VPC networking topologies with AWS Transit Gateway and Direct Connect',
      'Train and deploy scalable ML models using Amazon SageMaker endpoints and feature stores',
      'Integrate foundation models into enterprise workflows using Amazon Bedrock API'
    ],
    resources: [
      { id: 'awsa-1', title: 'AWS Well-Architected Framework: Enterprise Multi-Account Topologies', type: 'doc', duration: '50 min', completed: false, topic: 'Multi-Account' },
      { id: 'awsa-2', title: 'Production EKS Cluster Provisioning with Karpenter & IRSA', type: 'practice', duration: '65 min', completed: false, topic: 'EKS' }
    ]
  },
  {
    id: 'serverless-adv',
    name: 'Serverless Architecture',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Cloud Computing',
    icon: '⚡',
    aliases: ['AWS Lambda', 'Serverless Framework', 'EventBridge', 'Step Functions', 'FaaS'],
    relatedSkills: ['AWS', 'Microservices', 'Event-Driven Architecture', 'Cloud Deployment'],
    description: 'Build enterprise event-driven serverless backends: AWS Lambda cold-start mitigation, AWS Step Functions distributed workflows, EventBridge event buses, DynamoDB single-table design, and Serverless Framework.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Serverless Architect', 'Cloud Native Backend Engineer', 'Solutions Specialist'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 38,
    estimatedTime: '24 Hours',
    learningObjectives: [
      'Mitigate Lambda cold starts using provisioned concurrency, SnapStart, and bundle tree-shaking',
      'Orchestrate complex saga workflows with AWS Step Functions and error handling retries',
      'Route asynchronous microservice domain events with Amazon EventBridge rules and schemas',
      'Implement high-speed DynamoDB single-table design using composite partition and sort keys'
    ],
    resources: [
      { id: 'sls-1', title: 'Serverless Design Patterns with Step Functions & EventBridge', type: 'video', duration: '45 min', completed: false, topic: 'EventBridge' },
      { id: 'sls-2', title: 'DynamoDB Single-Table Design Architecture in Practice', type: 'practice', duration: '50 min', completed: false, topic: 'Single-Table' }
    ]
  },
  {
    id: 'azure-arch-adv',
    name: 'Azure Architecture',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Cloud Computing',
    icon: '🔷',
    aliases: ['Azure Solutions Architect', 'Microsoft Azure Advanced', 'AKS', 'Azure OpenAI', 'Azure Landing Zones'],
    relatedSkills: ['Azure', 'Kubernetes Basics', 'Terraform', 'Cloud Computing'],
    description: 'Enterprise Microsoft Azure architecture: Azure Kubernetes Service (AKS), Azure Enterprise Landing Zones, Azure OpenAI integration, Azure Synapse Analytics, and Microsoft Entra ID governance.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Azure Solutions Architect', 'Cloud Infrastructure Lead', 'Enterprise Cloud Engineer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 42,
    estimatedTime: '30 Hours',
    learningObjectives: [
      'Deploy enterprise Azure Landing Zones with management groups, policies, and hub-spoke VNETs',
      'Architect resilient AKS clusters with Azure CNI networking and managed identities',
      'Integrate Azure OpenAI service with private endpoints and enterprise data governance',
      'Enforce Zero Trust identity access management using Microsoft Entra ID and Conditional Access'
    ],
    resources: [
      { id: 'aza-1', title: 'Azure Enterprise Landing Zones & Hub-Spoke Networking', type: 'doc', duration: '45 min', completed: false, topic: 'Landing Zones' },
      { id: 'aza-2', title: 'Deploying Azure OpenAI with Private Link & Managed Identity', type: 'practice', duration: '55 min', completed: false, topic: 'Azure OpenAI' }
    ]
  },
  {
    id: 'gcp-arch-adv',
    name: 'Google Cloud Architecture',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Cloud Computing',
    icon: '🌐',
    aliases: ['GCP Solutions Architect', 'Google Cloud Platform Advanced', 'GKE', 'Vertex AI', 'Anthos'],
    relatedSkills: ['Google Cloud', 'Kubernetes Basics', 'BigQuery', 'Terraform'],
    description: 'Enterprise GCP architecture: Google Kubernetes Engine (GKE Autopilot), Vertex AI model development, Cloud Spanner globally distributed databases, Shared VPC networking, and Cloud Armor DDoS defense.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['GCP Cloud Architect Professional', 'Cloud Infrastructure Engineer', 'Platform Architect'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 36,
    estimatedTime: '30 Hours',
    learningObjectives: [
      'Architect auto-scaling multi-cluster workloads with GKE Autopilot and Workload Identity',
      'Deploy distributed AI models using Google Cloud Vertex AI pipelines and endpoints',
      'Configure Shared VPC cross-project network routing and Cloud Interconnect',
      'Protect public endpoints using Google Cloud Armor security policies and WAF rules'
    ],
    resources: [
      { id: 'gcpa-1', title: 'GCP Enterprise Architecture: GKE, Shared VPC & IAM Governance', type: 'video', duration: '45 min', completed: false, topic: 'Architecture' },
      { id: 'gcpa-2', title: 'Setting Up Vertex AI Pipelines with GCS Data Storage', type: 'practice', duration: '50 min', completed: false, topic: 'Vertex AI' }
    ]
  },
  {
    id: 'multi-cloud-adv',
    name: 'Multi-Cloud Strategy',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Cloud Computing',
    icon: '🌐',
    aliases: ['Multi-Cloud Architecture', 'Hybrid Cloud', 'Cloud Portability', 'Vendor Lock-in Mitigation'],
    relatedSkills: ['AWS Advanced', 'Azure Architecture', 'Terraform', 'Kubernetes Basics'],
    description: 'Design resilient multi-cloud and hybrid environments: vendor-agnostic infrastructure with Terraform/OpenTofu, cross-cloud Kubernetes federation, data replication, and cost arbitrage.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Head of Cloud Architecture', 'Multi-Cloud Strategist', 'Principal Infrastructure Architect'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 26,
    estimatedTime: '24 Hours',
    learningObjectives: [
      'Design cloud-agnostic application layers using container orchestration and abstract APIs',
      'Implement multi-cloud disaster recovery failover architectures between AWS and Azure/GCP',
      'Federate identities using OpenID Connect (OIDC) across multiple cloud providers',
      'Optimize multi-cloud egress traffic fees and data synchronization costs'
    ],
    resources: [
      { id: 'mc-1', title: 'Multi-Cloud Architecture: Redundancy vs Complexity Tradeoffs', type: 'doc', duration: '40 min', completed: false, topic: 'Strategy' },
      { id: 'mc-2', title: 'Cross-Cloud DNS Failover with Route 53 and Cloudflare', type: 'practice', duration: '45 min', completed: false, topic: 'Failover' }
    ]
  },
  {
    id: 'terraform-adv',
    name: 'Terraform',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Cloud Computing',
    icon: '🧱',
    aliases: ['Infrastructure as Code', 'IaC', 'OpenTofu', 'HCL', 'Terraform Cloud'],
    relatedSkills: ['AWS', 'Docker', 'CI/CD', 'Linux Administration'],
    description: 'Enterprise Infrastructure as Code (IaC): reusable modular architecture, remote state locking with DynamoDB, Terragrunt, policy-as-code with Sentinel/OPA, and automated CI/CD deployment pipelines.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['DevOps Engineer', 'Cloud Infrastructure Engineer', 'IaC Specialist'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 50,
    estimatedTime: '26 Hours',
    learningObjectives: [
      'Author highly reusable, parameterized Terraform modules adhering to semantic versioning',
      'Manage remote backend state storage with S3 and state locking using DynamoDB',
      'DRY up multi-account and multi-environment deployments using Terragrunt',
      'Enforce security and compliance guardrails using Open Policy Agent (OPA) / Conftest'
    ],
    resources: [
      { id: 'tf-1', title: 'Terraform Best Practices: Module Structure & State Management', type: 'video', duration: '40 min', completed: false, topic: 'Modules' },
      { id: 'tf-2', title: 'Automating Terraform with GitHub Actions and OPA Guardrails', type: 'practice', duration: '50 min', completed: false, topic: 'CI/CD' }
    ]
  },

  // ==========================================
  // --- DEVOPS & SRE ---
  // ==========================================
  {
    id: 'helm-adv',
    name: 'Helm',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'DevOps',
    icon: '⎈',
    aliases: ['Helm Charts', 'Kubernetes Package Manager', 'Helm v3'],
    relatedSkills: ['Kubernetes Basics', 'Docker', 'DevOps', 'ArgoCD'],
    description: 'The package manager for Kubernetes: authoring production Helm charts, Go template functions, values schema validation, subcharts, chart hooks, and private chart repositories.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Kubernetes Engineer', 'DevOps Platform Engineer', 'Cloud Native Specialist'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 36,
    estimatedTime: '20 Hours',
    learningObjectives: [
      'Author custom Helm v3 charts using Go templating, flow control, and named helper templates',
      'Enforce parameter validation with JSON schema definitions (values.schema.json)',
      'Manage multi-tier microservice dependencies using subcharts and umbrella charts',
      'Orchestrate database migration jobs before deployments using Helm pre-install hooks'
    ],
    resources: [
      { id: 'hl-1', title: 'Authoring Production Kubernetes Helm Charts', type: 'doc', duration: '35 min', completed: false, topic: 'Templating' },
      { id: 'hl-2', title: 'Publishing Charts to OCI Registries with GitHub Actions', type: 'practice', duration: '40 min', completed: false, topic: 'OCI Packaging' }
    ]
  },
  {
    id: 'argocd-adv',
    name: 'ArgoCD',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'DevOps',
    icon: '🐙',
    aliases: ['GitOps', 'Argo Rollouts', 'Kubernetes GitOps', 'Continuous Deployment'],
    relatedSkills: ['Helm', 'Kubernetes Basics', 'CI/CD', 'GitHub Actions'],
    description: 'Declarative GitOps continuous delivery for Kubernetes: automated sync, drift detection, self-healing, progressive rollouts (canary/blue-green) with Argo Rollouts, and multi-cluster management.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['GitOps Engineer', 'Release Engineer', 'Staff DevOps Engineer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 38,
    estimatedTime: '22 Hours',
    learningObjectives: [
      'Implement GitOps workflows where Git serves as the single source of truth for K8s manifests',
      'Configure auto-sync, prune policies, and automated drift self-healing in ArgoCD',
      'Orchestrate metric-driven canary releases with automated rollback using Argo Rollouts',
      'Manage multi-tenant multi-cluster application deployments using the App of Apps pattern'
    ],
    resources: [
      { id: 'argo-1', title: 'GitOps with ArgoCD: Architecture, Drift Detection & Security', type: 'video', duration: '40 min', completed: false, topic: 'GitOps' },
      { id: 'argo-2', title: 'Configuring Metric-Based Canary Deployments with Argo Rollouts', type: 'practice', duration: '45 min', completed: false, topic: 'Canary' }
    ]
  },
  {
    id: 'prometheus-adv',
    name: 'Prometheus',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'DevOps',
    icon: '🔥',
    aliases: ['PromQL', 'Metric Monitoring', 'Prometheus Alertmanager', 'Node Exporter'],
    relatedSkills: ['Grafana', 'SRE', 'DevOps', 'Docker'],
    description: 'Time-series monitoring and alerting: Prometheus server pull architecture, PromQL query syntax, custom exporters, Alertmanager routing and deduplication, and high-availability storage (Thanos/Cortex).',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Site Reliability Engineer', 'Monitoring Architect', 'Observability Engineer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 40,
    estimatedTime: '22 Hours',
    learningObjectives: [
      'Write complex PromQL queries calculating rate of change, histogram percentiles, and SLA uptimes',
      'Instrument custom application metrics (Counter, Gauge, Histogram) in Go/Node/Python',
      'Configure Alertmanager grouping, inhibit rules, and integrations with Slack/PagerDuty',
      'Scale long-term metric storage using Thanos or Cortex object storage backends'
    ],
    resources: [
      { id: 'prom-1', title: 'Mastering PromQL: Calculating P99 Latency & Error Budgets', type: 'doc', duration: '40 min', completed: false, topic: 'PromQL' },
      { id: 'prom-2', title: 'Instrumenting Application Endpoints with Custom Prometheus Metrics', type: 'practice', duration: '45 min', completed: false, topic: 'Instrumentation' }
    ]
  },
  {
    id: 'grafana-adv',
    name: 'Grafana',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'DevOps',
    icon: '📊',
    aliases: ['Grafana Dashboards', 'Grafana Loki', 'Observability Visualization', 'Grafana Tempo'],
    relatedSkills: ['Prometheus', 'ELK Stack', 'SRE', 'DevOps'],
    description: 'Full-stack observability dashboards: dynamic dashboard templating with PromQL/SQL, alerting, unified log aggregation with Loki, and distributed trace visualization with Tempo.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Observability Specialist', 'DevOps Visualizer', 'Production Support Lead'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 37,
    estimatedTime: '20 Hours',
    learningObjectives: [
      'Build dynamic multi-dimensional executive and system dashboards using query variables',
      'Correlate metrics (Prometheus), logs (Loki), and traces (Tempo) within a single unified view',
      'Configure unified Grafana alerting policies routed to on-call schedules',
      'Automate dashboard versioning as code using Grafonnet and Terraform'
    ],
    resources: [
      { id: 'grf-1', title: 'Building Production Observability Dashboards in Grafana', type: 'video', duration: '35 min', completed: false, topic: 'Dashboards' },
      { id: 'grf-2', title: 'Correlating Logs, Metrics and Traces with Loki and Tempo', type: 'practice', duration: '45 min', completed: false, topic: 'Correlation' }
    ]
  },
  {
    id: 'elk-adv',
    name: 'ELK Stack',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'DevOps',
    icon: '🦌',
    aliases: ['Elasticsearch', 'Logstash', 'Kibana', 'Elastic Stack', 'OpenSearch'],
    relatedSkills: ['Grafana', 'Linux Administration', 'SRE', 'Cybersecurity'],
    description: 'Centralized enterprise log search and analytics: Elasticsearch cluster indexing and ILM (Index Lifecycle Management), Logstash pipelines/groks, Beats agents, and Kibana visualizations.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Elasticsearch Specialist', 'Logging Infrastructure Engineer', 'Security Analytics Engineer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 35,
    estimatedTime: '24 Hours',
    learningObjectives: [
      'Tune Elasticsearch shard allocation, mappings, and Index Lifecycle Management (ILM) policies',
      'Parse unstructured log formats into structured JSON using Logstash grok filters and Filebeat',
      'Author complex Lucene and Elasticsearch query DSL queries for log forensics',
      'Create Kibana visualizations, Canvas presentations, and alerting rules'
    ],
    resources: [
      { id: 'elk-1', title: 'Elasticsearch Indexing Internals & Shard Sizing Rules', type: 'doc', duration: '40 min', completed: false, topic: 'Elasticsearch' },
      { id: 'elk-2', title: 'Building a Centralized Microservices Log Pipeline with Filebeat', type: 'practice', duration: '50 min', completed: false, topic: 'Filebeat' }
    ]
  },
  {
    id: 'sre-adv',
    name: 'Site Reliability Engineering',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'DevOps',
    icon: '🛡️',
    aliases: ['SRE', 'SLI SLO SLA', 'Error Budgets', 'Chaos Engineering', 'Incident Management'],
    relatedSkills: ['Prometheus', 'Grafana', 'Scalability', 'System Design'],
    description: 'Google SRE principles: Service Level Indicators (SLIs), Service Level Objectives (SLOs), error budgets, incident post-mortems, on-call runbooks, and chaos engineering with Gremlin/Chaos Mesh.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Site Reliability Engineer', 'Production Systems Lead', 'Incident Commander'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 46,
    estimatedTime: '28 Hours',
    learningObjectives: [
      'Define meaningful SLIs and calculate SLO error budgets to balance velocity with stability',
      'Author blameless incident post-mortems and action items preventing systemic recurrence',
      'Conduct automated chaos experiments (pod kills, latency injection, packet drop) with Chaos Mesh',
      'Design comprehensive runbooks, alert deduplication, and on-call escalation rotations'
    ],
    resources: [
      { id: 'sre-1', title: 'Google SRE Handbook: Error Budgets & Blameless Post-Mortems', type: 'doc', duration: '45 min', completed: false, topic: 'SRE Foundations' },
      { id: 'sre-2', title: 'Simulating Network Faults in Kubernetes with Chaos Mesh', type: 'practice', duration: '55 min', completed: false, topic: 'Chaos Engineering' }
    ]
  },

  // ==========================================
  // --- ADVANCED CYBERSECURITY ---
  // ==========================================
  {
    id: 'adv-pentest-adv',
    name: 'Advanced Penetration Testing',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Cybersecurity',
    icon: '🎯',
    aliases: ['Red Teaming', 'Offensive Security', 'OSCP Style', 'Exploit Development', 'Metasploit'],
    relatedSkills: ['Ethical Hacking', 'Penetration Testing Basics', 'Web Security', 'Network Security'],
    description: 'Offensive security operations: Active Directory domain compromise, privilege escalation (Linux/Windows), buffer overflow exploitation, pivoting across subnets, and bypass of EDR defenses.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Senior Penetration Tester', 'Red Team Operator', 'Offensive Security Consultant'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 38,
    estimatedTime: '34 Hours',
    learningObjectives: [
      'Execute Kerberoasting, AS-REP roasting, and BloodHound Active Directory privilege escalation',
      'Perform multi-hop network pivoting using Chisel, SSH tunnels, and proxychains',
      'Bypass Antivirus and EDR hooks using process injection and obfuscated shellcode',
      'Author comprehensive red team assessment reports with CVSS-scored remediation paths'
    ],
    resources: [
      { id: 'apt-1', title: 'Active Directory Attack Paths & Kerberos Exploitation', type: 'video', duration: '50 min', completed: false, topic: 'Active Directory' },
      { id: 'apt-2', title: 'Privilege Escalation Lab: Windows Token Impersonation', type: 'practice', duration: '60 min', completed: false, topic: 'PrivEsc' }
    ]
  },
  {
    id: 'threat-modeling-adv',
    name: 'Threat Modeling',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Cybersecurity',
    icon: '🧠',
    aliases: ['STRIDE', 'PASTA', 'Security Architecture Review', 'Attack Trees', 'DREAD'],
    relatedSkills: ['Security Architecture', 'AppSec', 'Software Architecture', 'System Design'],
    description: 'Systematic risk anticipation in architectural designs: STRIDE framework (Spoofing, Tampering, Repudiation, Info Disclosure, DoS, Elevation), PASTA, attack trees, and threat mitigations.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Security Architect', 'Product Security Lead', 'AppSec Engineer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 30,
    estimatedTime: '22 Hours',
    learningObjectives: [
      'Deconstruct system architecture diagrams into data flow diagrams (DFD) and trust boundaries',
      'Identify critical vulnerabilities using the STRIDE classification methodology',
      'Score and prioritize architectural threats using DREAD and CVSS v3.1 frameworks',
      'Prescribe technical countermeasures and integrate threat models into sprint planning'
    ],
    resources: [
      { id: 'tm-1', title: 'STRIDE Threat Modeling Methodology for Microservices', type: 'doc', duration: '40 min', completed: false, topic: 'STRIDE' },
      { id: 'tm-2', title: 'Authoring Threat Models in Code with OWASP Threat Dragon', type: 'practice', duration: '45 min', completed: false, topic: 'Threat Dragon' }
    ]
  },
  {
    id: 'security-arch-adv',
    name: 'Security Architecture',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Cybersecurity',
    icon: '🏰',
    aliases: ['Enterprise Security Architecture', 'Defense in Depth', 'SABSA', 'CIS Benchmarks'],
    relatedSkills: ['Zero Trust', 'Threat Modeling', 'Cloud Security', 'Network Security'],
    description: 'Enterprise defense-in-depth design: perimeter defense, micro-segmentation, identity governance, secrets management (HashiCorp Vault), cryptography governance, and compliance (ISO 27001, SOC2).',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Chief Information Security Architect', 'Enterprise Security Specialist', 'CISO Advisor'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 34,
    estimatedTime: '26 Hours',
    learningObjectives: [
      'Design defense-in-depth security layers across identity, compute, network, and data',
      'Manage enterprise secrets and dynamic database credentials with HashiCorp Vault',
      'Implement CIS benchmarks and automated compliance scanning across cloud infrastructure',
      'Design cryptographically secure key management lifecycles with Hardware Security Modules (HSM)'
    ],
    resources: [
      { id: 'sea-1', title: 'Enterprise Defense-in-Depth Architecture Frameworks', type: 'doc', duration: '45 min', completed: false, topic: 'Defense in Depth' },
      { id: 'sea-2', title: 'Automating Secrets Injection with HashiCorp Vault on Kubernetes', type: 'practice', duration: '50 min', completed: false, topic: 'Vault' }
    ]
  },
  {
    id: 'digital-forensics-adv',
    name: 'Digital Forensics',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Cybersecurity',
    icon: '🔬',
    aliases: ['DFIR', 'Incident Response', 'Memory Forensics', 'Disk Forensics', 'Volatility'],
    relatedSkills: ['Malware Analysis', 'SOC Operations', 'Linux Administration'],
    description: 'Evidence recovery and forensic investigation: volatile memory analysis with Volatility, disk image acquisition (Autopsy, FTK Imager), timeline analysis, chain of custody, and legal documentation.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Digital Forensics Investigator', 'DFIR Specialist', 'Incident Response Lead'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 26,
    estimatedTime: '28 Hours',
    learningObjectives: [
      'Acquire forensically sound raw memory dumps and disk bitstream images with write blockers',
      'Analyze Windows/Linux RAM dumps using Volatility 3 to uncover injected DLLs and hidden processes',
      'Reconstruct attacker timeline events through master file table ($MFT) and registry analysis',
      'Maintain rigorous chain-of-custody protocols for legal court admissibility'
    ],
    resources: [
      { id: 'df-1', title: 'Memory Forensics Deep Dive with Volatility 3', type: 'video', duration: '45 min', completed: false, topic: 'Volatility' },
      { id: 'df-2', title: 'Investigating Ransomware Infection Artifacts in Windows Event Logs', type: 'practice', duration: '55 min', completed: false, topic: 'Artifacts' }
    ]
  },
  {
    id: 'malware-analysis-adv',
    name: 'Malware Analysis',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Cybersecurity',
    icon: '🦠',
    aliases: ['Reverse Engineering', 'Ghidra', 'IDA Pro', 'Dynamic Analysis', 'Static Analysis'],
    relatedSkills: ['Digital Forensics', 'Advanced C', 'Cybersecurity Fundamentals'],
    description: 'Reverse engineer malicious executables: static analysis (PE headers, Ghidra disassembly), dynamic sandboxing (Process Hacker, RegShot), anti-analysis evasion bypass, and YARA rule writing.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Malware Analyst', 'Threat Intelligence Researcher', 'Reverse Engineer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 24,
    estimatedTime: '32 Hours',
    learningObjectives: [
      'Perform static analysis on Portable Executable (PE) headers, import tables, and strings',
      'Disassemble and decompile malicious binaries using NSA Ghidra and x64dbg',
      'Monitor API calls, registry mutations, and network callbacks inside isolated sandboxes',
      'Author custom YARA rules to detect malware families across file systems'
    ],
    resources: [
      { id: 'ma-1', title: 'Reverse Engineering Binaries with Ghidra', type: 'video', duration: '50 min', completed: false, topic: 'Ghidra' },
      { id: 'ma-2', title: 'Authoring YARA Detection Rules for Ransomware Samples', type: 'practice', duration: '50 min', completed: false, topic: 'YARA' }
    ]
  },
  {
    id: 'soc-operations-adv',
    name: 'SOC Operations',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Cybersecurity',
    icon: '🚨',
    aliases: ['Security Operations Center', 'SOC Analyst Tier 2', 'Incident Triage', 'Playbooks'],
    relatedSkills: ['SIEM', 'Digital Forensics', 'Network Security', 'Cybersecurity Fundamentals'],
    description: 'Manage 24/7 Security Operations Center tasks: alert triage, alert fatigue reduction, incident escalation playbooks, threat intelligence correlation, and SOAR workflow automation.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['SOC Analyst Tier 2/3', 'SOC Manager', 'Incident Response Handler'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 36,
    estimatedTime: '24 Hours',
    learningObjectives: [
      'Triage and investigate high-priority alerts across network, host, and cloud telemetry',
      'Author automated SOAR response playbooks (isolate host, revoke credentials) using Shuffle/Cortex',
      'Correlate indicators of compromise (IoCs) with MITRE ATT&CK enterprise matrices',
      'Measure SOC performance metrics including Mean Time to Detect (MTTD) and Respond (MTTR)'
    ],
    resources: [
      { id: 'soc-1', title: 'SOC Alert Triage & Incident Escalation Frameworks', type: 'doc', duration: '40 min', completed: false, topic: 'Operations' },
      { id: 'soc-2', title: 'Building Automated SOAR Playbooks with Shuffle', type: 'practice', duration: '45 min', completed: false, topic: 'SOAR' }
    ]
  },
  {
    id: 'siem-adv',
    name: 'SIEM',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Cybersecurity',
    icon: '🖥️',
    aliases: ['Splunk', 'Microsoft Sentinel', 'Wazuh', 'Security Information Event Management', 'QRadar'],
    relatedSkills: ['SOC Operations', 'ELK Stack', 'Network Security', 'Cybersecurity'],
    description: 'Security Information and Event Management: ingestion of multi-source syslogs, correlation rules, Splunk SPL queries, Kusto Query Language (KQL) in Microsoft Sentinel, and Wazuh XDR.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['SIEM Engineer', 'Splunk Architect', 'Security Data Specialist'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 40,
    estimatedTime: '26 Hours',
    learningObjectives: [
      'Write complex detection queries in Splunk SPL and Microsoft Sentinel Kusto (KQL)',
      'Construct automated correlation rules identifying brute force and lateral movement patterns',
      'Ingest Windows Event Forwarding (WEF), Sysmon, and cloud audit logs into central SIEM',
      'Tune false positive suppression logic to prevent alert fatigue'
    ],
    resources: [
      { id: 'siem-1', title: 'Detection Engineering with Splunk SPL & Sentinel KQL', type: 'video', duration: '45 min', completed: false, topic: 'Detection' },
      { id: 'siem-2', title: 'Deploying Open-Source Wazuh SIEM/XDR on Ubuntu', type: 'practice', duration: '50 min', completed: false, topic: 'Wazuh' }
    ]
  },
  {
    id: 'zero-trust-adv',
    name: 'Zero Trust',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Cybersecurity',
    icon: '🛡️',
    aliases: ['Zero Trust Architecture', 'ZTA', 'Never Trust Always Verify', 'BeyondCorp', 'ZTNA'],
    relatedSkills: ['Security Architecture', 'Authentication', 'Authorization', 'Service Mesh'],
    description: 'Modern enterprise security paradigm: never trust, always verify, continuous explicit verification, least privilege access, microsegmentation, and Zero Trust Network Access (ZTNA).',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Zero Trust Architect', 'Enterprise Security Strategist', 'Cloud Security Lead'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 35,
    estimatedTime: '22 Hours',
    learningObjectives: [
      'Implement the NIST SP 800-207 Zero Trust architectural model in enterprise environments',
      'Replace legacy corporate VPNs with Zero Trust Network Access (ZTNA) policies (Cloudflare One, Zscaler)',
      'Enforce context-aware continuous evaluation (device health, IP geolocation, user risk)',
      'Micro-segment network workloads using software-defined perimeters'
    ],
    resources: [
      { id: 'zt-1', title: 'NIST Zero Trust Architecture (SP 800-207) Implementation Guide', type: 'doc', duration: '40 min', completed: false, topic: 'NIST ZTA' },
      { id: 'zt-2', title: 'Configuring Context-Aware Access Policies with Cloudflare Access', type: 'practice', duration: '45 min', completed: false, topic: 'ZTNA' }
    ]
  },
  {
    id: 'appsec-adv',
    name: 'Application Security',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Cybersecurity',
    icon: '🔐',
    aliases: ['AppSec', 'DevSecOps', 'SAST DAST', 'Software Supply Chain Security', 'SCA'],
    relatedSkills: ['Web Security', 'OWASP Top 10', 'CI/CD', 'Software Engineering'],
    description: 'DevSecOps application defense: integrating Static Application Security Testing (SAST), Dynamic testing (DAST), Software Composition Analysis (SCA with Snyk), and dependency supply chain signing.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Application Security Engineer', 'DevSecOps Specialist', 'Product Security Lead'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 44,
    estimatedTime: '26 Hours',
    learningObjectives: [
      'Integrate Semgrep SAST and OWASP ZAP DAST scans into automated GitHub Actions pull requests',
      'Detect and remediate vulnerable third-party dependencies using Snyk and Dependabot',
      'Sign and verify container images and software artifacts using Sigstore Cosign',
      'Generate and audit Software Bill of Materials (SBOM) in CycloneDX and SPDX standards'
    ],
    resources: [
      { id: 'as-1', title: 'DevSecOps Pipeline: SAST, DAST & Dependency Scanning', type: 'video', duration: '40 min', completed: false, topic: 'DevSecOps' },
      { id: 'as-2', title: 'Automating SBOM Generation and Image Signing with Cosign', type: 'practice', duration: '50 min', completed: false, topic: 'Supply Chain' }
    ]
  },

  // ==========================================
  // --- BIG DATA & DATA ENGINEERING ---
  // ==========================================
  {
    id: 'spark-adv',
    name: 'Apache Spark',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Data Engineering',
    icon: '✨',
    aliases: ['PySpark', 'Spark SQL', 'Spark Streaming', 'Distributed Computing', 'RDD'],
    relatedSkills: ['Databricks', 'Big Data Architecture', 'Data Lakes', 'Python'],
    description: 'Unified analytics engine for large-scale data processing: Spark SQL, DataFrames, Catalyst query optimizer, Tungsten execution engine, partitioning, caching, and PySpark distributed jobs.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Senior Big Data Engineer', 'PySpark Specialist', 'Data Platform Architect'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 48,
    estimatedTime: '32 Hours',
    learningObjectives: [
      'Master Catalyst optimizer stages: analysis, logical optimization, and physical planning',
      'Mitigate data skew problems using broadcast joins, salting, and adaptive query execution (AQE)',
      'Process high-throughput unbounded streams using Spark Structured Streaming',
      'Tweak Spark executor memory allocations, shuffle partitions, and off-heap storage'
    ],
    resources: [
      { id: 'spk-1', title: 'PySpark Internals: Catalyst Optimizer & Data Skew Solutions', type: 'video', duration: '45 min', completed: false, topic: 'Optimizer' },
      { id: 'spk-2', title: 'High-Throughput ETL with PySpark on Terabyte Datasets', type: 'practice', duration: '60 min', completed: false, topic: 'ETL' }
    ]
  },
  {
    id: 'airflow-adv',
    name: 'Apache Airflow',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Data Engineering',
    icon: '💨',
    aliases: ['Airflow DAGs', 'Workflow Orchestration', 'MWAA', 'Data Pipelines'],
    relatedSkills: ['ETL Pipelines', 'Python Programming', 'Docker', 'Big Data Architecture'],
    description: 'Programmatic workflow orchestration platform: DAG authoring in Python, task scheduling, TaskFlow API, custom operators/sensors, dynamic DAG generation, and Celery/Kubernetes executors.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Data Pipeline Engineer', 'Workflow Automation Lead', 'DataOps Specialist'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 45,
    estimatedTime: '26 Hours',
    learningObjectives: [
      'Author robust, idempotent data workflows using the modern Airflow TaskFlow API (@task)',
      'Generate dynamic DAGs programmatically based on external metadata and configurations',
      'Deploy scalable Airflow architectures utilizing CeleryExecutor and KubernetesExecutor',
      'Implement SLA tracking, callback notifications, and automatic task retries'
    ],
    resources: [
      { id: 'af-1', title: 'Apache Airflow 2.x Best Practices & TaskFlow API', type: 'doc', duration: '40 min', completed: false, topic: 'TaskFlow' },
      { id: 'af-2', title: 'Building Dynamic Ingestion Pipelines with Airflow and Docker', type: 'practice', duration: '50 min', completed: false, topic: 'Dynamic DAGs' }
    ]
  },
  {
    id: 'databricks-adv',
    name: 'Databricks',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Data Engineering',
    icon: '🧱',
    aliases: ['Databricks Lakehouse', 'Delta Lake', 'Delta Live Tables', 'Unity Catalog'],
    relatedSkills: ['Apache Spark', 'Data Lakehouse', 'Data Lakes', 'Snowflake'],
    description: 'Unified Lakehouse platform: Delta Lake ACID transactions, Delta Live Tables (DLT) declarative pipelines, Unity Catalog unified data governance, and Databricks ML workspace.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Databricks Certified Data Engineer', 'Lakehouse Architect', 'Big Data Specialist'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 42,
    estimatedTime: '28 Hours',
    learningObjectives: [
      'Implement Medallion Architecture (Bronze -> Silver -> Gold) on Delta Lake',
      'Optimize Delta Lake tables using compaction (OPTIMIZE), Z-Ordering, and Time Travel',
      'Build declarative, automated ETL pipelines using Delta Live Tables (DLT)',
      'Enforce fine-grained row- and column-level data security with Unity Catalog'
    ],
    resources: [
      { id: 'dbx-1', title: 'Databricks Lakehouse Architecture & Medallion Design', type: 'doc', duration: '45 min', completed: false, topic: 'Lakehouse' },
      { id: 'dbx-2', title: 'Building a Delta Live Tables Pipeline with Automated Data Quality', type: 'practice', duration: '55 min', completed: false, topic: 'DLT' }
    ]
  },
  {
    id: 'etl-pipelines-adv',
    name: 'ETL Pipelines',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Data Engineering',
    icon: '🔄',
    aliases: ['Extract Transform Load', 'Data Pipelines', 'ELT', 'dbt', 'Data Ingestion'],
    relatedSkills: ['Apache Airflow', 'Advanced SQL', 'Data Lakes', 'Snowflake'],
    description: 'Enterprise data extraction, transformation, and loading: batch vs streaming ingestion, modern ELT workflows with dbt (data build tool), data contracts, and automated schema migration.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Lead ETL Developer', 'Analytics Engineer', 'Data Integration Specialist'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 46,
    estimatedTime: '26 Hours',
    learningObjectives: [
      'Build modular, tested, and version-controlled SQL transformation models using dbt Core',
      'Implement incremental models with merge strategies to minimize compute overhead',
      'Enforce data contracts and schema drift assertions on incoming raw data feeds',
      'Orchestrate end-to-end ingestion from transactional databases (CDC) to analytical marts'
    ],
    resources: [
      { id: 'etl-1', title: 'Modern ELT with dbt Core, Snowflake and Git Versioning', type: 'video', duration: '40 min', completed: false, topic: 'dbt' },
      { id: 'etl-2', title: 'Building an Incremental dbt Transformation Model with Tests', type: 'practice', duration: '50 min', completed: false, topic: 'Incremental Models' }
    ]
  },
  {
    id: 'data-lakes-adv',
    name: 'Data Lakes',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Data Engineering',
    icon: '🌊',
    aliases: ['S3 Data Lake', 'ADLS Gen2', 'Parquet Format', 'Apache Iceberg', 'Hudi'],
    relatedSkills: ['Data Lakehouse', 'Apache Spark', 'Databricks', 'AWS'],
    description: 'Object-store data lake storage: open table formats (Apache Iceberg, Apache Hudi, Delta Lake), columnar file formats (Apache Parquet, ORC), partitioning schemes, and catalog metadata.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Data Lake Architect', 'Cloud Storage Specialist', 'Senior Data Engineer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 36,
    estimatedTime: '24 Hours',
    learningObjectives: [
      'Compare open table format metadata: Apache Iceberg vs Apache Hudi vs Delta Lake',
      'Optimize columnar Apache Parquet files using dictionary encoding and Snappy compression',
      'Design partition evolution and hidden partitioning without rewriting physical files',
      'Implement lifecycle rules and cold tier archiving to reduce storage costs'
    ],
    resources: [
      { id: 'dl-1', title: 'Apache Iceberg: Open Table Format Architecture & Hidden Partitioning', type: 'doc', duration: '40 min', completed: false, topic: 'Iceberg' },
      { id: 'dl-2', title: 'Building an Iceberg Table on AWS S3 with PySpark', type: 'practice', duration: '50 min', completed: false, topic: 'PySpark Iceberg' }
    ]
  },
  {
    id: 'data-lakehouse-adv',
    name: 'Data Lakehouse',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Data Engineering',
    icon: '🏰',
    aliases: ['Lakehouse Architecture', 'Unified Analytics', 'Delta Lake ACID', 'Open Table Architecture'],
    relatedSkills: ['Data Lakes', 'Databricks', 'Snowflake', 'Big Data Architecture'],
    description: 'Unify data warehouse reliability and data lake low-cost scalability: ACID transactions on object storage, metadata layers, schema enforcement, time-travel queries, and BI performance on lakes.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Lakehouse Solutions Architect', 'Chief Data Architect', 'Principal Analytics Engineer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 34,
    estimatedTime: '24 Hours',
    learningObjectives: [
      'Architect the Lakehouse Medallion paradigm to support BI, SQL, and Machine Learning workloads',
      'Enforce schema validation and manage schema evolution on streaming data ingestion',
      'Execute time-travel queries to audit data changes and reproduce historical reports',
      'Compare compute-engine query caching layers (Photon engine, Trino/Presto)'
    ],
    resources: [
      { id: 'dlh-1', title: 'The Lakehouse Paradigm: Unifying Data Warehouses and Lakes', type: 'doc', duration: '35 min', completed: false, topic: 'Architecture' },
      { id: 'dlh-2', title: 'Running Interactive Trino SQL Queries over Iceberg Lakehouse', type: 'practice', duration: '45 min', completed: false, topic: 'Trino' }
    ]
  },
  {
    id: 'streaming-adv',
    name: 'Real-Time Streaming',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Data Engineering',
    icon: '🌊',
    aliases: ['Stream Processing', 'Apache Flink', 'Spark Streaming', 'Event Time', 'Watermarking'],
    relatedSkills: ['Apache Kafka', 'Apache Spark', 'Big Data Architecture', 'Distributed Systems'],
    description: 'Complex real-time event processing: Apache Flink stateful computation, event time vs processing time, watermarks, sliding and tumbling windows, and exactly-once processing guarantees.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Stream Processing Engineer', 'Real-Time Data Specialist', 'Distributed Systems Lead'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 38,
    estimatedTime: '28 Hours',
    learningObjectives: [
      'Master event-time windowing, session windows, and late data handling using watermarks in Apache Flink',
      'Implement stateful transformations with RocksDB state backend and distributed checkpoints',
      'Achieve end-to-end exactly-once processing semantics using two-phase commit sinks',
      'Analyze stream processing backpressure and memory saturation under surge traffic'
    ],
    resources: [
      { id: 'rts-1', title: 'Apache Flink: Stateful Stream Processing & Watermark Mathematics', type: 'video', duration: '45 min', completed: false, topic: 'Flink' },
      { id: 'rts-2', title: 'Building a Real-Time Fraud Detection Pipeline with Flink & Kafka', type: 'practice', duration: '60 min', completed: false, topic: 'Fraud Detection' }
    ]
  },
  {
    id: 'bigdata-arch-adv',
    name: 'Big Data Architecture',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'Data Engineering',
    icon: '🌐',
    aliases: ['Lambda Architecture', 'Kappa Architecture', 'Enterprise Data Architecture', 'Data Mesh'],
    relatedSkills: ['Data Lakehouse', 'Apache Spark', 'Apache Kafka', 'System Design'],
    description: 'Enterprise data architecture paradigms: Lambda vs Kappa architectures, modern Data Mesh decentralized domain-oriented ownership, federated governance, and infrastructure-as-a-product.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Principal Data Architect', 'Head of Data Platforms', 'Enterprise Big Data Consultant'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 40,
    estimatedTime: '30 Hours',
    learningObjectives: [
      'Compare speed/batch layer tradeoffs in Lambda vs single-path Kappa streaming architectures',
      'Implement the four core pillars of Data Mesh: domain ownership, data as a product, self-serve platform, and federated governance',
      'Establish enterprise metadata catalogs and data lineage graphs across organizational domains',
      'Design cost-effective cloud data infrastructure supporting 100TB+ daily ingestion'
    ],
    resources: [
      { id: 'bda-1', title: 'Data Mesh Architecture: Principles & Enterprise Implementation', type: 'doc', duration: '45 min', completed: false, topic: 'Data Mesh' },
      { id: 'bda-2', title: 'Designing a Kappa Real-Time Streaming Architecture', type: 'practice', duration: '55 min', completed: false, topic: 'Kappa' }
    ]
  },

  // ==========================================
  // --- ADVANCED IOT & EDGE COMPUTING ---
  // ==========================================
  {
    id: 'edge-ai-adv',
    name: 'Edge AI',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'IoT & Embedded',
    icon: '⚡',
    aliases: ['TinyML', 'Edge Inference', 'NVIDIA Jetson', 'Coral TPU', 'Model Quantization'],
    relatedSkills: ['Deep Learning', 'Computer Vision', 'YOLO', 'Embedded Systems'],
    description: 'Deploy machine learning at the edge on resource-constrained devices: TinyML, TensorFlow Lite, ONNX quantization (INT8/FP16), pruning, and deployment on NVIDIA Jetson / Coral TPU.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Edge AI Engineer', 'TinyML Developer', 'Embedded Vision Specialist'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 30,
    estimatedTime: '26 Hours',
    learningObjectives: [
      'Quantize deep neural networks from FP32 to INT8 with post-training quantization (PTQ)',
      'Deploy real-time object detection models to NVIDIA Jetson using TensorRT and DeepStream',
      'Run audio keyword spotting micro-models on ARM Cortex-M microcontrollers with TensorFlow Lite Micro',
      'Profile edge power consumption, thermal throttling, and inference latency'
    ],
    resources: [
      { id: 'eai-1', title: 'TinyML: Quantization & Deployment to Microcontrollers', type: 'video', duration: '40 min', completed: false, topic: 'TinyML' },
      { id: 'eai-2', title: 'Running YOLOv8 on NVIDIA Jetson Nano with DeepStream', type: 'practice', duration: '50 min', completed: false, topic: 'Jetson' }
    ]
  },
  {
    id: 'embedded-linux-adv',
    name: 'Embedded Linux',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'IoT & Embedded',
    icon: '🐧',
    aliases: ['Yocto Project', 'Buildroot', 'U-Boot', 'Device Trees', 'Kernel Drivers'],
    relatedSkills: ['Advanced C', 'Linux Basics', 'Operating Systems', 'Embedded Systems'],
    description: 'Custom board-level embedded operating system development: U-Boot bootloader, Linux kernel configuration, Device Trees (.dts), cross-compilation toolchains, and Yocto / Buildroot custom distributions.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Embedded Linux Engineer', 'Firmware Systems Developer', 'Board Bring-Up Specialist'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 28,
    estimatedTime: '32 Hours',
    learningObjectives: [
      'Configure and cross-compile U-Boot bootloaders and Linux kernels for ARM SoC boards',
      'Write Device Tree nodes (.dts/.dtsi) describing hardware peripherals, clocks, and GPIOs',
      'Build custom minimal embedded Linux distributions and root filesystems with Yocto / Poky',
      'Write and debug basic character device drivers and kernel modules'
    ],
    resources: [
      { id: 'el-1', title: 'Device Trees & Board Bring-Up in Embedded Linux', type: 'doc', duration: '45 min', completed: false, topic: 'Device Trees' },
      { id: 'el-2', title: 'Building a Custom Raspberry Pi OS Image with Yocto Project', type: 'practice', duration: '60 min', completed: false, topic: 'Yocto' }
    ]
  },
  {
    id: 'iot-security-adv',
    name: 'IoT Security',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'IoT & Embedded',
    icon: '🔒',
    aliases: ['Hardware Security', 'Secure Boot', 'Hardware Root of Trust', 'Firmware Security'],
    relatedSkills: ['IoT Networking', 'Cybersecurity Fundamentals', 'Embedded Systems', 'Cryptography'],
    description: 'Secure embedded hardware and IoT communications: Secure Boot, Hardware Root of Trust (TPM, Secure Element), flash memory dumping, encrypted MQTT, and secure Over-The-Air (OTA) firmware updates.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['IoT Security Engineer', 'Hardware Security Analyst', 'Embedded Security Architect'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 27,
    estimatedTime: '24 Hours',
    learningObjectives: [
      'Implement cryptographically verified Secure Boot and flash encryption on ESP32/ARM devices',
      'Secure device-to-cloud telemetry using mutual TLS (mTLS) with client certificates on TPMs',
      'Extract and audit binary firmware images for hardcoded secrets and known vulnerabilities',
      'Design fail-safe, rollback-protected cryptographic Over-The-Air (OTA) update mechanisms'
    ],
    resources: [
      { id: 'iots-1', title: 'Hardware Root of Trust & Secure Boot on Embedded Devices', type: 'video', duration: '40 min', completed: false, topic: 'Secure Boot' },
      { id: 'iots-2', title: 'Implementing Signed OTA Firmware Updates on ESP32 with mTLS', type: 'practice', duration: '50 min', completed: false, topic: 'Secure OTA' }
    ]
  },
  {
    id: 'iiot-adv',
    name: 'Industrial IoT',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'IoT & Embedded',
    icon: '🏭',
    aliases: ['IIoT', 'Industry 4.0', 'Modbus', 'OPC UA', 'SCADA Integration'],
    relatedSkills: ['MQTT', 'IoT Networking', 'Sensors', 'Embedded Systems'],
    description: 'Industry 4.0 smart factory integration: industrial communication protocols (Modbus TCP/RTU, OPC UA, PROFINET), SCADA integration, time-series telemetry, and predictive maintenance.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Industrial IoT Architect', 'Smart Manufacturing Engineer', 'SCADA/IIoT Developer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 25,
    estimatedTime: '22 Hours',
    learningObjectives: [
      'Bridge legacy PLC industrial telemetry using Modbus TCP and OPC UA client/servers',
      'Integrate industrial sensor streams into cloud IoT hubs and time-series databases',
      'Implement predictive maintenance algorithms detecting mechanical vibration anomalies',
      'Ensure high reliability and isolation compliant with IEC 62443 industrial security standards'
    ],
    resources: [
      { id: 'iiot-1', title: 'OPC UA & Modbus Architecture in Industry 4.0 Factories', type: 'doc', duration: '40 min', completed: false, topic: 'OPC UA' },
      { id: 'iiot-2', title: 'Bridging Modbus PLC Registers to AWS IoT SiteWise via Gateway', type: 'practice', duration: '45 min', completed: false, topic: 'PLC Gateway' }
    ]
  },
  {
    id: 'rtos-adv',
    name: 'RTOS',
    tier: 'Advanced',
    level: 'Advanced',
    category: 'IoT & Embedded',
    icon: '⏱️',
    aliases: ['Real-Time Operating Systems', 'FreeRTOS', 'Zephyr RTOS', 'Deterministic Concurrency'],
    relatedSkills: ['Embedded Systems', 'Advanced C', 'Multithreading', 'Operating Systems'],
    description: 'Deterministic micro-controller task scheduling: FreeRTOS and Zephyr RTOS, preemptive priority scheduling, semaphores, mutexes, queue IPC, priority inversion mitigation, and memory safety.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['RTOS Firmware Developer', 'Real-Time Embedded Engineer', 'Aerospace/Automotive Software Engineer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 30,
    estimatedTime: '26 Hours',
    learningObjectives: [
      'Design deterministic, preemptive multi-task schedules on FreeRTOS / Zephyr',
      'Manage inter-task communication using thread-safe queues, binary semaphores, and mutexes',
      'Prevent priority inversion deadlocks using priority inheritance protocols',
      'Profile interrupt service routine (ISR) latency and stack overflow limits'
    ],
    resources: [
      { id: 'rtos-1', title: 'FreeRTOS Internals: Preemption, Mutexes & Priority Inversion', type: 'video', duration: '45 min', completed: false, topic: 'FreeRTOS' },
      { id: 'rtos-2', title: 'Building a Deterministic Multi-Sensor Task Loop in FreeRTOS', type: 'practice', duration: '50 min', completed: false, topic: 'Sensor Loop' }
    ]
  }
];
