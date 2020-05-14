import {
  Expression,
  Commandable,
  CommandableFactory
} from "../..";

export function Rule(from?: Expression, forceFromQueryBuilder?: boolean) {
  return new RuleBuilder(from, forceFromQueryBuilder);
}

export class RuleBuilder {
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
      const rule = rules[index];
      if (rule) {
        return rule.regex.test(text);
      }
      return false;
    });
    return res;
  }

  static mergeRules(rules: Commandable, rulesToMerge: Commandable) {
    const res: Commandable = {
      prefix: rules.prefix,
      commandName: rules.commandName,
      argsRules: rules.argsRules,
      argsSeparator: rules.argsSeparator,
      message: rules.message
    };

    if (!rules.prefix.source) {
      res.prefix = rulesToMerge.prefix;
    }
    if (!rules.commandName.source) {
      res.commandName = rulesToMerge.commandName;
    }
    if (!rules.argsSeparator.source) {
      res.argsSeparator = rulesToMerge.argsSeparator;
    }

    rules.argsRules.map((rule, index) => {
      if (!rule.source) {
        res.argsRules[index] = rulesToMerge.argsRules[index];
      } else {
        res.argsRules[index] = rulesToMerge.argsRules[index];
      }
    });

    return CommandableFactory.create(
      res,
      res.commandName,
      res.prefix,
      res.message,
      res.argsRules,
      res.argsSeparator
    );
  }

  startWith(prefix: string) {
    this.addBefore(`^${prefix}`);
    return this;
  }

  add(str: string) {
    this._source += str;
    return this;
  }

  spaceAfter() {
    this._source += "\\s{1,}";
    return this;
  }

  end() {
    this._source += "$";
    return this;
  }

  spaceOrEnd() {
    return this.or(
      (rb) => rb.spaceAfter(),
      (rb) => rb.end()
    );
  }

  or(...cbs: ((ruleBuilder: RuleBuilder) => RuleBuilder)[]) {
    let source = "(";

    cbs.map((cb, index) => {
      const rule = Rule();
      cb(rule);
      source += rule.source;
      if (index < cbs.length - 1) {
        source += "|";
      }
      return rule;
    });

    source += ")";

    this._source += source;
    return this;
  }

  addBefore(str: string) {
    this._source = `${str}${this._source}`;
    return this;
  }

  if(cb: (ruleBuilder: RuleBuilder) => boolean, then: (ruleBuilder: RuleBuilder) => void) {
    if (cb(this)) {
      then(this);
    }
    return this;
  }

  caseSensitive() {
    this._flags = this.flags.replace("i", "");
    return this;
  }

  fromRegex(regex: RegExp) {
    this._source = regex.source;
    this._flags = regex.flags;
    this._from = RegExp;
  }

  fromString(str: string) {
    this._source = str;
    this._from = String;
  }

  fromRule(rule: RuleBuilder, forceFromQueryBuilder?: boolean) {
    this._source = rule._source;
    this._flags = rule._flags;
    if (!forceFromQueryBuilder) {
      this._from = rule.from;
    }
    this._from = RuleBuilder;
  }

  fromExpression(expr?: Expression, forceFromQueryBuilder?: boolean) {
    if (expr) {
      if (typeof expr === "string") {
        this.fromString(expr);
      }
      if (expr instanceof RegExp) {
        this.fromRegex;
      }
      if (expr instanceof RuleBuilder) {
        this.fromRule(expr, forceFromQueryBuilder);
      }
    }
    return this;
  }
}
