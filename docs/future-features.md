# Future Features Backlog

This prioritized backlog is a source for future GitHub issues.

## Highest priority

- Publish a prominent medical-content disclaimer: quizzes reinforce learning only and do not replace EMT training, local protocols, clinical judgment, or medical advice.
- Define a content-review owner and review/update cadence, with an explicit process and required human review before publishing medical or other sensitive-domain content.
- Define a versioned quiz JSON contract using a required `version` field, with an explicit migration policy for future contract revisions.
- Provide a machine-readable JSON Schema and local content-validation command; validate every quiz JSON file against the contract automatically before publishing and fail publication on malformed, missing, invalid, or questionless data.
- Publish an AI-friendly authoring guide for the quiz contract: required and optional fields, validation rules, valid and invalid examples, JSON-only output guidance, filenames, quiz identifiers, randomisation, accessible question writing, and publishing quiz links.
- Provide robust user-facing errors and recovery paths for absent quiz identifiers, unavailable quiz files, malformed JSON, and invalid quiz structures.
- Unanswered-submission confirmation.
- Verify accessibility across keyboard navigation, screen-reader use, browser zoom, small screens, light and dark modes, and reduced motion; refine focus management after navigation and submission and announce quiz progress to screen readers.
- Establish automated GitHub Pages deployment for building, validating, and publishing static files, and document repository- and project-page base-path configuration.
- Add automated regression coverage for quiz loading, scoring, unanswered submission, stable question and answer randomisation, navigation, and locked results.

## Useful next

- Optional answer explanations in results.
- Optional per-quiz metadata: document title, description, share metadata, topic, source URL, estimated time, tags, and attribution. Podcast and video fields remain optional.
- Quiz directory or parent-site integration after the framework is selected.
- Copy quiz link.
- Define a static asset convention for optional local images and diagrams that remains compatible with GitHub Pages.
- Define a privacy statement and implementation approach before adding analytics, embeds, or external media.
- Lightweight branding configuration for quiz/site title, logo or wordmark, and Material-compatible brand colour tokens, preserving accessible contrast in light and dark modes; not a visual page builder or full theming system.

## Later/optional

- Images or diagrams.
- Explanations with external references or timestamps.
- A simple content generator, but no CMS.
- Optional MCP support for AI-assisted authoring, using project-local, file-based tools such as `get_quiz_schema`, `validate_quiz`, `list_quizzes`, and `create_quiz_template`; it must not require a backend.

## Product decisions / open questions

Unresolved decisions should be linked from related GitHub issues.

- Who reviews medical content, and what review/update cadence applies?
- Should medical disclaimers appear globally, on each medical quiz, or both?
- Will the parent site provide privacy and accessibility statements?
- Should podcast/video pages launch the quiz in a dedicated page or embed it?
- Which parent-site framework will provide quiz discovery and navigation?
- Should exactly four answer options remain a permanent rule or only an initial constraint?
- How should future localisation and multiple languages be supported?
- Should optional images be planned in the content contract now even if implementation waits?
- Will the parent site provide quiz discovery, or should this template eventually support it directly?
- Which AI authoring tools should be targeted first?
- Should future MCP support be project-local or reusable across quiz repositories?

## Out of scope

- Authentication or saved progress.
- Formal grading or accreditation.
- Server or database dependencies.
- Full browser authoring tool.

The future profile and recorded-results product is separate from this template. It must not introduce authentication, persistence, analytics, or backend scope here, though it may later reuse the quiz content contract.
