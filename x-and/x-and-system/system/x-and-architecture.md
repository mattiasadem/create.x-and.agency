# x-and System Architecture

## High-Level Flow

```mermaid
flowchart TD
    subgraph Input["📥 User Input"]
        REQ[User Request]
    end

    subgraph Core["🧠 x-and Core Orchestrator"]
        CLASSIFY[Classify Intent]
        ROUTE[Route to Agents]
        COMPOSE[Compose Output]
    end

    subgraph Modes["🎯 Intent Modes"]
        DISCUSS[DISCUSS/PLAN]
        BUILD[BUILD/EDIT]
        DEBUG[DEBUG]
        RESEARCH[RESEARCH]
        GROWTH[GROWTH]
    end

    subgraph Agents["🤖 Specialized Agents"]
        subgraph Strategy["Strategy"]
            PM[PM]
            ARCH[ARCHITECT]
        end
        subgraph Design["Design"]
            UI[DESIGNER_UI]
            UX[UX_WRITER]
        end
        subgraph Engineering["Engineering"]
            FE[FRONTEND]
            BE[BACKEND]
            DB[DB_DATA]
            AI[AI_ENGINEER]
        end
        subgraph Automation["Automation"]
            AUTO[AUTOMATION]
            VOICE[VOICE_AGENT]
        end
        subgraph Quality["Quality"]
            TEST[TEST_QA]
            SEC[SECURITY]
            PERF[PERF_RELIABILITY]
        end
        subgraph Content["Content"]
            MKT[GROWTH_MARKETING]
            CONT[CONTENT_STUDIO]
            DOCS[DOCS_DEVREL]
        end
    end

    subgraph Output["📤 Output"]
        ARTIFACT[xandArtifact]
    end

    REQ --> CLASSIFY
    CLASSIFY --> DISCUSS
    CLASSIFY --> BUILD
    CLASSIFY --> DEBUG
    CLASSIFY --> RESEARCH
    CLASSIFY --> GROWTH

    DISCUSS --> ROUTE
    BUILD --> ROUTE
    DEBUG --> ROUTE
    RESEARCH --> ROUTE
    GROWTH --> ROUTE

    ROUTE --> Strategy
    ROUTE --> Design
    ROUTE --> Engineering
    ROUTE --> Automation
    ROUTE --> Quality
    ROUTE --> Content

    Strategy --> COMPOSE
    Design --> COMPOSE
    Engineering --> COMPOSE
    Automation --> COMPOSE
    Quality --> COMPOSE
    Content --> COMPOSE

    COMPOSE --> ARTIFACT
```

---

## Agent Dependencies Flow

```mermaid
flowchart LR
    subgraph Phase1["Phase 1: Planning"]
        PM[PM<br/>Requirements]
        ARCH[ARCHITECT<br/>System Design]
    end

    subgraph Phase2["Phase 2: Design"]
        UI[DESIGNER_UI<br/>Visual System]
        DB[DB_DATA<br/>Schema]
    end

    subgraph Phase3["Phase 3: Build"]
        FE[FRONTEND<br/>UI Code]
        BE[BACKEND<br/>API Code]
        AI[AI_ENGINEER<br/>AI Features]
        AUTO[AUTOMATION<br/>Workflows]
    end

    subgraph Phase4["Phase 4: Quality"]
        TEST[TEST_QA<br/>Testing]
        SEC[SECURITY<br/>Review]
        PERF[PERF_RELIABILITY<br/>Performance]
    end

    PM --> ARCH
    ARCH --> UI
    ARCH --> DB
    UI --> FE
    DB --> BE
    ARCH --> AI
    ARCH --> AUTO
    FE --> TEST
    BE --> TEST
    FE --> SEC
    BE --> SEC
    FE --> PERF
```

---

## Request Processing Pipeline

