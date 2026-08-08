# gh_pages_mcq

A reusable template for a JSON-driven multiple-choice question (MCQ) platform that can be deployed as a static React application on GitHub Pages.

## Intended Scope

- Each quiz is defined in its own JSON file.
- Each question offers four answers, labelled `a` through `d`.
- Each question has one correct answer.
- Quiz takers can revise answers while completing a quiz, then receive a score and review incorrect answers after submission.
- Unanswered questions can be submitted and are scored as incorrect.
- Quizzes are informal companions to podcasts or videos, not formal assessments.
- The user interface will follow Material Design, work from mobile through desktop, and support light and dark modes.
- The template will later be incorporated into a larger site that links to multiple quizzes.

The parent-site framework has not been chosen. MkDocs is one option being evaluated, so this template should remain independent of any specific parent-site integration.

## Documentation

- [Development context](AGENTS.md)
- [Product definition and quiz JSON contract](docs/product.md)

## Sample Data

[`public/data/sample-quiz.json`](public/data/sample-quiz.json) provides a small, valid quiz for development and testing. It defines the initial content contract consumed by the React application.

Open the sample quiz with the required relative JSON path:

```text
http://localhost:5173/?quiz=data/sample-quiz.json
```

Without the `quiz` parameter, the app displays instructions rather than a quiz.

## Run Locally

```sh
npm install
npm run dev
```

Create a production-ready static build with:

```sh
npm run build
```

The built files are written to `dist/`. The build uses relative asset paths so it can be deployed to GitHub Pages project sites.

## Implementation

The initial React application is intentionally dependency-light: React, React DOM, and Vite for static builds. It loads the sample quiz JSON as a separate static asset, rather than bundling quiz content into the application code.
