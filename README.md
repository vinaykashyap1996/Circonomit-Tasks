# Circonomit Tasks

Welcome to the Circonomit Tasks repository!  
This project contains solutions and prototypes for advanced business simulation and modeling challenges, inspired by real-world scenarios at STK Produktion GmbH—a fictional manufacturer of plastic and metal parts facing fluctuating energy prices, delivery constraints, and diverse product variants.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Challenge Structure](#challenge-structure)
- [Technology Stack](#technology-stack)
---

## Project Overview

This repository explores the end-to-end design of a simulation platform through four building-block tasks:

1. **Simulation & Feedback in the Data Model:**  
   Extend a block-attribute data model to support simulation runs, time-dependent calculations, feedback loops, and result management.

2. **Calculation Layer, Caching & Architecture:**  
   Design technical strategies for efficient simulation execution, including stack placement, caching, parallelization, and handling non-deterministic processes.

3. **Knowledge Modeling from Unstructured Sources:**  
   Prototype methods to extract structured simulation logic from natural-language input (e.g., conversations, PDFs), blending rule-based and NLP-driven approaches.

4. **UX & Usability for Non-Technical Users:**  
   Propose and prototype intuitive, LEGO-like interfaces, enabling users to build, interact with, and understand complex models without programming skills.

Each task can be implemented as code, pseudocode, sketches, or textual/visual concepts.

---

## Challenge Structure

### Task 1: Simulation & Feedback in the Data Model

- **Block-Attribute System:** Group inputs and calculated fields.
- **Simulation Runs:** Temporarily override inputs (e.g., simulate future customs duties).
- **Time & Feedback:** Model time-delayed effects and cyclic dependencies (feedback loops).
- **Result Management:** Store, compare, and retrieve results by time step and version.

### Task 2: Calculation Layer, Caching & Architecture

- **Location of Computation:** Delineate responsibilities across client, server, and worker processes.
- **Caching:** Reuse intermediate results for performance.
- **Parallelization:** Speed up simulations using distributed or concurrent processing.
- **Side Effects:** Mitigate non-determinism and ensure reproducibility.

### Task 3: Language to Structure – Knowledge Modeling

- **NLP & Rule Extraction:** Convert statements like  
  _"If energy costs rise above €200/MWh, postpone production by one week."_  
  into simulation logic.
- **Knowledge Representation:** Use ontologies, vocabularies, and rule engines.
- **Hybrid Methodology:** Combine prompt-based, rule-based, and data-driven extraction for robust knowledge modeling.

### Task 4: UX & Usability

- **Question Formulation:** Let users ask "What if..." in plain language.
- **Model Building:** Visual, block-based editors for assembling and modifying models.
- **Result Exploration:** Intuitive result comparison, feedback loop explanation, and scenario visualization.
- **Explainability:** Visual aids and walkthroughs help users understand model logic (including feedback cycles).

---

## Technology Stack

- **Languages:** TypeScript, HTML, CSS
- **Frontend:** React (with TypeScript), React Charts for visualization
- **Backend:** Node.js, Express, PostgreSQL
- **NLP & Knowledge Graph:** spaCy/NLTK, Neo4j
- **Infrastructure:** Docker, Redis, GitHub Actions 
