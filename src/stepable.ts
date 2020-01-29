interface TransitionEvent {
  from: number;
  to: number;
  fromStep: HTMLElement;
  toStep: HTMLElement;
}

interface Options {
  activeClass: string;
  initialStep: number;
  stepKey: string;
  stepSelector: string;
  triggerSelector: string;
  prevTriggerSelector: string;
  shouldTransition: (
    transitionEvent: TransitionEvent,
    event: MouseEvent
  ) => boolean;
  beforeTransition: (
    transitionEvent: TransitionEvent,
    event: MouseEvent
  ) => any;
  afterTransition: (transitionEvent: TransitionEvent, event: MouseEvent) => any;
}

const defaultOptions: Options = {
  activeClass: "stepable-active",
  initialStep: 0,
  stepKey: "data-step",
  stepSelector: ".stepable",
  triggerSelector: ".stepable-trigger",
  prevTriggerSelector: ".stepable-trigger--prev",
  shouldTransition: (transitionEvent, event) => true,
  beforeTransition: (transitionEvent, event) => true,
  afterTransition: (transitionEvent, event) => true
};

export default class Stepable {
  element: HTMLElement;
  currentIndex: number;
  steps: HTMLElement[];
  options: Options;

  constructor(element: HTMLElement, options: Partial<Options> = {}) {
    this.element = element;
    this.options = { ...defaultOptions, ...options };
    this.currentIndex = this.options.initialStep;
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

    const transitionEvent = {
      from,
      to,
      fromStep,
      toStep
    };

    if (this.options.shouldTransition(transitionEvent, event)) {
      this.options.beforeTransition(transitionEvent, event);
      fromStep.classList.remove(`${this.options.activeClass}--true`);
      fromStep.classList.add(`${this.options.activeClass}--false`);
      this.currentIndex = to;
      toStep.classList.remove(`${this.options.activeClass}--false`);
      toStep.classList.add(`${this.options.activeClass}--true`);
      this.options.afterTransition(transitionEvent, event);
    }
  }

  attachCallbacks() {
    const triggers: HTMLElement[] = Array.from(
      this.element.querySelectorAll(this.options.triggerSelector)
    );
    triggers.forEach(trigger => {
      trigger.onclick = e => {
        const targetStep =
          trigger.dataset[this.options.stepKey.replace("data-", "")];
        const to = targetStep ? Number(targetStep) : this.currentIndex + 1;
        this.transitionToStep(this.currentIndex, to, e);
      };
    });

    const prevTriggers: HTMLElement[] = Array.from(
      this.element.querySelectorAll(this.options.prevTriggerSelector)
    );
    prevTriggers.forEach(trigger => {
      trigger.onclick = e => {
        this.transitionToStep(this.currentIndex, this.currentIndex - 1, e);
      };
    });
  }
}
