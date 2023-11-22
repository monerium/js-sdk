NOTES

Setja "strict": true í sdk tsconfig?

GITHUB ACTIONS
Laga Static output fyrir typedocs

Generate a library:

```
nx g @nrwl/js:library

```

Generate an app:

```bash
# Nextjs app
nx g @nx/next:app my-new-app
# React app
nx g @nx/react:application sdk-example-react --directory examples/sdk-react

```

Generate a publishable library ( TODO : not currently using the nx way of publishing)

```
nx g @nrwl/react:lib sdk-provider --publishable --importPath @monerium/sdk-provider

```

Generate a component

```
nx g @nx/react:component libs/ui/src/my-component
```

Move an app

```
// Lets say we have app1 at apps/app1 and we want to move it to apps/examples/app1
nx g move --project app1 examples/app1

// Lets we want to rename apps/examples/app1 to apps/examples/app2
nx g move --project examples-app1 examples/app2
```

## Releasing

Want to release a specific version of a package?

Add `"release-at": "x.x.x"` to `.release-please-manifest.json`

---

- [] Add instructions to provider README

- [] Reduce stuff in package
