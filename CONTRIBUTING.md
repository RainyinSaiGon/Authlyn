# Contributing to Authlyn

Thanks for your interest in contributing to Authlyn.

Please read [`.github/CODE_OF_CONDUCT.md`](.github/CODE_OF_CONDUCT.md) before participating.

## Before you start

- Read the `README.md` first
- Check the current roadmap and project status
- Make sure your changes match the existing Spring Boot + Gradle setup

## Suggested workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes in small, focused commits
4. Run the Gradle test suite locally
5. Open a pull request with a clear description of what changed
6. Use the pull request template in `.github/pull_request_template.md`

## Development notes

- Use `./gradlew.bat` on Windows
- Use `./gradlew` on macOS/Linux
- Keep `.env` local and never commit it
- If you add new configuration, update `.env.example` and the README

## Reporting issues

If you find a bug or missing feature, open an issue with:

- what you expected to happen
- what actually happened
- steps to reproduce
- relevant logs or screenshots if available

When possible, use the issue templates in `.github/ISSUE_TEMPLATE/`.
