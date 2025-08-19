# Accessibility and Semantics Best Practices for Developers

The themes of accessibility (aka a11y) and semantics have been joined due to the latter's relationship with the former.
**Where there is good web semantics, there is better accessibility.**

Base HTML5 alone provides developers with a large number of tools for accessibility-centred development, especially in the form of [ARIA attributes and roles](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference) ([but see some common pitfalls here](https://web.dev/learn/accessibility/aria-html?continue=https%3A%2F%2Fweb.dev%2Flearn%2Faccessibility%2F%23article-https%3A%2F%2Fweb.dev%2Flearn%2Faccessibility%2Faria-html)).
Angular (and Angular Material) provide additional features, including the [Angular Material `a11y` package](https://material.angular.dev/cdk/a11y/overview), and [the binding of ARIA attributes and roles in Angular](https://angular.dev/best-practices/a11y#accessibility-attributes).

The main requirements of the most recent legislation, the [European Accessibility Act (EAA)](https://www.wcag.com/compliance/european-accessibility-act/) are [compliance with WCAG 2.1 level AA, and EU legislation EN 301 549](https://www.wcag.com/compliance/european-accessibility-act/#What_technical_standards_should_you_follow_for_EAA_compliance).
[Developers](https://www.w3.org/WAI/tips/developing/) (who, in our case, are necessarily [designers](https://www.w3.org/WAI/tips/designing/)) must [intimately familiarise themselves](https://www.w3.org/WAI/tutorials/) with both [WCAG 2.1](https://www.w3.org/WAI/WCAG22/quickref/?versions=2.1) [level AA](https://www.wcag.com/resource/what-is-wcag/#The_Three_Levels_of_WCAG_Conformance_A_AA_and_AAA) and [EN 301 549](https://www.wcag.com/compliance/en-301-549/).
There is no real shortcut to this process.
Proper compliance requires a deep understanding of both guidelines.

We can provide a list of the ten most crucial accessibility requirements specifically for websites here as a starting point:

- Accessibility for keyboard-only users (e.g. tab-based navigation).
- Screen reader accessible content.
- Clearly labelled forms with clear instructions.
- ARIA labels and roles of custom components (Angular and Angular Material already specify these for most components, and most semantic HTML elements do not need label or role specification).
- Colour contrast (in the case of WCAG 2.1 AA of minimum 4.5 to 1).
- Correct heading and content structure.
- Consistent navigation elements.
- Accessibility of on hover and on focus content.
- Understandable context in link text (e.g. not having a link that only says 'here' or 'click')

Evaluating our compliance with WCAG 2.1 AA and EN 301 549 is best done after a careful study and thorough understanding of the [actual guidelines](https://www.w3.org/TR/WCAG21/); however, when developing, we have access to a large number of tools to validate many aspects of our website's compliance.
The W3C has an [entire guide on web accessibility evaluation](https://www.w3.org/WAI/test-evaluate/), including a [list of evaluation tools (both online and browser extensions)](https://www.w3.org/WAI/test-evaluate/tools/list/), and browsers already come with their own set of accessibility tools as well.

**Our team is already using the [SilkTide toolbar](https://silktide.com/toolbar/) for the main GHGA website, and thus we should also use it for the data portal as well.**

The [WAVE Web Accessibility Evaluation Tool](https://wave.webaim.org), the [ARC Toolkit](https://www.tpgi.com/arc-platform/arc-toolkit/), and the [Skynet Technologies Free Accessibility Checker](https://www.skynettechnologies.com/accessibility-checker) are also great extensions and online tools to obtain a broad overview of current compliance.
Moreover, Angular ESLint also provides a [template plugin](https://github.com/angular-eslint/angular-eslint/blob/main/packages/eslint-plugin-template/README.md) with several rules specific for accessibility, such as [`alt-text`](https://github.com/angular-eslint/angular-eslint/blob/main/packages/eslint-plugin-template/docs/rules/alt-text.md) and [`mouse-events-have-key-events`](https://github.com/angular-eslint/angular-eslint/blob/main/packages/eslint-plugin-template/docs/rules/mouse-events-have-key-events.md). See also this three-part Angular ESLint Rules for Accessibility series of articles ([Part 1](https://dev.to/angular/angular-eslint-rules-for-keyboard-accessibility-236f), [Part 2](https://dev.to/angular/angular-eslint-rules-for-aria-3ba1), [Part 3](https://dev.to/angular/angular-eslint-rules-for-accessible-html-content-kf5)).

It is important that these tools are adopted and consistently used, since all (existing and) new code for public-facing pages (including pages for authenticated users, but not administrator pages) in the data portal MUST be compliant with EAA requirements.
[Note, however, that these compliance checking tools can never check adherence to _all_ the WCAG 2.1 AA guidelines, and thus provide very inconsistent results across one another. Therefore, no single tool should be relied on. Accessibility testing cannot be done fully automated as well, so the use of multiple tools along with manual evaluation must be performed for complete results.](https://www.w3.org/WAI/test-evaluate/tools/selecting/) We must also highlight that in almost all cases, unless an extension is installed, these tools can only test the _deployed_ version of the data portal; therefore, improving accessibility can become an [iterative process](https://www.wcag.com/solutions/accessibility-checker/#Implementation_process).
Developers must, however, at least include [screen reader testing, contrast testing, and the like](https://www.w3.org/WAI/test-evaluate/easy-checks/) in the process of development to verify at least basic compliance, as well as verify the compliance of other developers' code.
For administration pages (currently available to data stewards only), we can be less strict since they are not publicly accessible, but it would be ideal to maintain the same accessibility standards for all pages across the data portal.

There is an additional consideration for GHGA itself; our brand colours are not high-contrast enough to be compliant.
This means we necessarily require the addition of a high-contrast mode and palette for the UI.
These styles can be applied with either native CSS (using [`prefers-contrast`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-contrast)) or a dedicated toggle button (which would require some form of session cookie to keep track of setting across pages and reloads).
Tools to check for colour contrast ratios can be found in the links above.

See also [links in Epic Spec 79](https://github.com/ghga-de/epic-docs/blob/main/79-miniature-horse/technical_specification.md#list-of-online-resources).
