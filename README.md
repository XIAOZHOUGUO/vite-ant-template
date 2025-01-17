# Vue 3 + Typescript + Vite

This template should help get you started developing with Vue 3 and Typescript in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur). Make sure to enable `vetur.experimental.templateInterpolationService` in settings!

### If Using `<script setup>`

[`<script setup>`](https://github.com/vuejs/rfcs/pull/227) is a feature that is currently in RFC stage. To get proper IDE support for the syntax, use [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar) instead of Vetur (and disable Vetur).

## Type Support For `.vue` Imports in TS

Since TypeScript cannot handle type information for `.vue` imports, they are shimmed to be a generic Vue component type by default. In most cases this is fine if you don't really care about component prop types outside of templates. However, if you wish to get actual prop types in `.vue` imports (for example to get props validation when using manual `h(...)` calls), you can use the following:

### If Using Volar

Run `Volar: Switch TS Plugin on/off` from VSCode command palette.

### If Using Vetur

1. Install and add `@vuedx/typescript-plugin-vue` to the [plugins section](https://www.typescriptlang.org/tsconfig#plugins) in `tsconfig.json`
2. Delete `src/shims-vue.d.ts` as it is no longer needed to provide module info to Typescript
3. Open `src/main.ts` in VSCode
4. Open the VSCode command palette
5. Search and run "Select TypeScript version" -> "Use workspace version"

### vite-plugin-components [docs](https://github.com/antfu/vite-plugin-components)

Use components in templates as you would usually do, it will import components on demand and there is no import and component registration required anymore! If you register the parent component asynchronously (or lazy route), the auto-imported components will be code-split along with their parent.

### ant-design-vue [docs](https://2x.antdv.com/components/overview-cn)

### data mock `apite` [docs](https://github.com/wangxing218/apite)

### git commit use `git cz` in the terminal instead of other tools, in Windows, please `npm install commitizen -g` first

### vscode recommend extensions

 1. EditorConfig for Vs Code
 2. ESlint
 3. Prettier
 4. stylelint
 5. DotENV
 6. ...

### setting.json snippets

  ``` json
    // 用该属性触发自动修复
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true,
        "source.fixAll.stylelint": true
    },
  ```
