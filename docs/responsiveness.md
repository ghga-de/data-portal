# Responsiveness Best Practices for Developers

Responsiveness (and styling in general) is best handled using the [Tailwind CSS library](https://tailwindcss.com/docs/) currently in use.
For responsiveness specifically, there is a [robust set of features](https://tailwindcss.com/docs/responsive-design) available to specify styles based on a large number of breakpoints.
Breakpoints are specific (in our case, minimum) screen widths in which the layout of a page can be changed.
For example, the first default breakpoint in Tailwind CSS is 640px, so we could provide one layout for screens smaller than 640px, and another for screens equal to or wider than 640px thanks to the breakpoint.
In addition, [custom breakpoints](https://tailwindcss.com/docs/responsive-design#using-custom-breakpoints) can be added to the existing list.
Developers should also familiarise themselves with Tailwind's ability to [use arbitrary values](https://tailwindcss.com/docs/styling-with-utility-classes#using-arbitrary-values) in element class definitions.

Tailwind CSS is a [mobile-first framework](https://tailwindcss.com/docs/responsive-design#working-mobile-first), which for developers means that all styles are applied to all screen sizes by default, and any styles with breakpoint modifiers only apply starting from the specified screen width of the breakpoint definition and above.
Thus developers are encouraged to style pages by thinking of the smallest screen sizes first, and on top of these base styles, build the look for larger screen sizes.

We currently aim to provide a high-quality and responsive UI even for small screen users in _all_ pages of the data portal, including data steward-specific pages.
We do this in two different ways: restyling the page elements to be better suited for small screens, and defining scrolling overflow for elements that must necessarily be wider than half of the smallest breakpoint (currently, 320px, half of 640px).
The latter is used for elements such as data tables, which cannot be adapted to small screens, as well as certain input fields in some modals, which cannot be left too narrow.
However, developers must make sure that they do not only test specific breakpoints, but use the responsive design mode window width resizing feature to check responsiveness across the entire set of screen sizes between the smallest screen size and the largest breakpoint (currently, `2xl`, or 1536 pixels). This does not imply a need to be completely exhaustive, verifying each screen width at every pixel, but resizing the window width by dragging the edge of the panel and observing if anything seems out of place is sufficient.

The main requirements for responsiveness are: that all interactive elements _must_ remain usable (e.g. text readable, buttons clickable), and that the UI _must not_ have elements overlapping or overflowing onto other elements at page widths of half of the smallest breakpoint and above (again, currently 320px, half of 640px), and the page contents should also not make the page wider than the headers and footers (which happens when overflow has not been set properly in elements within the `main` of the page).
Since nearly all pages are bespoke, responsiveness must also necessarily be applied in a bespoke manner.
This does not mean that we create our own custom responsiveness paradigms, but rather that we apply simple and commonly used solutions across the web to the specific needs of our pages.

However, some pages share certain features (e.g. dataset summary and dataset details containing title and description, dataset details tab titles, IVA and AR manager filter elements) which should be standardised in their responsiveness across pages.
This refers to _identical_ elements, rather than similar elements that are styled differently in two different pages (e.g. the dataset description styling in the dataset summary component vs. that in the dataset details page component), which do not necessarily have to have their responsiveness pattern implemented identically.
An even better solution would be a reusable component, but lacking one, a shared text variable for the element classes, or a simple reimplementation would be necessary.
Importantly, **responsiveness should not hinder the accessibility of the data portal**.
All implementation of responsive design should comply with the guidelines set up in [our accessibility document and required regulation mentioned therein](./a11y_semantics.md).

For an _exemplary_ application of responsive design, we could point to the browse page, in which all the components have great responsiveness built in, including the dialog for creating a new access request, the search and filters, and the dataset summary.

Two final remarks when it comes to responsive design are avoiding the use of `<table>` elements when creating layouts, using instead [grid](https://tailwindcss.com/docs/grid-template-columns) or [flexbox](https://tailwindcss.com/docs/flex) elements, and keeping in mind that Angular Material very often overrides Tailwind mixins, which requires specifying (S)CSS styles that re-implement Tailwind classes ([reminder that using `::ng-deep`, if easy, is discouraged](https://angular.dev/guide/components/styling#viewencapsulationemulated)).
For re-implementing Tailwind CSS spacing and sizing classes that use numerical values, such as `w-32`, you should keep note that the number multiplies the Tailwind spacing variable, which is by default `4px` to specify the actual size; meaning that `w-32` is equal to a width of `128px` (=32×4).
