import { Decorator } from "../..";

export class DecoratorUtils {
  static getLinkedObjectsListToList<Type extends Decorator>(list1: Type[], list2: Type[]) {
    list1.map((a) => {
      return this.getLinkedObjects(a, list2);
    });
  }

  static getLinkedObjects<Type extends Decorator>(a: Decorator, list: Type[]) {
    return list.filter((b) => {
      return (
        a.from === b.from &&
        a.method === b.method
      );
    });
  }

  static decorateAClass(method?: PropertyDescriptor) {
    return !method?.value;
  }
}
