# Product Definition

## Purpose

Provide a reusable, static web template for delivering multiple-choice quizzes. Content authors create one JSON file per quiz, and quiz takers open a quiz, select answers, submit their responses, and see their result.

The intended quizzes accompany podcasts or videos and reinforce knowledge of a subject. They are informal: a user's score does not contribute to assessment, certification, or accreditation.

The template will later be incorporated into a wider site that links to individual quizzes. The framework used by that wider site is not yet selected; MkDocs is one option under consideration.

## Users

- Quiz takers who need a clear, usable way to complete a short set of MCQs.
- Content authors who need to create and maintain quizzes without editing React components.
- Site maintainers who need a template that can be deployed to GitHub Pages without server infrastructure.

## Initial Scope

- Build a basic React quiz experience that can be exported as static files.
- Load quiz content from a static JSON file, including through a relative URL.
- Require the relative JSON file path in the page's `quiz` query parameter. When it is absent or invalid, show an instruction screen rather than a quiz.
- Render each question with four selectable answers labelled `a`, `b`, `c`, and `d`.
- Require exactly one correct answer per question in the quiz data.
- Let users move back and forward through a quiz, retaining and changing their selections until submission.
- Allow a user to submit with unanswered questions; treat every unanswered question as incorrect.
- Reveal the score only after quiz submission, then show a review of the questions answered incorrectly.
- Lock answers after submission; users cannot return to the quiz to change them.
- Include sample quiz content for local development and manual testing.

## Experience and Design Requirements

- Use [Material Design](https://m3.material.io/) as the visual design language.
- The quiz experience must be responsive and usable on mobile, tablet, and desktop screen sizes.
- Controls must remain easy to read, navigate with a keyboard, and operate by touch at every supported size.
- Support both light and dark colour modes. Default to the user's operating-system or browser preference when available, and provide a visible control to change the mode during the current session.
- The initial implementation does not need to persist the user's selected colour mode between visits because the template has no persistence requirement.

The specific React Material Design component library is intentionally undecided. Select one during implementation only if it is appropriate for the chosen React tooling and static build.

## Quiz Completion Flow

1. The user selects, changes, or leaves blank answers while moving between questions.
2. On the final question, the user can submit the quiz even if some questions are unanswered.
3. Before submission, the interface should clearly identify the number of unanswered questions and explain that they count as incorrect.
4. On submission, the quiz becomes read-only.
5. The results screen shows the total score and a review of every incorrectly answered or unanswered question. It should identify the correct answer for each reviewed question.

Correctness must not be shown while the user is answering questions.

## Quiz Data Contract

Each quiz is a JSON object with a stable identifier, display metadata, and a non-empty list of questions.

```json
{
  "id": "sample-general-knowledge",
  "title": "Sample General Knowledge Quiz",
  "description": "A short quiz used to test the template.",
  "questions": [
    {
      "id": "capital-of-france",
      "question": "What is the capital of France?",
      "answers": {
        "a": "Madrid",
        "b": "Paris",
        "c": "Rome",
        "d": "Berlin"
      },
      "correctAnswer": "b"
    }
  ]
}
```

Validation rules for the initial contract:

- `id`, `title`, and `questions` are required for every quiz.
- Every question has a unique `id` within its quiz.
- `question`, `answers`, and `correctAnswer` are required for every question.
- `answers` contains exactly the keys `a`, `b`, `c`, and `d`.
- `correctAnswer` is exactly one of `a`, `b`, `c`, or `d`.

## Constraints

- GitHub Pages hosts static files only. The initial product must not depend on a database, authentication service, server-side rendering, or custom API.
- Quiz files should be deployed under `public/data/` and addressed by relative paths in the `quiz` query parameter so the app works under a GitHub Pages repository base path. For example, `?quiz=data/sample-quiz.json`.
- The template must remain usable independently while the surrounding site framework is evaluated.
- The interface must meet the experience and design requirements without requiring a parent-site theme or runtime service.

## Non-Goals

- User accounts, saved progress, and cross-device history.
- A browser-based quiz authoring interface.
- Multi-answer questions, free-text answers, timed quizzes, or question randomisation.
- Formal assessment, certification, or graded outcomes.
- Defining the parent site's information architecture, navigation, or chosen framework.

## Future Decisions

- Whether a quiz is selected from a URL parameter, route segment, or parent-site link.
- Whether questions later need explanations, media, categories, or difficulty metadata.
- How the selected parent-site framework will publish or embed the React template.
