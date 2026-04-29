# Reusable Python CI Workflow

This repository provides a reusable GitHub Actions template for running Python CI (Linting, Unit Tests, and Security Scans) using `uv` (a python dependency management tool).

## How to implement it in your repository

### 1. Add the Template (if storing locally)
If you are keeping the template in the same repository, save the template file as `.github/workflows/ci-template.yml`. 

### 2. Create the Caller Workflow
In your target repository, create a new workflow file (e.g., `.github/workflows/ci.yml`) and use the `uses` keyword to call the template. 

Copy and paste the following snippet, adjusting the inputs for your specific project:

```yaml
name: Project CI

on: [push, pull_request, workflow_dispatch]

jobs:
  run-ci:
    # If the template is in the SAME repo:
    uses: ./.github/workflows/ci-template.yml
    
    # If the template is in a DIFFERENT repo, use this format instead:
    # uses: your-org/your-central-repo/.github/workflows/ci-template.yml@main
    
    with:
      working-directory: "path/to/your/code" # Required: Directory where your code lives
      python-version: "3.14"                 # Optional: Defaults to 3.14
      runner: "ubuntu-latest"                # Optional: Defaults to self-hosted. Use ubuntu-latest for GitHub cloud runners.