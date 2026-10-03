# About CyberPath

CyberPath is a personal learning tracker for getting into cybersecurity as a software developer. It answers three questions that a list of bookmarks cannot:

1. **What should I learn next, and in what order?** (the roadmap)
2. **Am I actually making progress?** (tasks, a study journal, streaks and weekly stats)
3. **Did I really understand it, or did I just read it?** (questions, self-assessment and an exam mode)

This document explains why the project exists, why the roadmap looks the way it does, and why it points to outside platforms instead of teaching the material itself.

## Why this project exists

Starting in security is overwhelming. There are dozens of specialisations, hundreds of tools and an endless stream of courses. The common failure modes are well known:

- **Tool collecting** — learning fifty tools without understanding what any of them does underneath.
- **Skipping the fundamentals** — jumping into "hacking" without knowing how networks, operating systems or the web work.
- **Passive learning** — watching videos and reading articles without doing anything hands-on.
- **No feedback loop** — finishing a course and never checking whether the knowledge stuck.

CyberPath is built to counter each of these: a fixed order that starts with fundamentals, resources that are almost all hands-on, a journal that forces you to write things down in your own words, and questions that check understanding instead of completion.

It is also a deliberate developer project. A backend developer moving into security has an advantage — they can read code — and CyberPath leans into that: web security and secure coding take a large part of the roadmap, and the project itself (Spring Boot API, React UI, PostgreSQL, Docker) is a practical playground for applying what is learned.

## How learning works in CyberPath

Every topic is treated like a **room**, a format borrowed from TryHackMe:

| Part of a topic | Purpose |
|---|---|
| **Resources** | Where to study it — courses, labs, videos, official documentation. |
| **Tasks** | Small, concrete steps ("Bandit levels 0–5") so a big topic never feels vague. |
| **Questions** | Multiple-choice questions are graded instantly; open-ended questions are answered in your own words and reviewed. |
| **Notes** | A template that asks *What is it? Why does it happen? How is it prevented?* — explaining something is the best test of understanding it. |
| **Self-assessment** | A 1–5 rating of how well you understand the topic. |

Progress is not just "I clicked complete". A topic's progress combines finished resources and correctly answered questions, and it never reaches 100% until you mark it as completed yourself. If you mark a topic as completed but your quiz score is below 70% or your self-assessment is low, CyberPath flags it with **"May need review"**. The goal is honest feedback, not a satisfying progress bar.

The **journal** asks three things every day: what did I learn, where did I struggle, what is next. Writing the "struggles" down turns vague confusion into concrete questions. The **exam mode** mixes questions from several topics, because recalling something out of context is a much better test than answering it right after reading the chapter.

## Why the roadmap is in this order

The roadmap goes from foundations to specialisation. Each step depends on the ones before it.

| # | Topic | Why it is here |
|---|---|---|
| 1 | **Linux Fundamentals** | Most servers and most security tools run on Linux. Permissions, processes and logs are where both attacks and investigations happen. |
| 2 | **Networking Fundamentals** | Every attack and every defence crosses a network. Without TCP/IP, DNS and HTTP, firewalls and traffic analysis make no sense. |
| 3 | **Cryptography Fundamentals** | Developers misuse crypto far more often than they break it: Base64 mistaken for encryption, passwords stored with fast hashes, TLS misconfigured. Knowing the difference is basic hygiene. |
| 4 | **Security Fundamentals** | The shared vocabulary of the field: the CIA triad, least privilege, defence in depth, threat types. |
| 5 | **Web Security** | The biggest attack surface for most organisations, and the area where a developer can contribute fastest. Built around the OWASP Top 10. |
| 6 | **Web Testing Methodology** | Finding vulnerabilities systematically and within an authorised scope, instead of poking around at random. |
| 7 | **Secure Code (Java/Spring)** | Turning knowledge of vulnerabilities into code that does not have them — the most valuable skill for a developer in security. |
| 8 | **DVWA Lab** | A deliberately vulnerable app run locally. Comparing each difficulty level's source code with the "Impossible" level shows exactly what a fix looks like. |
| 9 | **Intro to Bug Bounty** | How real-world, legal vulnerability research works: scope, rules and responsible disclosure. |
| 10 | **Defense (Blue Team)** | Log analysis, SIEM, incident response and MITRE ATT&CK. Understanding detection makes you a better builder and a better tester. |

Web security and secure coding take up three slots on purpose: for someone coming from software development, application security is the most natural entry point, where existing skills count the most.

## Why TryHackMe, PortSwigger and the others

CyberPath does not try to be a course. Excellent free and legal training already exists, and rewriting it would produce something worse. Instead, CyberPath organises it, tracks it and checks that it stuck. Each resource was chosen for a reason:

| Resource | Why it was chosen |
|---|---|
| **OverTheWire Bandit** | Teaches the Linux command line as a game; every level needs a new command or concept. Free, nothing to install. |
| **TryHackMe** (Pre Security, Cyber Security 101, Linux Fundamentals, SOC Level 1) | Guided, beginner-friendly "rooms" with an in-browser lab: read a short explanation, then do it immediately. The room format inspired CyberPath's topic pages. |
| **Professor Messer (Security+)** | Free, structured video coverage of the fundamentals; a good complement when a concept needs a second explanation. |
| **CryptoHack** | Learning cryptography by solving challenges instead of memorising definitions. |
| **Dan Boneh — Cryptography I** | A rigorous university course for anyone who wants to understand why the primitives work. |
| **PortSwigger Web Security Academy** | Widely regarded as the best free web security training: every vulnerability class comes with an explanation, how to find it, how to prevent it, and a legal lab to practise on. |
| **OWASP Top 10, WSTG and Cheat Sheet Series** | The industry's reference material: the Top 10 says what matters, the Testing Guide says how to test it methodically, and the Cheat Sheets say how to build it correctly. |
| **Spring Security Reference** | The authoritative source for doing authentication and authorisation correctly in the Java ecosystem. |
| **DVWA** | A safe, local target, so practice never touches a system you do not own. |
| **Hacker101** | HackerOne's free course on how real bug bounty work is done. |
| **MITRE ATT&CK and LetsDefend** | The common language of defenders, and hands-on alert triage practice for the blue-team side. |

Two rules guided the selection: **hands-on over passive** (most resources are labs or challenge-based), and **legal by design** (every practice environment is either your own machine or a platform built for training).

## Why there is an AI assistant integration

CyberPath ships with an MCP server so an AI assistant (for example Claude Code) can read your progress and work with you:

- When you finish a topic, it can add **new questions** that do not repeat existing ones.
- It can **review open-ended answers** and leave short feedback, which is the part a program cannot grade on its own.
- It can look at your journal and point out topics that need another look.

The assistant is instructed to keep questions **conceptual and defence-oriented** — *what is it, why does it happen, how is it prevented* — and never to produce attack payloads or step-by-step exploitation. It does not change a topic's status unless you ask.

## Ethics

Everything in CyberPath assumes one rule: **only test systems you own or have explicit written permission to test.** Unauthorised scanning or exploitation is illegal in most countries. The roadmap only points to environments made for practice: your own local labs, training platforms, CTFs, and bug bounty programmes within their published scope.

## What CyberPath is not

- **Not a course.** It organises and verifies learning; the teaching happens in the linked resources.
- **Not a multi-user or internet-facing service.** It has no authentication and is meant to run on `127.0.0.1` only. See the [README](README.md).
- **Not a finished curriculum.** The roadmap is a starting point. Add topics such as cloud security, Active Directory or malware analysis as your interests become clearer.
