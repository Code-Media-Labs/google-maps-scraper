# Contributing to @cml/google-maps-scraper

Thank you for your interest in contributing!  
We welcome all contributions — from bug fixes and new features to documentation improvements and examples.

This document explains the guidelines and process for contributing to the project.

---

## 🚀 How to Contribute

### 1. Fork the repository

Click the **Fork** button on GitHub and clone your fork:

```bash
git clone https://github.com/YOUR-USERNAME/google-maps-scraper.git
cd google-maps-scraper
```

Add the original repo as a remote:

`git remote add upstream https://github.com/Code-Media-Labs/google-maps-scraper.git`

---

## 🔧 Development Setup

Install dependencies:

`npm install`

### Run the CLI locally:

`node ./bin/gmaps-scraper.js scrape -q "Hotels in Puri"`

### Run the test suite:

`npm test`

### Run ESLint:

`npm run lint`

---

## 🧪 Writing Tests

All features and fixes MUST include unit tests.  
We use **Jest** under `/tests`.

Guidelines:

- One test file per module
- Use mocks for Puppeteer calls
- Don't make real network requests
- Ensure 90%+ coverage for new code

---

## 📁 Project Structure

`/src
scraper.js
excelConverter.js
index.js

/bin
gmaps-scraper.js

/tests
\*.test.js

LICENSE
README.md
CONTRIBUTING.md`

---

## 🐛 Reporting Bugs

If you find a bug, please open an issue with:

- Detailed description
- Steps to reproduce
- Expected vs actual behavior
- Logs (if applicable)

Open an issue here:  
[https://github.com/Code-Media-Labs/google-maps-scraper/issues](https://github.com/Code-Media-Labs/google-maps-scraper/issues)

---

## ✨ Suggesting Features

Feature requests are welcome!  
When opening a feature request issue, please include:

- Problem description
- Proposed solution
- Alternatives considered
- Any examples or screenshots

---

## 🔀 Submitting Pull Requests

1.  Create a new branch:

`git checkout -b feature/my-new-feature`

2.  Make your changes
3.  Write/update tests
4.  Ensure linting passes
5.  Commit with a clear message:

`git commit -m "Add feature: my new awesome feature"`

6.  Push and open a PR:

`git push origin feature/my-new-feature`

Make sure your PR description includes:

- A summary of the change
- Link to relevant issue
- Screenshots/logs if applicable

---

## 📝 Code Style

We follow:

- **ESLint** rules (`.eslintrc.json`)
- **Prettier** formatting (`.prettierrc`)

Before submitting a PR, run:

`npm run lint
npm run format`

---

## 🤝 Code of Conduct

By participating, you agree to respect the project's maintainers and contributors.  
Please be respectful, constructive, and patient.

---

## 💬 Need Help?

Feel free to open a discussion or reach out via the issue tracker.  
We’re happy to help!

---

Thank you for helping make **@cml/google-maps-scraper** better.  
— **Code Media Labs**
