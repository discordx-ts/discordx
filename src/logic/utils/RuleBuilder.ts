import {
  Expression,
  Commandable,
  CommandableFactory
} from "../..";

export function Rule(from?: Expression, forceFromQueryBuilder?: boolean) {
  return new RuleBuilder(from, forceFromQueryBuilder);
}

export class RuleBuilder {
  static readonly start = "^";
  static readonly end = "$";
  static readonly caseInsensitiveFlag = "i";
  static readonly space = "\\s";
  static readonly atLeastOne = "{1,}";
  static readonly atLeastOneSpace = RuleBuilder.space + RuleBuilder.atLeastOne;

  private _source?: string = "";
  private _flags: string = "i";
  private _from?: typeof String | typeof RegExp | typeof RuleBuilder;
  private _imported: boolean = false;

  get imported() {
    return this._imported;
  }

  get from() {
    return this._from;
  }
  set from(value) {
    this._from = value;
  }

  get source() {
    return this._source;
  }

  get flags() {
    return this._flags;
  }

  get regex() {
    return new RegExp(this._source, this._flags);
  }

  constructor(from?: Expression, forceFromQueryBuilder?: boolean) {
    this.fromExpression(from, forceFromQueryBuilder);
  }

  static validate(texts: string[], rules: RuleBuilder[]) {
    const res = texts.every((text, index) => {
      return rules[index]?.regex.test(text);
    });
    return res;
  }

  static fromArray(exprs: Expression[]): RuleBuilder[] {
    return exprs.map((expr) => Rule(expr));
  }

  static joinSources(...exprs: Expression[]) {
    return RuleBuilder.fromArray(exprs).map(rb => rb.source).join("");
  }

  static joinFlags(...exprs: Expression[]) {
    const flags = RuleBuilder.fromArray(exprs).map(rb => rb.flags);
    return flags.filter((f, i) => flags.indexOf(f) === i).join("");
  }

  static typeOfExpression(expr: Expression) {
    if (typeof expr === "string") {
      return String;
    }
    if (expr instanceof RegExp) {
      return RegExp;
    }
    if (expr instanceof RuleBuilder) {
      return RuleBuilder;
    }
  }

  static or(...exprs: Expression[]) {
    let source = "(";

    exprs.map((expr, index) => {
      source += Rule(expr).source;
      if (index < exprs.length - 1) {
        source += "|";
      }
      return expr;
    });

    source += ")";

    return source;
  }

  static mergeRules(rules: Commandable, rulesToMerge: Commandable) {
    let newPrefix = Rule();
    let typeOfPrefix = RuleBuilder.typeOfExpression(rules.originalRules.prefix);
    const typeOfCommandName = RuleBuilder.typeOfExpression(rules.originalRules.commandName);

    const res: Commandable<RuleBuilder> = {
      prefix: Rule(rules.prefix),
      argsSeparator: Rule(rules.argsSeparator),
      message: Rule(rules.message),
      commandName: Rule(rules.commandName),
      argsRules: rules.argsRules.map((rule) => Rule(rule)),
      originalRules: rules.originalRules
    };

    if (!res.prefix.source) {
      typeOfPrefix = RuleBuilder.typeOfExpression(rulesToMerge.originalRules.prefix);
      res.prefix = Rule(rulesToMerge.prefix);
    }

    if (!res.argsSeparator.source) {
      res.argsSeparator = Rule(rulesToMerge.argsSeparator);
    }

    if (
      res.commandName
    ) {
      newPrefix = newPrefix.add(res.commandName);
      if (typeOfCommandName === String) {
        newPrefix.spaceOrEnd();
      }
      if (typeOfCommandName === RuleBuilder) {
        newPrefix.setFlags(res.commandName.flags);
      }
    }

    if (
      res.prefix &&
      typeOfPrefix === String &&
      typeOfCommandName === String
    ) {
      newPrefix = newPrefix.startWith(res.prefix);
    }

    res.prefix = newPrefix;

    if (newPrefix.source) {
      res.argsRules[0] = newPrefix;
    }

    res.argsRules.map((rule, index) => {
      if (!rule.source) {
        res.argsRules[index] = Rule(rulesToMerge.argsRules[index]);
      }
    });

    return res;
  }

