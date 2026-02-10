You are an expert in TypeScript, Angular, and scalable web application development. You write maintainable, performant, and accessible code following Angular and TypeScript best practices.

This repo currently uses Angular `^21.1.1`, Angular Material `^21.1.1`, and Tailwind CSS `^4.1.18`.

For project-specific development guidance, see docs/a11y_semantics.md and docs/responsiveness.md.

Do not invent Angular APIs or CLI behavior. When uncertain, call `search_documentation` and cite Angular guidance in the response.

## Repo commands (pnpm)

This repo uses `pnpm` (not npm) for dependency installation and scripts.

- Dev server: `pnpm start`
- Build: `pnpm build` (or `pnpm watch`)
- Lint: `pnpm lint` (or `pnpm lf` to auto-fix)
- Typecheck (TS project refs): `pnpm typecheck` (or `pnpm typecheck:watch`)
- Typecheck incl. Angular templates: `pnpm typecheck:ng`
- Unit tests (Angular builder): `pnpm test` / `pnpm test:watch` / `pnpm test:ui`
  - Test framework: Vitest (with Angular TestBed integration via the Angular test builder)
  - Do not run plain `vitest` directly; Angular component tests rely on the Angular test builder.
  - Use `pnpm ng test` or the pnpm scripts above. `ng test` uses the Angular builder with Vitest.
  - Test syntax: Use `vitest.fn()` for mocks, not `jasmine.createSpy()`.
- E2E tests (Playwright): `pnpm e2e` / `pnpm e2e:ui` / `pnpm e2e:headed` / `pnpm e2e:debug` / `pnpm e2e:report`
- Docs: `pnpm docs`
- README table of contents: `pnpm toc` (updates the region between `<!-- toc -->` and `<!-- tocstop -->`)

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Documentation

- All functions, methods, and classes require JSDoc comments (enforced via eslint-plugin-jsdoc)
- JSDoc must include `@param` for all parameters and `@returns` for non-void return types
- JSDoc must include a description line for the function/method/class
- Keep JSDoc comments concise and meaningful - avoid redundancy with code that is self-explanatory
- Empty constructors are exempt from JSDoc requirements
- Arrow function expressions do not require JSDoc by linting rules, but should still include JSDoc when the function is not self-explanatory and needs deeper explanation

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer signal forms over reactive and template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection
