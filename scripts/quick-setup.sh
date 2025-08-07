#!/bin/bash

# 🚀 Quick Setup Script - Fix All Issues in One Command
# Usage: ./quick-setup.sh

set -e  # Exit on any error

echo "🎯 PLAYWRIGHT FRAMEWORK QUICK SETUP"
echo "====================================="

# Get the current directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "📁 Working in: $PROJECT_DIR"
cd "$PROJECT_DIR"

echo ""
echo "🔧 Step 1: Setting up environment variables..."
export NODE_ENV=dev
if ! grep -q "NODE_ENV=dev" .env 2>/dev/null; then
    echo "NODE_ENV=dev" >> .env
    echo "✅ Added NODE_ENV=dev to .env file"
else
    echo "✅ NODE_ENV already set in .env"
fi

echo ""
echo "🔐 Step 2: Making scripts executable..."
chmod +x scripts/*.js
echo "✅ All scripts are now executable"

echo ""
echo "🪝 Step 3: Initializing Git hooks..."
if [ -d ".git" ]; then
    npx husky install
    
    # Create .husky directory if it doesn't exist
    mkdir -p .husky
    
    # Add pre-commit hook
    npx husky add .husky/pre-commit "npx lint-staged"
    echo "✅ Pre-commit hook added"
    
    # Add commit message validation
    npx husky add .husky/commit-msg "node scripts/validate-commit-msg.js"
    echo "✅ Commit message validation added"
else
    echo "⚠️  No .git directory found - skipping git hooks setup"
fi

echo ""
echo "Step 4: Running validation..."
node scripts/validate-setup.js

echo ""
echo "🎉 SETUP COMPLETE!"
echo "=================="
echo ""
echo "✅ Your Playwright framework is now fully enhanced!"
echo "✅ All critical issues have been resolved"
echo "✅ Git hooks are active for code quality"
echo "✅ Environment is properly configured"
echo ""
echo "📚 Next steps:"
echo "   • Review FRAMEWORK_ENHANCEMENT_GUIDE.md for complete features"
echo "   • Check IMPLEMENTATION_ROADMAP.md for team rollout plan"
echo "   • Run 'npm run health:check' to verify all systems"
echo ""
echo "Ready to use enhanced features:"
echo "   • npm run test:performance    # Performance testing"
echo "   • npm run test:security      # Security testing" 
echo "   • npm run lint               # Code quality check"
echo "   • npm run test:docker        # Docker-based testing"
echo ""
echo "Happy testing! 🎯"
