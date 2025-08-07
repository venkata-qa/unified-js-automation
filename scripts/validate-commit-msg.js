const fs = require('fs');

// Validate commit message format
const commitMsg = fs.readFileSync(process.argv[2], 'utf8').trim();

const pattern = /^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: .{1,50}/;

if (!pattern.test(commitMsg)) {
  console.error(`
❌ Invalid commit message format!

Expected format: <type>[optional scope]: <description>

Types:
- feat: A new feature
- fix: A bug fix
- docs: Documentation only changes
- style: Changes that do not affect the meaning of the code
- refactor: A code change that neither fixes a bug nor adds a feature
- test: Adding missing tests or correcting existing tests
- chore: Changes to the build process or auxiliary tools

Examples:
- feat(api): add user authentication endpoint
- fix(ui): resolve button click issue
- docs: update README with setup instructions
- test: add unit tests for helper functions

Current commit message: "${commitMsg}"
`);
  process.exit(1);
}

console.log('✅ Commit message format is valid');
process.exit(0);
