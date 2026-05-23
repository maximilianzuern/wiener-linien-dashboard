# Development Rules

## Repository Summary
This web application is a dashboard for Public Transport in Vienna to display real-time departure information.
It's built using the React framework **React Router v7** in **Framework Mode** and Server-Side Rendering, Tailwind CSS v4, and will be deployed via Cloudflare Workers.
Framework mode provides a full-stack web framework experience similar to Remix v2.
React Router v7 is the successor of the full-stack web framework Remix v2. 

## Code Quality
Follow these rules to write good code:
- write simple and easy to consume code.
- code should be "skimmable" and you should still be able to understand it.
- no complex or clever code.
- early returns are great.
- don't break out into too many function, that's hard to read.
- don't write defensive code, assume the values are always what types tell you they are.
- add comments to sections of code that are not straightforward.

## Commands
- `npm run typecheck` when you see missing type errors - never try to "fix" the import path
- `npm run fmt <path to file/folder>` to format code with oxformatter
- `npm run lint <path to file/folder>` to lint code with oxlint

## Update Packages
- `npx npm-check-updates -u --target minor` to update packages to latest minor versions
- After updating, run `npm install` and test the app to ensure nothing is broken.

## React Router v7 Guidelines
When working with React Router v7:
- React Router v7 automatically generates types for every route. These provide complete type safety for loaders, actions, components, and URL generation.
- ALWAYS use `./+types/[routeName]` for route type imports. NEVER use relative paths like `"../+types/[routeName]"`. CORRECT: `import type { Route } from "./+types/product-details";`
- If you see missing `./+types/[routeName]` imports, ALWAYS suggest running `npm run typecheck` first
- After creating new routes, execute or remind the user to run `npm run typecheck` to let react-router generate the types for the new routes
- Let TypeScript infer loader/action return types - don't over-type returns
