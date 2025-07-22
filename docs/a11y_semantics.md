# Accessibility and Semantics Best Practices for Developers

The themes of accessibility (aka a11y) and semantics have been joined due to the latter's relationship with the former.
**Where there is good web semantics, there is better accessibility.**

Base HTML5 alone provides developers with a large number of tools for accessibility-centred development, especially in the form of [ARIA attributes and roles](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference) ([but see some common pitfalls here](https://web.dev/learn/accessibility/aria-html?continue=https%3A%2F%2Fweb.dev%2Flearn%2Faccessibility%2F%23article-https%3A%2F%2Fweb.dev%2Flearn%2Faccessibility%2Faria-html)).
Angular (and Angular Material) provide additional features, including the [Angular Material `a11y` package](https://material.angular.dev/cdk/a11y/overview), and [the binding of ARIA attributes and roles in Angular](https://angular.dev/best-practices/a11y#accessibility-attributes).

The main requirements of the most recent legislation, the [EAA](https://www.wcag.com/compliance/european-accessibility-act/) are [compliance with WCAG 2.1 level AA, and EU legislation EN 301 549](https://www.wcag.com/compliance/european-accessibility-act/#What_technical_standards_should_you_follow_for_EAA_compliance).
[Developers](https://www.w3.org/WAI/tips/developing/) (who, in our case, are necessarily [designers](https://www.w3.org/WAI/tips/designing/)) must [intimately familiarise themselves](https://www.w3.org/WAI/tutorials/) with both [WCAG 2.1](https://www.w3.org/WAI/WCAG22/quickref/?versions=2.1) [level AA](https://www.wcag.com/resource/what-is-wcag/#The_Three_Levels_of_WCAG_Conformance_A_AA_and_AAA) and [EN 301 549](https://www.wcag.com/compliance/en-301-549/).
There is no real shortcut to this process.
Proper compliance requires a deep understanding of both guidelines.

Evaluating our compliance with WCAG 2.1 AA and EN 301 549 is best done with professional external auditing; however, when developing, we have access to a large number of tools to validate many aspects of our website's compliance.
The W3C has an [entire guide on web accessibility evaluation](https://www.w3.org/WAI/test-evaluate/), including a [list of evaluation tools](https://www.w3.org/WAI/test-evaluate/tools/list/), and browsers already come with their own set of accessibility tools as well.
The [Skynet Technologies Free Accessibility Checker](https://www.skynettechnologies.com/accessibility-checker) is (despite the company name) a great tool to obtain a broad overview of current compliance.

It is important that these tools are adopted and consistently used, since all (existing and) new code for public-facing (i.e.
non-data steward) pages in the data portal MUST be compliant with EAA requirements.
[Note, however, that many of these compliance checking tools provide very inconsistent results, therefore no single tool should be relied on.
Accessibility testing cannot be done fully automated as well, so manual evaluation must be performed for complete results, which nearly invariably requires a paid audit.](https://www.w3.org/WAI/test-evaluate/tools/selecting/) We must also highlight that in almost all cases, these tools can only test the _deployed_ version of the data portal; therefore, improving accessibility is especially for us an [iterative process](https://www.wcag.com/solutions/accessibility-checker/#Implementation_process).
Developers must, however, at least include [screen reader testing, contrast testing, and the like](https://www.w3.org/WAI/test-evaluate/easy-checks/) in the process of development to verify at least basic compliance, as well as verify the compliance of other developers' code.

There is an additional consideration for GHGA itself; our brand colours are not high-contrast enough to be compliant.
This means we necessarily require the addition of a high-contrast mode and palette for the UI.
These styles can be applied with either native CSS (using [`prefers-contrast`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-contrast)) or a dedicated toggle button (which would require some form of session cookie to keep track of setting across pages and reloads).
Tools to check for colour contrast ratios can be found in the links above.

## Additional online resources (from Epic 79 spec)

- [Getting to know the European legislation on accessibility](https://accessible-eu-centre.ec.europa.eu/getting-know-european-legislation-accessibility_en)
- [AccessibleEU Guidelines and Support Materials](https://accessible-eu-centre.ec.europa.eu/guidelines-and-support-materials_en)
- [Web Content Accessibility Guidelines (WCAG) 2.2](https://www.w3.org/TR/WCAG22/)
- [Official Angular Accessibility Best Practices](https://angular.dev/best-practices/a11y)
- [angular.love article on the EAA](https://angular.love/digital-accessibility-2025-how-to-avoid-fines-and-win-more-users)
- [Guide to EAA 2025 Compliance by COAX software](https://coaxsoft.com/blog/guide-to-eaa-2025-compliance)
- [Web Accessibility in Angular - Introduction by Angular Architects](https://www.angulararchitects.io/blog/web-accessibility-in-angular/)
- [Accessibility Testing Tools for Angular by Angular Architects](https://www.angulararchitects.io/blog/accessibility-testing-tools/)
- [MDN Curriculum on Semantic HTML](https://developer.mozilla.org/en-US/curriculum/core/semantic-html/)
- [MDN Glossary on Semantics in HTML](https://developer.mozilla.org/en-US/docs/Glossary/Semantics#semantics_in_html)
- [MDN Reference for HTML elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements)
- [Angular Accessibility Workshop by Angular Architects](https://www.angulararchitects.io/en/training/angular-accessibility-workshop/)
