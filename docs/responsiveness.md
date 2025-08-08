# Responsiveness Best Practices for Developers

Responsiveness (and styling in general) is best handled using the [Tailwind CSS library](https://tailwindcss.com/docs/) currently in use.
For responsiveness specifically, there exist a [robust set of features](https://tailwindcss.com/docs/responsive-design) available to specify styles based on a large number of breakpoints.
In addition, [custom breakpoints](https://tailwindcss.com/docs/responsive-design#using-custom-breakpoints) can be added to the existing list.
Developers should also familiarise themselves with Tailwind's ability to [use arbitrary values](https://tailwindcss.com/docs/styling-with-utility-classes#using-arbitrary-values) in element class definitions.

We currently aim to provide a high-quality and responsive UI even for small screen users in _all_ pages of the data portal, including data steward-specific pages.
We do this in two different ways: restyling the page elements to be better suited for small screens, and defining scrolling overflow for elements that must necessarily be wider than half of the smallest breakpoint (currently, 320px, half of 640px).
The latter is used for elements such as data tables, which cannot be adapted to small screens, as well as certain input fields in some modals, which cannot be left too narrow.

The main requirement for responsiveness is that the UI _must not_ have elements overlapping or overflowing onto other elements at page widths of half of the smallest breakpoint and above (again, currently 320px, half of 640px), and the page contents should also not make the page wider than the headers and footers (which happens when overflow has not been set properly in elements within the `main` of the page).
Since nearly all pages are bespoke, responsiveness must also necessarily be applied in a bespoke manner.
However, some pages share certain features (e.g. dataset summary and dataset details containing title and description, dataset details tab titles, IVA and AR manager filter elements) which should be standardised in their responsiveness across pages.
This refers to _specifically identical_ elements, rather than similar elements that are styled differently in two different pages (e.g. dataset summary dataset description and dataset details dataset description), which do not necessarily have to have their responsiveness pattern implemented identically.
An even better solution would be a reusable component, but lacking one, a shared text variable for the element classes, or a simple reimplementation would be necessary

Two final remarks when it comes to responsive design are avoiding the use of `<table>` elements when creating layouts, using instead [gridbox](https://tailwindcss.com/docs/grid-template-columns) or [flexbox](https://tailwindcss.com/docs/flex) elements, and keeping in mind that Angular Material very often overrides Tailwind mixins, which requires specifying (S)CSS styles that re-implement Tailwind classes ([reminder that using `::ng-deep`, if easy, is discouraged](https://angular.dev/guide/components/styling#viewencapsulationemulated)).
For re-implementing Tailwind CSS spacing and sizing classes that use numerical values, such as `w-32`, you should keep note that the number multiplies the Tailwind spacing variable, which is by default `4px` to specify the actual size; meaning that `w-32` is equal to a width of `128px` (=32×4).
