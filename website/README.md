# Online Judge Website

## Setup Instructions

- Install the modules
```bash
yarn
```
- Run the development server
```bash
yarn dev
```
- Run the production server
```bash
yarn build
yarn start
```

## Guidelines

- Use only fetch to perform AJAX Requests, don't use any external packages to perform the operation.
- To use browser side environment variables, prefix the env variable with ```NEXT_PUBLIC_```
- Use external ``node_modules`` as less as possible.
- Don't write any external css using css module or global stylesheets. Use the ``@material-ui/core/styles`` inbuilt ``makeStyles()``, ``createStyles() withStyles()`` to take advantage of the modern CSS-in-JSS feature.
