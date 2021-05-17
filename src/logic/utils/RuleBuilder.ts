import { Expression, ArgsRulesFunction, ExpressionFunction } from "../..";

export function Rule(expr?: Expression, ...add: (string | RegExp)[]) {
  return new RuleBuilder(expr, ...add);
}

// IDEA: Create an explicit description of what a command do (problem: i18n)
export class RuleBuilder {
  static readonly start = "^";
  static readonly end = "$";
  static readonly caseInsensitiveFlag = "i";
  static readonly space = /\s/.source;
  static readonly atLeastOne = "+";

  private _source?: string = "";
  private _flags: string = "i";
  private _from?: typeof String | typeof RegExp | typeof RuleBuilder;

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

  get type() {
    return RuleBuilder.typeOfExpression(this);
  }

  constructor(expr?: Expression, ...add: (string | RegExp)[]) {
    this.fromExpression(expr);
    if (add.length > 0) {
      this.add(...add);
    }
  }

  static normalize(
    expr: Expression | ExpressionFunction,
    stringRule: (str: string) => RuleBuilder
  ): ExpressionFunction {
    let finalRule: Expression;
      
    // We have to normalize the rules to have a single type
    // for _normalizedRules
    // (Expression is an union of many type, it's complicated to operate on)
    switch (RuleBuilder.typeOfExpression(expr)) {
      case Function:
        // @Command((command: Command, client: Client) => {...})
        return expr as ExpressionFunction;
      case RegExp:
        // @Command(/^hello.*$/)
        finalRule = Rule(expr as RegExp);
        break;
      case String:
        // @Command("hello")
        finalRule = stringRule(expr as string);
        break;
      case RuleBuilder:
        // @Command(Rule("hello"))
        finalRule = expr as RuleBuilder;
        break;
    }

    return (() => finalRule) as ExpressionFunction;
  }

  static validate(text: string, rules: ArgsRulesFunction[]) {
    console.log(text, rules);
    return true;
  }

  static fromArray(exprs: Expression[]): RuleBuilder[] {
    return exprs.map((expr) => Rule(expr));
  }

  static fromArgsRuleArray<Type extends Expression = Expression>(
    argsRules: ArgsRulesFunction<Type>[]
  ): ArgsRulesFunction<RuleBuilder>[] {
    return [];
  }

  static joinSources(joinChar: Expression, ...exprs: Expression[]) {
    return RuleBuilder.fromArray(exprs)
      .map((rb) => rb.source)
      .join(Rule(joinChar).source);
  }

  static joinFlags(...exprs: Expression[]) {
    const flags = RuleBuilder.fromArray(exprs).map((rb) => rb.flags);
    return flags.filter((f, i) => flags.indexOf(f) === i).join("");
  }

  static join(joinChar: RuleBuilder, ...exprs: Expression[]) {
    const source = this.joinSources(joinChar, ...exprs);
    let flags = this.joinFlags(...exprs);

    // flags: "ig", "ig", "i" => remove "g" because one of them doesn't have the "g" flag
    exprs.map((expr) => {
      const rule = Rule(expr);
      if (!rule.flags.includes(flags)) {
        flags = rule.flags.replace(RegExp(flags, "g"), "");
      }
    });

    return Rule(source).setFlags(flags);
  }

  static isExpression(obj: any) {
    const exprType = this.typeOfExpression(obj);
    return [String, RuleBuilder, RegExp].includes(exprType as any);
  }

  static typeOfExpression(expr: Expression | ExpressionFunction) {
    if (typeof expr === "string") {
      return String;
    }
    if (expr instanceof RegExp) {
      return RegExp;
    }
    if (expr instanceof RuleBuilder) {
      return RuleBuilder;
    }
    if (typeof expr === "function") {
      return Function;
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

  /**
   * We escape the regex tokens of a string
   * This operation is only applied on string
   * @example escape("^hello?.my $name is .+lucy") returns "\^hello\?\.my \$name is \.\+lucy"
   * @example https://regex101.com/r/TYVn9H/2
   * @param text The expression parameter
   * @returns The escaped text
   */
  escape() {
    return this.setSource(this.source.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"));
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
    const source = RuleBuilder.joinSources("", ...exprs);
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

  test(text: string): boolean {
    return this.regex.test(text);
  }

  /**
   * Set the flags of your regex rule
   * @param flags the Regex flags
   */
  setFlags(...flags: string[]) {
    this._flags = flags.join("");
    return this;
  }

  space(exprToAdd?: Expression) {
    return this.add(/\s+/, exprToAdd);
  }

  onlyOneSpace(exprToAdd?: Expression) {
    return this.add(RuleBuilder.space, exprToAdd);
  }

  setSource(source: string) {
    this._source = source;
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
    this.addBefore(RuleBuilder.joinSources("", ...exprs));
    this.setFlags(RuleBuilder.joinFlags(this, ...exprs));
    return this;
  }

  spaceOrEnd() {
    return this.addOr(/\s+/, RuleBuilder.end);
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
    const source = RuleBuilder.joinSources("", ...exprs);
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
  if(
    cond: (ruleBuilder: RuleBuilder) => boolean,
    then: (ruleBuilder: RuleBuilder) => void
  ) {
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

  fromRule(rule: RuleBuilder) {
    this._source = rule._source;
    this._flags = rule._flags;
    this._from = RuleBuilder;
    return this;
  }

  fromExpression(expr?: Expression) {
    if (expr) {
      switch (RuleBuilder.typeOfExpression(expr)) {
        case String:
          return this.fromString(expr as string);
        case RegExp:
          return this.fromRegex(expr as RegExp);
        case RuleBuilder:
          return this.fromRule(expr as RuleBuilder);
      }
    }
    return this;
  }
}
