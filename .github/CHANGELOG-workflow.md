# CHANGELOG of GitHub Actions Workflow and Tests

## 2024-08-12

### Added

- For all workflow yaml files excluding dependabot.yml and FUNDING.yml, enable github actions on all branches:

    ```
    on:
    push:
        branches:
                - '*'
    ```

- For `integration-test.yml`, added env under `Cypress run`:

    ```
    env:
        SKIP_OLLAMA_TESTS: 'true'
    ```

- For `cypress/e2e/chat.cy.ts`, added env condition `SKIP_OLLAMA_TESTS`.

### Removed

- Removed jobs `Wait for Ollama to be up` and `Preload Ollama model` in `integration-test.yml`