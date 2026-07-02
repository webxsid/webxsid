---
title: Weighted Priority Queue with Anti-Starvation Pop Logic
summary: Building a weighted in-memory task queue with anti-starvation pop logic for multi-environment job processing.
tags:
  - queues
  - scheduling
  - concurrency
  - python
  - mongodb
  - backend
  - worker-systems
  - task-processing
kind: blog
publishedAt: 2025-04-19
featured: true
order: 1
seo:
  title: "Weighted Priority Queue with Anti-Starvation Pop Logic"
  description: "A practical backend write-up on building a weighted in-memory priority queue with anti-starvation behavior, per-environment fairness, and MongoDB-backed recovery."
---

While working on a new feature recently, the requirements called for a task manager that accepts jobs from different app environments - Development, QA, Staging, & Production - and feeds them to a processing worker thread.

The main challenge was balancing the task priority. Production tasks obviously needed to processed first but that might leave the other jobs starving in queue, especially during periods of heavy load. So I implemented a rudimentary weighted priority queue with a `4:3:2:1 `pop ratio with a few guardrails to make sure lower-priority tasks still got picked.


### Table of Contents

1. [Key Design Points](#key-design-points)  
2. [How it Works](#how-it-works)  
3. [Limitations](#limitations)  
4. [Possible Improvements](#possible-improvements)  
5. [Why Not a Package?](#why-a-custom-queue)  

----

## TL;DR
 - Built a custom in-memory task queue to handle multi-environment job ingestion with weighted priority (Prod:Staging:QA:Dev = 4:3:2:1).
 - Each environment maintains its own task queue and independent pop counter to enforce ratio-based fairness.
 - Queue is memory-first for low-latency access, with periodic MongoDB sync for persistence and crash recovery.
 - A custom solution was preferred over existing libraries to tightly control behavior, avoid over-engineering, and ensure minimal dependencies.


## Design Overview

The task manager processes jobs from different environments with varying priority. The goal is to ensure high-priority jobs are processed promptly, while still proving a fair change for lower-priority jobs.

### Key Design Points

1. **Task Prioritization**: Tasks are pulled from the queue based on environment priority. Production tasks are given the highest priority, followed by staging, QA, and development.

2. **Independent Queues per Environment**: Each environment has its own queue, which helps separate tasks from different environments and ensures that tasks from higher-priority environments can be processed first without interference.

3. **In-memory Queue with MongoDB Sync**: The task queue operates in memory for fast access, but periodically syncs to MongoDB to ensure data persistence and recovery in case of system failure.

4. **Fair Task Distribution with Independent Counters**: Each environment has its own independent counter to track task processing. This helps maintain the 4:3:2:1 weighted ratio between environments.

By combining this env based job prioritization, and periodic syncing to MongoDB for fault tolerance, the task manager ensure efficiency & fairness in handling tasks from different environments.


## How It Works

The task manager operates with a straightforward process flow designed to ensure tasks are processed fairly while prioritizing higher-priority environments. Here’s a breakdown of how it works:

1. **Job Insertion**:
  
  - When a job is inserted, the environment (env) is checked, and the job is added to the corresponding queue.

```python
def insert(self, job_id: str, job_data: Dict[str, Any]) -> None:
    env = job_data.get("env")
    if env not in self.queues:
        return  # Ignore invalid environments

    with self.lock:
        self.queues[env].append((job_id, job_data))
```

2. **Queue Management**:
  - Each environment has it's own queue, which ensure the priorities of each env task doesn't get mixed up
  - Independent counters are maintained for each environment to maintain the 4:3:2:1 ration

  ```python
  def __init__(self) -> None:
      self.queues: Dict[str, List[Tuple[str, Dict[str, Any]]]] = {
          "production": [],
          "staging": [],
          "qa": [],
          "development": [],
      }
      self.counters = {"production": 0, "staging": 0, "qa": 0, "development": 0}
  ```

3. **Task Prioritization** _(Weighted Ratio)_:
  
  The `pop_next_job` function pulls tasks based on a weighted ratio:

  - 4 production tasks
  - 3 staging tasks
  - 2 QA tasks
  - 1 development task

  ```python
  def pop_next_job(self) -> Optional[Tuple[str, Dict[str, Any]]]:
      with self.lock:
          order = [
              "production", "production", "production", "production",
              "staging", "staging", "staging",
              "qa", "qa", 
              "development"
          ]
          for env in order:
              if self.queues[env]:
                  self.counters[env] += 1
                  return self.queues[env].pop(0)
      return None
  ```

4. **Periodic MongoDB Sync**:

The task queue is synced periodically with MongoDB to ensure persistence and data recovery.

  ```python
  def sync_to_db(self) -> None:
      with self.lock:
          existing_jobs = {job.jobId: job for job in GazeTrackingJob.objects.all()}
          bulk_updates = []

          for env in self.queues:
              for job_id, job_data in self.queues[env]:
                  job = existing_jobs.get(job_id, GazeTrackingJob(jobId=job_id))
                  job.update(**job_data)
                  bulk_updates.append(job)

          # Bulk update and delete jobs
          if bulk_updates:
              GazeTrackingJob.objects.bulk_update(bulk_updates)
  ```

## Limitations
1. **Limited Task Types**
Only supports basic task queueing logic. No support for scheduling, retry policies, delayed jobs, or result tracking.

2. **No Built-in Fault Tolerance Logic**
While syncing to MongoDB provides persistence, job acknowledgment, retries, or dead-letter queues are not built-in.

3. **Scalability Constraints**
The in-memory model is fine for a single instance. But distributing this queue across multiple machines or processes would require additional coordination logic.

## Possible Improvements
1. **Backpressure Mechanism:** 
Introduce limits on queue size to prevent memory bloat during high-volume job spikes.

2. **Job Expiry / TTL Support**: 
Automatically discard stale or timed-out jobs based on createdAt or expiresAt fields.

3. **Batch Processing Support**: 
Optimize throughput by allowing batch pops instead of one-by-one job fetching.

4. **Priority Override / Manual Injection**: 
Support manual priority override for specific critical jobs during incident recovery or hotfix deployments.

5. **Redis Integration**: 
Swap or complement the in-memory queue with Redis for distributed queue support and better fault tolerance.

6. **Metrics & Monitoring**: 
Add instrumentation hooks to expose queue health, environment-specific load, and sync stats via Prometheus or similar.

## Why a Custom Queue?
1. **Precise Control Over Logic**
Needed custom pull behavior (4:3:2:1) and per-environment counters, which might not be directly supported in existing queue packages.

2. **Minimal Dependencies**
Off-the-shelf solutions (like Bull, Agenda, or Bee-Queue) often bring Redis, workers, and task scheduling systems — overkill for this use case.

3. **Better "Debuggability"**
Custom logic is easier to reason about and debug since it’s all self-contained and transparent.

4. **MongoDB-Based Persistence**'
Most mature queue systems are tightly coupled with Redis. In this case, persistence needed to be MongoDB-based to stay consistent with the existing infrastructure.
	
5. **Lightweight and Purpose-Built**
The goal was a minimal and fast in-memory queue with periodic sync. Building from scratch made it easy to optimize for this specific use case.


