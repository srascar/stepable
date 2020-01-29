interface Options {
  activeClass: string;
  initialStep: number;
  stepKey: string;
  stepSelector: string;
  triggerSelector: string;
  shouldTransition: (
    fromStep: HTMLElement,
    toStep: HTMLElement,
    event: MouseEvent
  ) => boolean;
  beforeTransition: (
    fromStep: HTMLElement,
    toStep: HTMLElement,
    event: MouseEvent
  ) => any;
  afterTransition: (
    fromStep: HTMLElement,
    toStep: HTMLElement,
    event: MouseEvent
  ) => any;
}

const defaultOptions: Options = {
  activeClass: "stepable-active",
  initialStep: 0,
  stepKey: "data-step",
  stepSelector: ".stepable",
  triggerSelector: ".stepable-trigger",
  shouldTransition: (from, to) => true,
  beforeTransition: (fromStep, toStep) => true,
  afterTransition: (fromStep, toStep) => true
};

export default class Stepable {
  currentIndex: number;
  nextIndex: number;
  steps: HTMLElement[];
  options: Options;

  constructor(element: HTMLElement, options: Partial<Options> = {}) {
    this.options = { ...defaultOptions, ...options };
    this.currentIndex = this.options.initialStep;
    this.nextIndex = this.currentIndex + 1;
    this.steps = Array.from(
      element.querySelectorAll(this.options.stepSelector)
    );
    this.attachCallbacks();
    if (this.steps[this.currentIndex]) {
      this.steps[this.currentIndex].classList.add(
        `${this.options.activeClass}--true`
      );
    }
  }

  transitionToStep(from: number, to: number, event: MouseEvent) {
    const fromStep = this.steps[from];
    const toStep = this.steps[to];

    if (!fromStep || !toStep) {
      if (to === this.steps.length) {
        this.currentIndex = to - 1;
      }
      return;
    }

    if (this.options.shouldTransition(fromStep, toStep, event)) {
      this.options.beforeTransition(fromStep, toStep, event);
      fromStep.classList.remove(`${this.options.activeClass}--true`);
      fromStep.classList.add(`${this.options.activeClass}--false`);
      this.currentIndex = to;
      this.nextIndex = to + 1;
      toStep.classList.remove(`${this.options.activeClass}--false`);
      toStep.classList.add(`${this.options.activeClass}--true`);
      this.options.afterTransition(fromStep, toStep, event);
    }
  }

  attachCallbacks() {
    this.steps.forEach((step, i) => {
      const triggers: HTMLElement[] = Array.from(
        step.querySelectorAll(this.options.triggerSelector)
      );
      triggers.forEach(trigger => {
        const targetStep =
          trigger.dataset[this.options.stepKey.replace("data-", "")];
        const to = targetStep ? Number(targetStep) : i + 1;
        trigger.onclick = e => this.transitionToStep(this.currentIndex, to, e);
      });
    });
  }
}
