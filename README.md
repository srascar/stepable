# stepable

Created with CodeSandbox

Lightweight library to implement transitions between elements of a list.

## Install

```bash
yarn install
```

## Run

```bash
yarn build
yarn start
```

## Usage

Create a container element with steps in it.
Each step must have a class `stepable` and a unique step index in the `data-step` attribute.

```html
<div id="app">
  <div class="stepable stepable-active--true" data-step="0">
    <p>Step 1</p>
    <button class="stepable-trigger">Next</button>
    <button class="stepable-trigger" data-step="2">Skip to 3</button>
  </div>
  <div class="stepable" data-step="1">
    <p>Step 2</p>
    <button class="stepable-trigger">Next</button>
    <button class="stepable-trigger--prev">Prev</button>
  </div>
  <div class="stepable" data-step="2">
    <p>Step 3</p>
    <button class="stepable-trigger--prev">Prev</button>
  </div>
</div>
```

Then add the following js to your page

```js
import Stepable from "./stepable";

new Stepable(document.getElementById("app"));
```

Any click on a `.stepable-trigger` element within your container will move the class `stepable-active--true` to the next step (or a specific step using `data-step` attribute). It will also apply the class `stepable-active--false` on the previously active step so you can apply css transitions.

`.stepable-trigger--prev` will move to the previous step.

## Options

You can customize the behavior of the stepable by applying options

```js
new Stepable(document.getElementById("app"), {
  initialStep: 4,
  shouldTransition: (transitionEvent, event) => {
    if (event.target === "an invalid button") {
      // no transition will happen
      return false;
    }

    return true;
  },
  beforeTransition: (
    // TransitionEvent contains the original index and the target index plus the associated HTMLElements
    transitionEvent,
    event,
    cb
  ) => {
    // delay the transition by 1 second
    setTimeout(cb(transitionEvent), 1000);
  }
});
```

Full list of options

```ts
const defaultOptions: Options = {
  activeClass: "stepable-active",
  initialStep: 0,
  stepKey: "data-step",
  stepSelector: ".stepable",
  triggerSelector: ".stepable-trigger",
  prevTriggerSelector: ".stepable-trigger--prev",
  shouldTransition: (transitionEvent, event) => true,
  beforeTransition: (transitionEvent, event, cb) => cb(transitionEvent),
  afterTransition: (transitionEvent, event) => true
};
```