```mermaid
sequenceDiagram
    participant U as User
    participant C as Core Orchestrator
    participant A as Agent(s)
    participant O as Output

    U->>C: Send Request
    
    rect rgb(240, 240, 255)
        Note over C: 1. CLASSIFY
        C->>C: Determine Intent Mode
        C->>C: Identify Required Agents
    end

    rect rgb(240, 255, 240)
        Note over C: 2. ROUTE
        C->>C: Check Dependencies
        C->>C: Plan Parallel vs Sequential
    end

    rect rgb(255, 240, 240)
        Note over C,A: 3. DISPATCH
        alt Parallel Execution
            C->>A: Agent A
            C->>A: Agent B
            C->>A: Agent C
            A-->>C: Results
        else Sequential Execution
            C->>A: Agent A
            A-->>C: Result A
            C->>A: Agent B (uses Result A)
            A-->>C: Result B
        end
    end

    rect rgb(255, 255, 240)
        Note over C,O: 4. COMPOSE
        C->>C: Merge Agent Outputs
        C->>C: Resolve Conflicts
        C->>O: Create xandArtifact
    end

    O-->>U: Unified Response
```

---

## Build Request Example Flow

```mermaid
flowchart TD
    REQ["User: Build me a SaaS with auth"]

    subgraph Step1["Step 1: Scope"]
        PM1[PM clarifies requirements]
    end

    subgraph Step2["Step 2: Architecture"]
        ARCH1[ARCHITECT designs system]
    end

    subgraph Step3["Step 3: Foundation"]
        direction LR
        UI1[DESIGNER_UI<br/>creates design system]
        DB1[DB_DATA<br/>creates schema + RLS]
    end

    subgraph Step4["Step 4: Implementation"]
        direction LR
        FE1[FRONTEND<br/>builds UI components]
        BE1[BACKEND<br/>builds API routes]
    end

    subgraph Step5["Step 5: Review"]
        SEC1[SECURITY reviews]
    end

    subgraph Output["Final Output"]
        ART[xandArtifact with:<br/>- Schema migration<br/>- API routes<br/>- React components<br/>- Auth flow]
    end

    REQ --> Step1
    Step1 --> Step2
    Step2 --> Step3
    Step3 --> Step4
    Step4 --> Step5
    Step5 --> Output

    style Step3 fill:#e1f5fe
    style Step4 fill:#e1f5fe
```

---

## Agent Communication Pattern

```mermaid
flowchart TD
    CORE[x-and Core]

    subgraph AgentCall["Agent Invocation"]
        INPUT[Input Context]
        THINK[Agent Thinking]
        OUTPUT[Structured Output]
    end

    subgraph Response["Agent Response"]
        RESULT[Result<br/>code/design/strategy]
        ASSUME[Assumptions Made]
        DECIDE[Decisions Needing Approval]
    end

    CORE -->|"Task + Context"| INPUT
    INPUT --> THINK
    THINK --> OUTPUT
    OUTPUT --> RESULT
    OUTPUT --> ASSUME
    OUTPUT --> DECIDE
    RESULT -->|"Merge into artifact"| CORE
    ASSUME -->|"Document"| CORE
    DECIDE -->|"Flag for user"| CORE
```

---

## Three Pillars Integration

```mermaid
flowchart LR
    subgraph BUILD["🔨 BUILD"]
        B1[Web Apps]
        B2[Mobile Apps]
        B3[AI Tools]
        B4[Internal Tools]
    end

    subgraph BRAND["🎨 BRAND"]
        BR1[Visual Identity]
        BR2[Messaging]
        BR3[Website]
        BR4[Social Content]
    end

    subgraph RUN["⚙️ RUN"]
        R1[Automations]
        R2[CRM]
        R3[Voice Agents]
        R4[Analytics]
    end

    BUILD <-->|"Connected"| BRAND
    BRAND <-->|"Connected"| RUN
    RUN <-->|"Connected"| BUILD

    style BUILD fill:#e3f2fd
    style BRAND fill:#fce4ec
    style RUN fill:#e8f5e9
```

---

## File: x-and-architecture.md
