# Component conventions

Applies to hand-written components (e.g. `components/marketing/*`, future custom components). Does **not** apply to `components/ui/*` — those follow the shadcn/base-nova output shape (`function` declarations, `cn()`, `data-slot` attributes) for visual consistency with any future shadcn-CLI-generated components, but some (like `accordion.tsx`) are hand-written, not CLI output — check before assuming a file in this directory is safe to regenerate.

Does **not** apply to `app/**/page.tsx`, `layout.tsx`, or other Next.js special files — the App Router requires those to be default exports.

## Shape

```tsx
export const ComponentName = ({ propOne, propTwo }: Props) => {
  // ...
};

type Props = {
  propOne: string;
  propTwo: () => void;
};
```

- Named `const` arrow-function export — not `export default function`.
- Props destructured inline in the signature.
- Prop type named `Props` (not `Prop`), declared after the component.
