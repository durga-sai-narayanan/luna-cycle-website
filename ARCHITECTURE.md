# LunaCycle — System Architecture

This document describes the intended architecture and data flow of LunaCycle.

## High-Level Architecture

```text
                              LunaCycle
                         FemTech Web Platform
                                  │
          ┌───────────────────────┼────────────────────────┐
          │                       │                        │
          ▼                       ▼                        ▼
 ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
 │ Symptom Checker │     │  Period Tracker │     │    Condition    │
 │                 │     │                 │     │    Explorer     │
 └────────┬────────┘     └────────┬────────┘     └────────┬────────┘
          │                       │                        │
          │                       │                        │
          ▼                       ▼                        ▼
 ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
 │ Symptom Data    │     │ Cycle Data      │     │ Condition Data  │
 │                 │     │                 │     │                 │
 │ • Symptoms      │     │ • Start dates   │     │ • Symptoms      │
 │ • Frequency     │     │ • End dates     │     │ • Causes        │
 │ • Duration      │     │ • Flow         │     │ • Features      │
 │ • Timing        │     │ • Symptoms     │     │ • Sources       │
 │ • Other inputs  │     │ • History      │     │ • Research      │
 └────────┬────────┘     └────────┬────────┘     └────────┬────────┘
          │                       │                        │
          └───────────────────────┼────────────────────────┘
                                  │
                                  ▼
                      ┌─────────────────────┐
                      │ User-Controlled Data│
                      │                     │
                      │ Save / Edit / Delete│
                      │ Optional information│
                      └──────────┬──────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │ Future User Accounts   │
                    │ & Authentication       │
                    └────────────────────────┘


      ┌────────────────────────────────────────────────────┐
      │                 Supporting Systems                 │
      ├────────────────────────────────────────────────────┤
      │                                                    │
      │  Product Science                                  │
      │  ├── Ingredients                                   │
      │  ├── PFAS                                          │
      │  ├── Microplastics                                 │
      │  ├── Regulation                                    │
      │  └── Research                                      │
      │                                                    │
      │  Educational Chatbot                               │
      │  ├── User Question                                 │
      │  ├── Information Retrieval                         │
      │  ├── Reviewed Knowledge Base                       │
      │  ├── Source Grounding                              │
      │  └── Educational Response                          │
      │                                                    │
      │  Search & Discovery                                │
      │  ├── Condition Search                              │
      │  ├── Product Search                                │
      │  └── Source Filtering                              │
      │                                                    │
      │  Accessibility & Localization                      │
      │  ├── Plain Language                                │
      │  ├── Language Selection                            │
      │  └── Accessible UI                                 │
      │                                                    │
      └────────────────────────────────────────────────────┘
```

---

## Symptom Checker Flow

```text
User selects symptoms
        ↓
User provides additional context
        │
        ├── Frequency
        ├── Duration
        ├── Timing
        ├── Severity
        └── Other relevant information
        ↓
Matching Engine
        ↓
Condition Matching
        ↓
Ranked Results
        ↓
┌───────────────────────────────────────┐
│ Educational Result                    │
│                                       │
│ Condition A — estimated match: XX%   │
│ Condition B — estimated match: XX%   │
│ Condition C — estimated match: XX%   │
│                                       │
│ Why it matched                       │
│ Other possibilities                   │
│ Information to discuss with a doctor  │
└───────────────────────────────────────┘
        ↓
User decides whether to save information
        ↓
Period Tracker / Future User Profile
```

The matching percentage is an **application-generated symptom-match estimate**. It should not be represented as the probability that a user has a particular disease.

---

## Period Tracker Flow

```text
User enters period information
        ↓
Period start / end
        ↓
Cycle calculations
        ↓
Symptoms / flow / notes
        ↓
Calendar + history
        ↓
User can:
    ├── Edit
    ├── Delete
    └── Review
```

Information originating from the Symptom Checker should never automatically become permanent personal data without user control.

---

## Condition Explorer Flow

```text
User searches or browses
        ↓
Condition
        ↓
┌────────────────────────────┐
│ Overview                   │
│ Common symptoms            │
│ Less common symptoms       │
│ Related conditions         │
│ Risk factors               │
│ Diagnosis information      │
│ Treatment overview*        │
│ Sources                    │
└────────────────────────────┘
        ↓
Credible references
```

*Medical information should be presented educationally and reviewed before publication.

---

## Product Science Flow

```text
Product / Ingredient
        ↓
Scientific Information
        ↓
Evidence Classification
        │
        ├── Established evidence
        ├── Emerging evidence
        ├── Limited evidence
        └── Uncertain / conflicting evidence
        ↓
Plain-language explanation
        ↓
Primary sources / references
```

The goal is to prevent users from confusing scientific research, marketing claims, and established evidence.

---

## Future Chatbot Architecture

```text
                    User Question
                         │
                         ▼
                 ┌───────────────┐
                 │ Chatbot Layer │
                 └───────┬───────┘
                         │
                         ▼
                 Retrieve Relevant
                    Information
                         │
                         ▼
              ┌─────────────────────┐
              │ Reviewed Knowledge  │
              │ Base                │
              ├─────────────────────┤
              │ Conditions          │
              │ Symptoms            │
              │ Product Science     │
              │ Medical Sources     │
              │ Safety Information  │
              └──────────┬──────────┘
                         │
                         ▼
                 Source-Grounded
                    Response
                         │
              ┌──────────┴───────────┐
              ▼                      ▼
        Educational Answer      Source Links
              │
              ▼
        Safety / Urgency Check
              │
       ┌──────┴──────┐
       ▼             ▼
    Routine       Potentially
   Information      Urgent
                     │
                     ▼
              Appropriate safety
               guidance / contacts
```

The chatbot should not independently diagnose users, prescribe medication, or access personal health information unless the user explicitly authorizes that functionality.

---

## Data Separation

A key architectural principle is separating **general medical information** from **personal user information**.

```text
GENERAL INFORMATION
        │
        ├── Conditions
        ├── Symptoms
        ├── Research
        ├── Products
        └── Sources

              ≠

PERSONAL INFORMATION
        │
        ├── Period history
        ├── User-selected symptoms
        ├── Tracker entries
        └── Optional account information
```

This separation should be maintained as additional features are developed.

---

## Future Architecture

As LunaCycle grows, the architecture may eventually include:

```text
Frontend
   │
   ├── Symptom Checker
   ├── Period Tracker
   ├── Condition Explorer
   ├── Product Science
   ├── Chatbot
   └── Accessibility / Localization
            │
            ▼
Application Logic
   │
   ├── Symptom Matching
   ├── Cycle Calculations
   ├── Search
   ├── Recommendations
   └── Safety Logic
            │
            ▼
Backend
   │
   ├── Condition Database
   ├── Source Database
   ├── Product Database
   └── User Data
            │
            ▼
Security / Privacy Layer
   │
   ├── Authentication
   ├── Authorization
   ├── Data Controls
   ├── Deletion
   └── Export
```

The architecture is expected to evolve as features are researched, tested, and reviewed.
