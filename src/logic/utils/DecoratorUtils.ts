import { Decorator } from "../..";

export class DecoratorUtils {
  static getLinkedObjectsListToList<Type extends Decorator>(
    list1: Type[],
    list2: Type[]
  ) {
    list1.map((a) => {
      return this.getLinkedObjects(a, list2);
    });
  }

  static getLinkedObjects<Type extends Decorator>(a: Decorator, list: Type[], ignoreIndex: boolean = false) {
    return list.filter((b) => {
      let cond = a.from === b.from && a.key === b.key;

      if (ignoreIndex) return cond;

      if (a.index !== undefined || b.index !== undefined) {
        cond &&= a.index === b.index;
      }

      return cond;
    });
  }

  static decorateAClass(method?: PropertyDescriptor) {
    return !method?.value;
  }
}