  /**
   * Create a copy of the current rule
   */
  copy() {
    const copy = new RuleBuilder();
    copy._source = this.source;
    copy._from = this._from;
    copy._flags = this._flags;
    return copy;
  }

  /**
   * Add expressions to the end of your rule
   * @param exprs Expressions to add
   */
  add(...exprs: Expression[]) {
    const source = RuleBuilder.joinSources(...exprs);
    this.setFlags(RuleBuilder.joinFlags(this, ...exprs));
    this._source += source;
    return this;
  }

  /**
   * Add flags to your regex rule
   * @param flags the Regex flags
   */
  addFlags(...flags: string[]) {
    this._flags += flags.join("");
    return this;
  }

  /**
   * Set the flags of your regex rule
   * @param flags the Regex flags
   */
  setFlags(...flags: string[]) {
    this._flags = flags.join("");
    return this;
  }

  /**
   * Add \s{1,}
   */
  haveSpaceAfter() {
    this._source += RuleBuilder.atLeastOneSpace;
    return this;
  }

  /**
   * Add "^" before your expression
   */
  start() {
    this.addBefore("^");
    return this;
  }

  /**
   * Add "^" before your expression => ^prefix
   * @param prefix The string must start with this
   */
  startWith(prefix: Expression) {
    this.addBefore(`^${Rule(prefix).source}`);
    return this;
  }

  /**
   * Add $
   */
  end() {
    this.add("$");
    return this;
  }

  /**
   * Move your index to the begining of your expression
   * Rule("c").before("a", "b") returns "abc"
   * @param exprs The expressions that you want to add before
   */
  before(...exprs: Expression[]) {
    this.addBefore(RuleBuilder.joinSources(...exprs));
    this.setFlags(RuleBuilder.joinFlags(this, ...exprs));
    return this;
  }

  spaceOrEnd() {
    return this.addOr(
      RuleBuilder.atLeastOneSpace,
      RuleBuilder.end
    );
  }

  /**
   * Create a Regex or
   * Rule().or("\\s{1,}", "$") returns "(\s{1,}|$)"
   * @param exprs The expressions to make an or with
   */
  addOr(...exprs: Expression[]) {
    this.add(RuleBuilder.or(...exprs));
    return this;
  }

  /**
   * Add before your expression
   * Rule("b").addBefore("a") returns "ab"
   * @param exprs The expressions to add before
   */
  addBefore(...exprs: Expression[]) {
    const source = RuleBuilder.joinSources(...exprs);
    this._source = `${source}${this._source}`;
    return this;
  }

  /**
   * Create an or condition
   * Rule("a").if(r => r.source.startWith("a"), r => r.add("b")) returns "ab"
   * Rule("b").if(r => r.source.startWith("a"), r => r.add("b")) returns "a"
   *
   * @param cond The condition function, it receive the copied Rule at the first parameter and must return a boolean value
   * @param then It receive the Rule reference at the first parameter
   */
  if(cond: (ruleBuilder: RuleBuilder) => boolean, then: (ruleBuilder: RuleBuilder) => void) {
    if (cond(this.copy())) {
      then(this);
    }
    return this;
  }

  /**
   * Set the expression to case sensitive
   */
  caseSensitive() {
    this._flags = this._flags.replace(/i/g, "");
    return this;
  }

  fromRegex(regex: RegExp) {
    this._source = regex.source;
    this._flags = regex.flags;
    this._from = RegExp;
    return this;
  }

  fromString(str: string) {
    this._source = str;
    this._from = String;
    return this;
  }

  fromRule(rule: RuleBuilder, forceFromQueryBuilder?: boolean) {
    this._source = rule._source;
    this._flags = rule._flags;
    if (!forceFromQueryBuilder) {
      this._from = rule.from;
    }
    this._from = RuleBuilder;
    return this;
  }

  fromExpression(expr?: Expression, forceFromQueryBuilder?: boolean) {
    if (expr) {
      switch (RuleBuilder.typeOfExpression(expr)) {
        case String:
          return this.fromString(expr as string);
        case RegExp:
          return this.fromRegex(expr as RegExp);
        case RuleBuilder:
          return this.fromRule(expr as RuleBuilder, forceFromQueryBuilder);
      }
    }
    return this;
  }
}
