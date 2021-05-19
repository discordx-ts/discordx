import { Decorator } from "./Decorator";
import { DecoratorUtils } from "../../logic/utils/DecoratorUtils";

export type ModifyFunction<ToModify extends Decorator> = (
  original: ToModify
) => any;

export class Modifier<ToModify extends Decorator> extends Decorator {
  private _toModify: ModifyFunction<ToModify>;
  private _modifyTypes: any[];

  protected constructor() {
    super();
  }

  static create<ToModify extends Decorator>(
    toModify: ModifyFunction<ToModify>,
    ...modifyTypes: any[]
  ) {
    const modifier = new Modifier<ToModify>();

    modifier._toModify = toModify;
    modifier._modifyTypes = modifyTypes;

    return modifier;
  }

  /**
   * Apply the modifier to a list of objects
   * it only applies the modifications to linked objects
   * that are on the targets type of modification
   * @param modifiers The modifier list
   * @param originals The list of objects to modify
   * @returns 
   */
  static async applyFromModifierListToList(
    modifiers: Modifier<any>[],
    originals: Decorator[]
  ) {
    return await Promise.all(
      modifiers.map(async (modifier) => {
        // Get the list of objects that are linked to the specified modifier
        let linked = DecoratorUtils.getLinkedObjects(modifier, originals);

        // Filter the linked objects to match the target types of modification
        linked = linked.filter((l) => 
          modifier._modifyTypes.includes((l as Object).constructor)
        );

        // Apply the modifications
        await Promise.all(
          linked.map(async (linkedOriginal) => {
            return await modifier.applyModifications(linkedOriginal);
          })
        );
      })
    );
  }

  applyModifications(original: ToModify) {
    return this._toModify(original);
  }
}
