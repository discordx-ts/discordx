/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
export type CommitType =
  | "build"
  | "chore"
  | "ci"
  | "docs"
  | "feat"
  | "feature"
  | "fix"
  | "refactor"
  | "revert"
  | "test"
  | "types"
  | "workflow"
  | "untagged"
  | "BREAKING CHANGE";

export type CategoryType = {
  breaking: boolean;
  title: string;
  types: CommitType[];
};

export const CommitCategories: CategoryType[] = [
  {
    breaking: false,
    title: "Breaking Changes",
    types: ["BREAKING CHANGE"],
  },
  { breaking: false, title: "Features", types: ["feat", "feature"] },
  { breaking: true, title: "Changed", types: ["refactor"] },
  { breaking: true, title: "Fixed", types: ["fix"] },
  { breaking: false, title: "Reverts", types: ["revert"] },
  { breaking: false, title: "Tests", types: ["test"] },
  { breaking: false, title: "Build", types: ["build"] },
  { breaking: false, title: "Types", types: ["types"] },
  { breaking: false, title: "Documentation", types: ["docs"] },
  { breaking: false, title: "Routine Tasks", types: ["chore"] },
  { breaking: false, title: "CI", types: ["ci", "workflow"] },
  { breaking: false, title: "Untagged", types: ["untagged"] },
];
