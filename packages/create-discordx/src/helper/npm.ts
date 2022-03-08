import validateProjectName from "validate-npm-package-name";

/**
 * Validate project name
 *
 * @param name project name
 * @returns
 */
export function ValidateNpmName(name: string): {
  problems?: string[];
  valid: boolean;
} {
  const nameValidation = validateProjectName(name);
  if (nameValidation.validForNewPackages) {
    return { valid: true };
  }

  return {
    problems: [
      ...(nameValidation.errors || []),
      ...(nameValidation.warnings || []),
    ],
    valid: false,
  };
}
