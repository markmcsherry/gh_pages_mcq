# MCQ Platform Context

## Product

This repository is a template for a multiple-choice question (MCQ) platform. It will present quizzes defined by JSON files and let end users answer their questions and complete a quiz.

Each quiz has its own JSON file. Every question has exactly four answers labelled `a` through `d`, and exactly one correct answer.

Quizzes are informal knowledge-reinforcement companions to podcasts or videos. Scores do not contribute to formal assessment or accreditation.

## Technical Constraints

- Build the quiz experience as a basic React application.
- The application must work when deployed as static files on GitHub Pages.
- Quiz data must be usable from static, relative URLs; do not require a server, database, or runtime API.
- Keep the template independent of a parent-site framework until that framework is selected.
- Use Material Design as the visual design language. Do not select a Material component library unless implementation needs justify it.

## Development Guidance

- Keep quiz content separate from application code.
- Maintain a small sample quiz in `public/data/sample-quiz.json` for development and testing.
- Treat `docs/product.md` as the detailed product definition and source of truth for the initial quiz data contract.
- Design responsive, accessible interfaces that work from mobile through desktop.
- Support light and dark colour modes, defaulting to the user's system preference and allowing a user to change the mode for their current session.
- When quiz randomisation is enabled, shuffle questions and answers once per attempt and preserve that order through navigation and results.
- Keep answers private until quiz completion: users may navigate back and forward to revise or leave answers blank, but cannot change answers after submitting the quiz.

## Current Boundaries

- This is a reusable template, not the final site containing all quizzes.
- Parent-site navigation and framework integration are intentionally undecided.
- Do not add authentication, persistence, a backend, or authoring tools unless the product scope changes.
