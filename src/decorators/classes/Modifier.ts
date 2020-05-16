import { Decorator } from "./Decorator";
import { DecoratorUtils } from "../../logic/utils/DecoratorUtils";

export type ModifyFunction<ToModify extends Decorator> = (
  original: ToModify
) => any;

export class Modifier<ToModify extends Decorator> extends Decorator {
  private _toModify: ModifyFunction<ToModify>;

  static createModifier<ToModify extends Decorator>(toModify: ModifyFunction<ToModify>) {
    const modifier = new Modifier<ToModify>();
    modifier._toModify = toModify;
    return modifier;
  }

  static async applyFromModifierListToList(modifiers: Modifier<any>[], originals: Decorator[]) {
    await Promise.all(modifiers.map(async (modifier) => {
      const linked = DecoratorUtils.getLinkedObjects(modifier, originals);
      await Promise.all(linked.map(async (linkedOriginal) => {
        return await modifier.applyModifications(linkedOriginal);
      }));
    }));
  }

  applyModifications(original: ToModify) {
    return this._toModify(original);
  }

  applyModificationsToList(originals: ToModify[]) {
    originals.map((original) => {
      this.applyModifications(original);
    });
  }
}
