# Contributing to Checkout.com Node.js SDK

Thank you for your interest in contributing to the Checkout.com Node.js SDK! We welcome contributions from the community.

## How to Contribute

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes**
4. **Add tests for your changes** - Ensure new functionality is covered by tests
5. **Run tests** and ensure coverage remains high (`npm test`)
6. **Commit your changes** using conventional commit format (`git commit -m 'feat: add amazing feature'`)
7. **Push to the branch** (`git push origin feature/amazing-feature`)
8. **Open a Pull Request**

## Development Setup

```bash
# Clone the repository
git clone https://github.com/checkout/checkout-sdk-node.git
cd checkout-sdk-node

# Install dependencies
npm install

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Build the project
npm run build

# Run linter
npm run lint
```

## Code Standards

- Follow the existing code style
- Use ES2022+ features where appropriate
- Write clear, descriptive commit messages following [Conventional Commits](https://www.conventionalcommits.org/)
- Ensure all tests pass before submitting a PR
- Maintain or improve code coverage (currently 97.95%)
- Update TypeScript definitions in `types/dist/` for any API changes

## Testing

- All new features must include tests
- Bug fixes should include a test that reproduces the issue
- Run `npm test` to execute the full test suite
- Ensure coverage reports show your changes are tested

## Pull Request Process

1. Update the README.md with details of changes if applicable
2. Update the TypeScript type definitions if you modify the API
3. The PR will be merged once you have approval from a maintainer
4. Ensure your code passes all CI checks

## Reporting Issues

- Use the GitHub issue tracker
- Provide a clear description of the issue
- Include code samples or test cases when possible
- Specify the SDK version and Node.js version you're using

## Questions?

If you have questions about contributing, feel free to:
- Open a discussion on GitHub
- Contact us at support@checkout.com

Thank you for contributing! 🎉
