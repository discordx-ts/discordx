---
title: "@SlashChoice"
---

<br/>

## Signature

```ts
@SlashChoice(...choices: (number | string | SlashChoiceType)[]): ParameterDecoratorEx 
```

## Parameters

### `choices`
| type      | default | required |
| --------- | ------- | -------- |
| (number \| string \| SlashChoiceType)[ ] | undefined    | Yes      |

## Types

### `SlashChoiceType`

```ts
export type SlashChoiceType<T extends string = string, X = string | number> = {
  name: NotEmpty<T>;
  nameLocalizations?: LocalizationMap;
  value?: X;
};
```