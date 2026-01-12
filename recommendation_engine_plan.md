# Worker Recommendation Engine Design & Implementation Plan

The "Worker Recommendation Engine" will allow users to quickly assemble a specialized team of AI workers by simply describing their goal.

## Design Goals
1. **Intelligent Decomposition**: Break down a high-level mission into logical roles (3-5 workers).
2. **Integrated Automations**: Propose and configure **Triggers** (Scheduled/Event-based) for workers that require recurring or reactive behavior.
3. **Omni-Entry**: Accessible from the Project Library **and** the primary landing page text field (Dashboard prompt).
4. **User-Controlled Automations**: Triggers are presented as **proposals** that the user can accept, skip, or manually add for any worker.
5. **Background-Native**: All workers with active triggers operate autonomously in the **background**, requiring no active session from the user.

## Proposed Architecture

### 1. Recommendation Service (Backend)
The `recommendation.py` service will use an LLM to generate a complete team structure, leveraging:
- `core.prompts.agent_builder_prompt`: As a reference for tool mapping and role definitions.
- `core.utils.icon_generator.generate_icon_and_colors`: To automatically style recommended workers.
- `core.agents.agent_setup.generate_agent_config_from_description`: As a pattern for individual worker config generation.

#### LLM Prompt Strategy (Enhanced)
- **Input**: User's mission statement.
- **Decomposition**: Identifies 3-5 roles.
- **Trigger Proposer**: Suggests scheduled/event triggers where appropriate.
- **Output**: A JSON list of `WorkerProposal` objects.

### 2. Frontend Integration

#### Entry Point 1: Project Library
- "Build Team" button in the action bar.
- Opens the `TeamRecommendationModal` with a blank mission input.

#### Entry Point 2: Landing Page / Dashboard Prompt
- The main `ChatInput` seen upon landing is the primary "Omni-Entry".
- Logic in `useAgentStartInput` will detect intent for complex projects and offer to "Build a Team" instead of starting a single-agent thread.

#### TeamRecommendationModal (Expanded)
- **Mission Input**: Prefilled if coming from the landing page.
- **Worker Cards**: Displays Name, Prompt, and **Suggested Trigger**.
- **Editability**: Users can refine prompts or adjust trigger settings.
- **Creation Logic**: 
  - Backend will provide a `POST /recommend/create` endpoint or frontend will iterate `POST /agents`.
  - Reuses `core.agents.api.start_agent_run` logic to ensure all workers are immediately initialized with their workspace.

## Proposed Trigger Logic
- If a worker is a "Monitor" or "Researcher", suggest a `schedule` trigger.
- If a worker is a "Responder" or "Notifier", suggest an `event` trigger via Composio integration.

## Feature Flow
1. **Initiation**: A user enters a broad mission (e.g., "I want to start a newsletter") into the **Landing Page Prompt**.
2. **Intent Detection**: The frontend detects a multifaceted request and offers a "Build Team" recommendation.
3. **Decomposition**: The backend `recommendation.py` service uses an LLM to "think" like a workforce architect, breaking the mission into 3-5 specialized roles.
4. **Drafting (Modal)**: The `TeamRecommendationModal` opens, presenting the user with a draft team.
5. **Human-in-the-Loop**: The user reviews the workers, edits prompts, and decides which **Suggested Triggers** (automations) to activate.
6. **Mass Deployment**: Once confirmed, the system uses existing batch patterns to create all agents and triggers simultaneously.
7. **Workspace Ready**: The user is directed to their project library with a fully functional AI team.

## Background Support & Observability (How it works)
The platform is natively designed for background operations via its **Trigger & Execution Infrastructure**:
- **Persistence**: Once a worker and its trigger are created, they are stored in the database.
- **Asynchronous Execution**: When a trigger condition is met, the platform's `ExecutionService` automatically spawns an agent run.
- **Observable Work (UI Flow)**: 
  - Every background run is tied to a **Thread** in the project's workspace.
  - When you land on the dashboard or library, you will see the active/recent runs for your workers.
  - Clicking a worker's chat will open the standard **Conversation View**.
  - Here, you can watch the worker "thinking", using tools, and generating output in real-time, even if it was started by a background trigger.
- **Result Persistence**: You don't need to be online to "capture" the results; the worker will save its output and files directly to your workspace.

## Leveraging Existing Features
- **TriggerService & ExecutionService**: These are the engines that make "Background Work" possible. We are simply configuring them through the recommendation engine.

## Verification & Iteration
1. **Trigger Proposal Quality**: Verify the LLM correctly suggests triggers for automation roles.
2. **Dashboard Interception**: Ensure the transition from Dashboard prompt to Recommendation Modal is smooth.
3. **Batch Performance**: Verify that creating 5 agents + 5 triggers in one flow is reliable.
