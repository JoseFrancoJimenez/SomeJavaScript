# Library

## Overview
The `lib` folder contains reusable modules and utilities for web applications, providing core functionality, web components. These modules handle tasks such as color management, event handling, state management, localization, DOM manipulation, and UI components.

## Project Structure
The library is organized into the following directories under the `lib` root folder:

- **components/**: Core classes for managing colors, events, lists, state, and localization.
- **tools/**: Utility functions for core operations, DOM manipulation, and network requests.
- **web-components/**: Custom web components for UI elements like buttons and typeahead inputs.


### Key Files
- **components/component.js**: Base class for evented components with localization support.
- **components/evented.js**: Provides event handling for emitting and listening to events.
- **components/nls.js**: Manages localized strings for internationalization (English and French).
- **components/state.js**: Base class for application state with event-driven updates. The state emits an event every time one of its properties changes, allowing components to listen and update accordingly.
- **tools/core.js**: Core utilities for localization, ID generation, and WET-BOEW integration.
- **tools/dom.js**: DOM manipulation utilities for creating and managing elements.
- **tools/net.js**: Handles JSON fetching from URLs.
- **web-components/base/web-component.js**: Base class for custom web components with lifecycle methods.

## Dependencies
The library depends on the following:
- **Browser Environment**: The library assumes a modern browser with support for ES modules, custom elements, and async/await.

## Creating a Custom Web Component
The `web-components/base/web-component.js` module provides a base class (`WebComponent`) for creating custom web components. Below is a step-by-step guide to creating a new web component from scratch, along with explanations of key lifecycle methods and best practices. All classes that inherit from `WebComponent` **must** have a parameter-less constructor that calls `super()` to ensure proper initialization of the base class. If the constructor only contains `super()`, it can be omitted, as JavaScript implicitly provides a default constructor. 

### Lifecycle Callbacks
The `HTMLElement` class, which `WebComponent` extends, provides several lifecycle methods for customization. The `WebComponent` class inherits these methods and adds two hooks for easier customization:
- **connectedCallback**: Called when the component is added to the DOM. In `WebComponent`, it renders the template, sets named nodes, and calls `initialize`. 
- **disconnectedCallback**: Called when the component is removed from the DOM. Override to clean up resources (e.g., remove event listeners).
- **attributeChangedCallback**: Called when observed attributes are added, removed, or changed. In `WebComponent`, it defers to `processAttributeChange` after named nodes are ready. Avoid overriding unless necessary. 
- **adoptedCallback**: Called when the component is moved to a new document. 
- **connectedMoveCallback**: Called when the component is moved in the DOM. 
- **initialize**: A hook provided by `WebComponent`, called at the end of `connectedCallback`. Use it to set up event listeners or initialize component state.
- **processAttributeChange**: A hook provided by `WebComponent`, called from `attributeChangedCallback` after named nodes are set. Use it to handle changes to observed attributes.

For more details, refer to the Mozilla Web Components documentation:  
https://developer.mozilla.org/en-US/docs/Web/API/Web_components

### Step-by-Step Guide to Creating a Custom Web Component
1. **Basic Component (Define `html` Method)**:
   - The simplest custom web component only needs to define the `html` method to specify its HTML structure. The `WebComponent` base class handles rendering the template, localization, and named node collection.
   - **Example**: A basic component displaying a static message.
     ```javascript
     import WebComponent from '@lib/web-components/base/web-component.js';

     class SimpleMessage extends WebComponent {
       html() {
         return `<div handle="message">nls(welcome_message)</div>`;
       }

       localize(nls) {
         nls.add("welcome_message", "en", "Welcome to the NGD Map!");
         nls.add("welcome_message", "fr", "Bienvenue sur la carte NGD !");
       }
     }

     WebComponent.register("simple-message", SimpleMessage);
     ```
     - **Usage**:
       ```html
       <simple-message></simple-message>
       ```
     - The `html` method returns the component’s template, with `nls()` placeholders replaced by translations from the `localize` method. The `handle` attribute marks elements for access via `this.elems`. The constructor is omitted here since it would only contain `super()`.


2. **Advanced Component (Add `initialize` Method)**:
   - For components requiring interactivity, override the `initialize` method to set up event listeners or initialize state. This is called after the component is rendered and named nodes are ready.
   - **Example**: A clickable message component that emits a custom event.
     ```javascript
     import WebComponent from '@lib/web-components/base/web-component.js';

     class ClickableMessage extends WebComponent {
       constructor() {
         super();
       }

       html() {
         return `<button handle="btn">nls(click_me)</button>`;
       }

       localize(nls) {
         nls.add("click_me", "en", "Click Me");
         nls.add("click_me", "fr", "Cliquez-moi");
       }

       initialize() {
         this.elems.btn.addEventListener("click", () => {
           this.emit("message-click", { detail: "Button clicked!" });
         });
       }
     }

     WebComponent.register("clickable-message", ClickableMessage);
     ```
     - **Usage**:
       ```html
       <clickable-message></clickable-message>
       <script>
         document.querySelector("clickable-message").addEventListener("message-click", e => console.log(e.detail)); // "Button clicked!"
       </script>
       ```
     - The constructor is included explicitly here for clarity, but it could be omitted if it only contains `super()`.


3. **More Advanced Component (Add `observedAttributes` and `processAttributeChange`)**:
   - For components that react to attribute changes, define `observedAttributes` to specify which attributes to monitor and override `processAttributeChange` to handle updates. The `attributeChangedCallback` is already implemented in `WebComponent` to defer processing until named nodes are ready, so you should typically use `processAttributeChange` unless you need to completely override the callback.
   - **Example**: A label component that updates based on an attribute.
     ```javascript
     import WebComponent from '@lib/web-components/base/web-component.js';

     class DynamicLabel extends WebComponent {
       static get observedAttributes() {
         return ["text"];
       }

       html() {
         return `<span handle="label">nls(default_text)</span>`;
       }

       localize(nls) {
         nls.add("default_text", "en", "Default Label");
         nls.add("default_text", "fr", "Étiquette par défaut");
       }

       processAttributeChange(name, oldValue, newValue) {
         if (name === "text" && oldValue !== newValue) {
           this.elems.label.textContent = newValue || this.nls.get("default_text");
         }
       }
     }

     WebComponent.register("dynamic-label", DynamicLabel);
     ```
     - **Usage**:
       ```html
       <dynamic-label text="Custom Text"></dynamic-label>
       <script>
         const label = document.querySelector("dynamic-label");
         label.setAttribute("text", "New Text"); // Updates <span> to "New Text"
       </script>
       ```
     - Use `processAttributeChange` to handle attribute updates safely. Only override `attributeChangedCallback` if you need custom logic before named nodes are ready, which is rare. The constructor is omitted here as it would only contain `super()`.


4. **Registering the Component**:
   - Use `WebComponent.register(tag, class)` to define the custom element. The tag must be lowercase, contain at least one hyphen, use only letters, digits, `.`, `_`, or `-`, and be unique within the application. 
   - Example: `WebComponent.register("my-component", MyComponent);`


5. **Best Practices**:
   - Always include a parameter-less constructor that calls `super()` to ensure proper initialization of the `WebComponent` base class. If the constructor only contains `super()`, it can be omitted, as JavaScript provides a default constructor for classes extending another class.
   - Always define `html` to specify the component’s structure.
   - Use `localize` to add translations for bilingual support (English/French).
   - Use `initialize` for event listeners and initial setup.
   - Define `observedAttributes` and `processAttributeChange` for dynamic attribute handling.
   - Avoid overriding `attributeChangedCallback` unless you need custom logic before named nodes are ready.
   - Use `this.elems` to access elements with the `handle` attribute and `this.nls` for translations.

## More Library Usage Examples
- **Color Conversion**:
  ```javascript
  import Color from '@lib/components/color.js';
  const color = new Color([255, 0, 0, 1]);
  console.log(color.to_hex()); // "#ff0000"
  console.log(color.to_rgba(0.5)); // "rgba(255,0,0,0.5)"
  ```

- **Event Handling**:
  ```javascript
  import Evented from '@lib/components/evented.js';
  const evented = new Evented();
  evented.on("click", () => console.log("Clicked"));
  evented.emit("click"); // Logs "Clicked"
  ```

- **List Management**:
  ```javascript
  import List from '@lib/components/list.js';
  const list = new List(item => item.id, [{ id: 1 }, { id: 2 }]);
  list.add({ id: 3 });
  console.log(list.get(1)); // { id: 1 }
  ```

- **Localization**:
  ```javascript
  import Nls from '@lib/components/nls.js';
  const nls = new Nls();
  nls.add("greeting", "en", "Hello");
  console.log(nls.get("greeting", [], "en")); // "Hello"
  ```

- **Web Component (Button)**:
  ```html
  <somejs-button label="Click Me" icon="fas fa-star"></somejs-button>
  <script>
    import CustomButton from '@lib/web-components/button.js';
    const button = document.querySelector("somejs-button");
    button.addEventListener("button-click", e => console.log(e.detail)); // { data: "Click Me" }
  </script>
  ```

- **Dynamic Typeahead**:
  ```html
  <somejs-dynamic-typeahead></somejs-dynamic-typeahead>
  <script>
    import DynamicTypeahead from '@lib/web-components/select/dynamic-typeahead.js';
    const typeahead = document.querySelector("somejs-dynamic-typeahead");
    typeahead.store_fn = async (value) => [{ id: 1, label: "Option 1" }, { id: 2, label: "Option 2" }];
    typeahead.fn_label = (item) => item.label;
    typeahead.placeholder = this.nls.get("input_placeholder");
    typeahead.on("select-change", (ev) => console.log(ev.item);
  </script>
  ```

## Notes
- The library assumes a browser environment with ES module support and custom element APIs.