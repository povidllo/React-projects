import type { ElementType } from "../../white-board/src/entities/elements/";

export class ServerElements {
  public readonly elementsMap = new Map<string, ElementType>();

  addElement = (newElement: ElementType) => {
    this.elementsMap.set(newElement.id, newElement);
  };

  getAllElements = (): ElementType[] => {
    const allElements: ElementType[] = [];
    for (let elem of this.elementsMap.values()) {
      allElements.push(elem);
    }
    allElements.sort((a, b) => Number(a.id) - Number(b.id));
    return allElements;
  };

  hasElement = (element: ElementType): boolean => {
    return this.elementsMap.has(element.id);
  };

  getElement = (id: string): ElementType | undefined => {
    return this.elementsMap.get(id);
  };

  setMovingCoordinates = (id: string, x: number, y: number): boolean => {
    const elem = this.getElement(id);
    if (!elem) {
      return false;
    }

    elem.x = x;
    elem.y = y;
  };
}
