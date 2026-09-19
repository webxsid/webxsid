declare module "masonry-layout" {
  type MasonryOptionValue = string | boolean | number;

  type MasonryOptions = {
    itemSelector: string;
    columnWidth: string;
    gutter: string;
    percentPosition?: boolean;
    transitionDuration?: MasonryOptionValue;
  };

  export default class Masonry {
    constructor(element: Element, options: MasonryOptions);
    layout(): void;
    destroy(): void;
  }
}
