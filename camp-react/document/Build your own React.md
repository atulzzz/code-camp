## 一、说明

本文分 9 个步骤实现一个简易版的 react

## 二、步骤

1. 部分基础概念
2. createElement 函数
3. render 函数
4. Concurrent Mode(并发模式)
5. Fibers
6. Render and Commit Phases
7. Reconciliation(diff)
8. 函数式组件
9. Hooks

## 三、实现

#### 1. 部分基础概念

在 react 程序中我们经常能看到下面这种代码的写法

```javascript
const element = <h1 title="foo">Hello</h1>; // 定义一个react元素
const container = document.getElementById("root"); //从dom结构中拿到一个容器
ReactDOM.render(element, container); // 将react元素渲染到容器中
```

可以看到第一行和最后一行都是 react 程序中的特殊写法，原生 Js 并没有这种写法。

第一行使用 Jsx 语法定义了一个元素，之所以 Jsx 语法可行只因为它会被构建工具(如 Babel)给转换成原生 Js，转换过程简单来说就是把标签里面的代码转换成一个 createElement 函数的调用，然后将标签名、标签属性和 children 作为函数参数传递进去。第一行代码就类似于下面代码:

```javascript
const element = React.createElement(
 "h1"
 { title: "foo" }
 "Hello"
)
```

除去校验相关，`React.createElement`所做的就是根据参数创建出了一个对象，所以我们可以直接用它的输出结果来代替函数调用：

```javascript
const element = {
  type: "h1",
  props: {
    title: "foo",
    children: "Hello",
  },
};
```

这个带有`type`属性和`props`属性的对象可以简单看作就是一个 react 元素，当然了，真正的输出结果并没有这么简单，它还有更多属性，但是现在这里我们只关心这两个。  
 从属性值不难猜到，`type` 表明了我们想要创建的 dom 元素是什么，也就是当我们使用`document.createElement`来创建一个`html`标签时给的`tagName`。(ps: type 的值也可以是一个函数并不一定得是字符串，这一点后面再讲)  
 `props`的值也是一个对象，这个对象的键名和键值对应的就是 Jsx 语法上的属性和属性值，值得注意的`children`属性。从对应关系不难看到`children`的值就是之前第一行 Jsx 语法代码中`h1`标签的内容，而`html`标签内容不仅能是普通文本，也可以是标签，所以`children`属性的值也可以是有许多其他元素或者说对象的数组，这也是为什么我们总说 dom 树的原因。

除去第一行，剩余代码中需要注意的就是`ReactDOM.render`，`render`是`React`改变页面 DOM 结构的函数，所以构建我们自己的 react 过程中，必定需要写一个我们自己的`render`来更新页面。  
 避免混淆，我们使用`element`来指代`react element`，用`node`来指代`dom element`。  
 首先，用`element`的`type`来创建一个节点：

```javascript
const node = document.createElement(element.type);
```

然后，把`element props`属性的值都赋给这个`node`，这里就是`title`：

```javascript
node["title"] = element.props.title;
```

接着，处理`children`属性。因为这个例子中`children`只是一个字符串而已，所以我们只需要创建一个文本节点(为了普遍性，我们不使用直接设置`innerText`的方式)：

```javascript
const text = document.createTextNode("");
text["nodeValue"] = element.props.children;
```

最后，我们把这个文本节点加到之前的`h1`，也就是`node`节点里面，然后再把`h1`加到容器里面。到此，我们有了一份功能和之前代码一样的程序，但是没有用到`react`相关的代码：

```javascript
const element = {
  type: "h1",
  props: {
    title: "foo",
    children: "Hello",
  },
};

const container = document.getElementById("root");
const node = document.createElement(element.type);
node["title"] = element.props.title;
const text = document.createTextNode("");
text["nodeValue"] = element.props.children;

node.appendChild(text);
container.appendChild(node);
```

#### 2. `createElement`函数

以一份新的代码开始，这次我们将用自己的 react 代码替换掉 react(官方)代码：

```javascript
const element = (
  <div id="foo">
    <a>bar</a>
    <b />
  </div>
);
const container = document.getElementById("root");
ReactDOM.render(element, container);
```

首先书写属于我们自己的`createElement`用以将 Jsx 语法转换成 Js 语法：

```javascript
const element = React.createElement(
  "div",
  { id: "foo" },
  React.createElement("a", null, "bar"), // 从这一行和前面【部分基础概念】可以看到，如果标签内是普通文本，那React.createElement这里就是普通文本内容，这次是又一个element
  React.createElement("b")
);
```

就如我们先前所看到的那样，一个 element 就是一个带有`type`和`props`属性的对象，我们的`createElement`函数所需要做的就是创建并返回一个这样的对象。

```javascript
// 使用rest参数语法，确保children是一个数组
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children,
    },
  };
}
```

由于`children`不仅可以是数组，也可以是原始类型的值，比如字符串和数字，所以还需要对`children`做进一步处理：

```javascript
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === "object" ? child : createTextElement(child)
      ),
    },
  };
}

function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}
```

针对原始值类型，我们统一设定了一种专门的类型：`TEXT_ELEMENT`。(ps: `react`官方不会像我们这样在没有子元素的时候也包装原始值和创建空数组，我们这么做是为了简化代码，我们的 react 追求的是简单明了而不是高性能)

为了和`react`官方区分开，同时又体现出是学习`react`，我们给我们的库命名为`Didact`。

```javascript
const Didact = {
  createElement,
};

const element = Didact.createElement(
  "div",
  { id: "foo" },
  Didact.createElement("a", null, "bar"),
  Didact.createElement("b")
);
```

为了代码书写方便，我们还是保留`Jsx`语法的代码写法，但是这样会有一个问题：如何告知`Babel`使用我们库`Didact`的`createElement`而不是`React`官方的`createElement`呢？  
 可以在 Jsx 代码前增加一行如下的注释：

```javascript
/** @jsx Didact.createElement */
const element = (
  <div id="foo">
    <a>bar</a>
    <b />
  </div>
);
```

#### 3. `render`函数

`createElement`函数之后，接下来要处理的就是`render`函数了。我们先处理“增加”，更新和删除 dom 节点在后面再处理：

```javascript
function render(element, container) {
  // TODO create dom nodes
}

const Didact = {
  createElement,
  render,
};

Didact.render(element, container);
```

如同我们在【部分基础概念】中所做的一样，在我们自己的`render`函数中，首先我们根据`element`的`type`创建 dom 节点，然后把这个新节点加到容器里面：

```javascript
function render(element, container) {
  const dom = document.createElement(element.type);
  container.appendChild(dom);
}
```

然后针对 children 属性递归调用`render`：

```javascript
function render(element, container) {
  const dom = document.createElement(element.type);
  element.props.children.forEach((child) => render(child, dom));
  container.appendChild(dom);
}
```

同样，也是需要处理一下纯文本元素，也就是我们前面提到的类型为`TEXT_ELEMENT`的节点：

```javascript
function render(element, container) {
  const dom =
    element.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(element.type);
  element.props.children.forEach((child) => render(child, dom));
  container.appendChild(dom);
}
```

最后，把`element`的`props`携带的信息赋给我们创建的节点：

```javascript
function render(element, container) {
  const dom =
    element.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(element.type);
  const isProperty = (key) => key !== "children";
  Object.keys(element.props)
    .filter(isProperty)
    .forEach((name) => (dom[name] = element.props[name]));
}
```

至此，我们有了一个可以把`Jsx`语法渲染到`DOM`结构的库：

```javascript
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === "Object" ? child : createTextElement(child)
      ),
    },
  };
}

function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

function render(element, container) {
  const dom =
    element.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(element.type);

  const isProperty = (key) => key !== "children";
  Object.keys(element.props)
    .filter(isProperty)
    .forEach((name) => (dom[name] = element.props[name]));

  element.props.children.forEach((child) => render(child, dom));
  container.appendChild(dom);
}

const Didact = {
  createElement,
  render,
};

/** @jsx Didact.createElement */
const element = (
  <div id="foo">
    <a>bar</a>
    <br />
  </div>
);

const container = document.getElementById("root");
Didact.render(element, container);
```

#### 4. `Concurrent Mode`(并发模式)

在我们给我们的库增加更多功能代码之前，我们需要重构一次代码来解决一个问题：`element.props.children`递归调用 render。目前代码下，每当我们开始渲染时，直到整个 dom 树渲染完毕之前都不会停止递归 render。如果 dom 树过于庞大，那么我们的这个渲染可能就会导致主流程过长时间不响应，这种体验很糟糕。比如，一些优先级很高急需处理的事件，像是用户输入和 ui 交互。

所以我们需要把这整个大的任务拆解成一个个小单元任务，然后每次完成一个小任务，如果浏览器有别的需要处理的事情，那么就先让浏览器去处理别的事情(ps：**_这里又会引出一个新的问题，那就是我们整个大的任务被这样拆解之后，可能导致渲染了一部分浏览器去处理别的事情，然后又渲染了一部分，浏览器又去处理了别的事情，这就会导致用户体验上看到一个不完整的 UI，这个问题先放放_**)：

```javascript
let nextUnitOfWork = null;

function workLoop(deadline) {
  // 是否需要暂停
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    // 执行一个小任务，并返回下一个小任务
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    // IdleDeadline.timeRemaining()：返回值表示当前闲置周期的预估剩余毫秒数，如果idle period已结束，则值为0
    // https://developer.mozilla.org/zh-CN/docs/Web/API/IdleDeadline
    shouldYield = deadline.timeRemaining() < 1;
  }
  requestIdleCallback(workLoop);
}
// 在这里，我们使用"requestIdleCallback"来实现递归循环，"requestIdleCallback"和"setTimeout"差不多，不同的是，"setTimeout"需要我们主动设置时间间隔，而"requestIdleCallback"则会自动在主线程空闲时运行回调函数(ps: react官方已经不再使用"requestIdleCallback"了，而是有专门的调度算法，不过在我们的这个例子中这一点无伤大雅)
// https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback
requestIdleCallback(workLoop);

function performUnitOfWork(nextUnitOfWork) {
  // TODO
}
```

#### 5. `Fibers`

在做上一步剩余的工作之前，我们需要先认识一种数据结构来帮组我们更好地写出`performUnitOfWork()`，这种结构被称为`fiber tree`。
举个例子：假设我们想要渲染下面这样的结构：

```javascript
Didact.render(
  <div>
    <h1>
      <p />
      <a />
    </h1>
    <h2 />
  </div>,
  container
);
```

那它对应的`fiber tree`就会是这样的：[![Hsos78.png](https://s4.ax1x.com/2022/02/14/Hsos78.png)](https://imgtu.com/i/Hsos78)  
 在这个渲染过程中，首先我们会创建`root fiber`并把它赋值给`nextUnitOfWork`，然后调用`peformUnitOfWork()`。  
 在`performUnitOfWork`中对每一个`fiber`，我们都会做下面这三件事：

- 把`element`加到`DOM`结构中
- 给`element`的`children`创建`fiber`
- 选择下一个小任务

`fiber tree`这种结构的好处之一在于：可以非常方便地找到下一个要处理的`fiber` —— 可以看到每一个`fiber`和它的第一个`child`、第一个兄弟以及它的父级都有关联。  
 当我们完成一个`fiber`的渲染工作之后，

- 如果它有`child`，那么这个`child`将会是下一个小任务。比如，在我们的这个例子中，当我们完成`div`这个 `fiber` 的渲染工作之后，下一个就是`h1 fiber`。
- 如果`fiber`一个`child`都没有，那么它的兄弟将会是下一个小任务。比如，在我们这个例子中，`p fiber`完成之后就是`a fiber`了。
- 如果既没有`child`也没有兄弟，那么它的舅舅将会是下一个小任务。比如`a fiber`和`h2 fiber`。

每一个`fiber`都需要走"三个如果"判定，当我们再次回到`root fiber`时，说明全部任务完成。

现在，让我们把上述思考放到代码中。

首先，因为任务拆解，原先的一次性全部渲染的`render`肯定不行了，需要重写一个，所以先把`render`拎出来：

```javascript
function render(element, container) {
  // TODO set next unit of work
}
```

当然了，原来函数的代码也不是全部丢掉，我们保留创建`DOM`节点的部分，后面会用到：

```javascript
function createDom(fiber) {
  const dom =
    fiber.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type);
  const isProperty = (key) => key !== "children";
  Object.keys(element.props)
    .filter(isProperty)
    .forEach((name) => (dom[name] = element.props[name]));
  return dom;
}
```

在`render`中，我们把`root fiber`设为`nextUnitOfWork`：

```javascript
function render(element, container) {
  nextUnitOfWork = {
    // 注意这个dom，这里是容器，也是真实节点
    dom: container,
    props: {
      children: [element],
    },
  };
}

let nextUnitOfWork = null;
```

然后是`performUnitOfWork`，三个`TODO`对应之前我们说的对每一个`fiber`都需要做的三件事：

- 把`element`加到`DOM`结构中
- 给`element`的`children`创建`fiber`
- 选择下一个小任务

```javascript
function performUnitOfWork(fiber) {
  // TODO add dom node
  // TODO create new fibers
  // TODO return next unit of work
}
```

第一件事（把`element`加到`DOM`结构中）：

```javascript
function performUnitOfWork(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  if (fiber.parent) {
    fiber.parent.dom.appendChild(fiber.dom);
  }
}
```

第二件事（给`element`的`children`创建`fiber`）：

```javascript
function performUnitOfWork(fiber) {
  const elements = fiber.props.children;
  let index = 0;
  let prevSibling = null;

  while (index < elements.length) {
    const element = elements[index];

    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null,
    };

    // 处理child和sibling
    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }
}
```

第三件事（选择下一个小任务）：

```javascript
function performUnitOfWork(fiber) {
  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
}
```

总的`performUnitOfWork`如下：

```javascript
function performUnitOfWork(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  // 这里把节点加到了真实页面中
  if (fiber.parent) {
    fiber.parent.dom.appendChild(fiber.dom);
  }

  const elements = fiber.props.children;
  let index = 0;
  let prevSibling = null;

  while (index < elements.length) {
    const element = elements[index];

    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null,
    };

    // 处理child和sibling
    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }

  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
}
```

#### 6. Render and Commit Phases

现在是时候处理第四步开头`ps`中提到的新问题了：浏览器可能会在我们渲染完整个树之前中断我们的工作去响应优先级更高的事件，这种情况下，用户就会看到一个不完整的 UI，这不是我们希望看到的。  
 我们采用类似`“文档碎片”`的方式来解决这个问题，即不在每一个小任务时就立刻把任务`fiber`创建出来的`dom`节点添加到真实页面中，而是当整个任务全部完成之后，在`commit`阶段再将整个`fiber tree`添加到真实`DOM`中，所以前面`performUnitOfWOrk()`中的下面这部分代码需要移掉：

```javascript
if (fiber.parent) {
  fiber.parent.dom.appendChild(fiber.dom);
}
```

同时我们修改和增加下面这些代码：

```javascript
function commitRoot() {
  // child在performUnitOfWork中创建
  commitWork(wipRoot.child);
  wipRoot = null;
}

function commitWork(fiber) {
  if (!fiber) {
    return;
  }
  const domParent = fiber.parent.dom;
  domParent.appendChild(fiber.dom);
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function render(element, container) {
  wipRoot = {
    // ...
  };
  nextUnitOfWork = wipRoot;
}
// wipRoot: Work in Progress
let wipRoot = null;

function workLoop(deadline) {
  // ...
  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }
}
```

#### 7. Reconciliation(diff)

到目前为止，我们一直是在往`DOM`里面加东西，是时候处理**更新**和**删除**了。  
 不管是更新还是删除，我们都需要做同一件事，那就是比较即将提交到`DOM`的`fiber tree`和上一次提交的`fiber tree`的差别，既然需要用到上一次提交的`fiber tree`，那我们需要保留一个指向上一次提交的索引，这里我们把它叫做`currentRoot`。同时我们给`wipRoot(work in progress root)`上增加一个属性`alternate`，它的值就是`currentRoot`：

```javascript
function commitRoot() {
  commitWork(wipRoot.child);
  // 提交之后，保留一个索引
  currentRoot = wipRoot;
  wipRoot = null;
}

function render(element, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    // 建立当前fiber tree和上一次提交的fiber tree之间的联系
    alternate: currentRoot,
  };
}

let currentRoot = null;
```

比较过程中，针对同一位置，我们采用如下所述的方式：

- 如果新旧 `element` 是同一类型节点，那代表我们需要更新一下旧节点
- 如果类型不同并且只有新 `element`，那代表我们需要增加一个新节点
- 如果类型不同并且只有旧 `element`，那代表我们需要删除一个旧节点

注意：这里`React`官方也会使用`key`来辅助判断，这是一种更好的方式。比如，判断一个列表中某些子项的位置是不是发生了变化。  
 **更新**和**删除**让我们不能再那么直接地创建新的`fiber`了，所以`peformUnitOfWork`需要修改，同时我们增加`reconcileChildren`来专门负责`fiber`的增加、删除和更新：

```javascript
function performUnitOfWork(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  const elements = fiber.props.children;
  // 专门处理diff
  reconcileChildren(fiber, elements);
  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
}

function reconcileChildren(wipFiber, elements) {
  let index = 0;
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child;
  let prevSibling = null;

  while (index < elements.length || oldFiber !== null) {
    const element = elements[index];
    let newFiber = null;

    // compare oldFiber to element
    const sameType = oldFiber && element && element.type === oldFiber.type;

    if (sameType) {
      // 类型相同，更新属性
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: "UPDATE",
      };
    }
    if (element && !sameType) {
      // 新增节点
      newFiber = {
        type: element.type,
        props: element.props,
        // dom即是本fiber对应的真实dom，需要通过createDom创建出来
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: "PLACEMENT",
      };
    }
    if (oldFiber && !sameType) {
      // 移除节点，先记录，在commit阶段统一移除
      oldFiber.effectTag = "DELETION";
      // 注意，这里又一个全局变量
      deletions.push(oldFiber);
    }

    // fiber tree结构将dom的children转换成了一个child和众多的sibling
    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (index === 0) {
      wipFiber.child = newFiber;
      // 注意这里的变化，由原本的else改为了else if
    } else if (element) {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }
}
```

可以看到上面针对删除节点，我们新增加了一个全部变量`deletions`，像上面第 6 步中提到的一样，针对“删除”，我们同样等到 `commit` 阶段统一来处理。所以我们增加如下代码：

```javascript
function render(element, container) {
  // ...
  deletions = [];
  // ...
}

// ...
let deletions = null;

function commitRoot() {
  deletions.forEach(commitWork);
  // ...
}

function commitWork(fiber) {
  if (!fiber) {
    return;
  }
  const domParent = fiber.parent.dom;
  // 修改真实 dom
  if (fiber.effectTag === "PLACEMENT" && fiber.dom !== null) {
    domParent.appendChild(fiber.dom);
  } else if (fiber.effectTag === "UPDATE" && fiber.dom !== null) {
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag === "DELETION") {
    domParent.removeChild(fiber.dom);
  }
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function updateDom(dom, prevProps, nextProps) {
  // TODO
}
```

接下来实现`updateDom`：

```javascript
const isProperty = (key) => key !== "children";
// 拿到需要更新的新属性
const isNew = (prev, next) => (key) => prev[key] !== next[key];
// 拿到所有需要移除的旧属性
const isGone = (prev, next) => (key) => !(key in next);

function updateDom(dom, prevProps, nextProps) {
  // 移除旧属性，这里是把所有旧属性的值改成空字符串了，并没有删除旧属性
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach((name) => {
      dom[name] = "";
    });

  // 设置需要更新的新属性的值
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => (dom[name] = nextProps[name]));
}
```

在处理属性更新、删除以及新增时，有一种特殊属性值得我们注意，那就是**事件处理函数**，即以`on`开头的属性，这种的处理方式有些许不同：

```javascript
const isEvent = (key) => key.startsWith("on");
const isProperty = (key) => key !== "children" && !isEvent(key);

function updateDom(dom, prevProps, nextProps) {
  // 如果事件处理函数改变了，那么先移除
  Object.keys(prevProps)
    .filter(isEvent)
    .filter((key) => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name]);
    });

  // 然后再补回去
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[name]);
    });
}
```

#### 8. 函数式组件

接下来我们准备实现函数式组件，让我们以一个新的例子开始：

```javascript
/** @jsx Didact.createElement */
function App(props) {
  return <h1>Hi { props.name }</h1>;
}

const container = document.getElementBtId("root");
const element = <App name="foo">;
Didact.render(element, container);
```

`jsx`转换成`js`的话，这个例子相当于：

```javascript
function App(props) {
  return Didact.createElement("h1", "null", "Hi", props.name);
}

const element = Didact.createElement(App, { name: "foo" });
```

函数式组件有两点不同之处：

- 函数式组件的 fiber 没有`DOM node`，我们的`createDom`是根据`fiber.type`来对应创建真实的`dom`，但是函数式组件的`fiber.type`并不对应任何真实的`h5`标签。
- `children`来自函数的返回值而不是直接从`props`中取得

我们根据`fiber.type`来判断是否为函数式组件，然后依据判断结果走向不同的流程：

```javascript
function performUnitOfWork(fiber) {
  const isFunctionComponent = fiber.type instanceof Function;
  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }
  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
}

function updateFunctinoComponent(fiber) {
  // TODO
}

// 和原先的处理方式一样
function updateHostComponent(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  reconcileChildren(fiber, fiber.props.children);
}
```

在`updateFunctionComponent`中，我们运行函数来拿到`children`；以我们的例子来看，`fiber.type`就是`App`函数本身，所以只需要运行一下`fiber.type()`自然就能拿到`children`的`h1`：

```javascript
function updateFunctionComponent(fiber) {
  const children = [fiber.type(fiber.props)];
  // 拿到children之后，处理方式也是和原先一样
  reconcileChildren(fiber, children);
}
```

由于函数式组件没有`DOM node`，我们需要改变`commitWork`函数的两个地方：

```javascript
function commitWork(fiber) {
  if (!fiber) {
    return;
  }
  // 由于函数式组件的存在，不能再像之前那样直接取父级的真实dom
  let domParentFiber = fiber.parent;
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent;
  }
  const domParent = domParentFiber.dom;

  if (fiber.effectTag === "PLACEMENT" && fiber.dom !== null) {
    domParent.appendChild(fiber.dom);
  }
  // ...
  else if (fiber.effectTag === "DELETION") {
    commitDeletion(fiber, domParent);
  }
  // ...
}

function commitDeletion(fiber, domParent) {
  if (fiber.dom) {
    domParent.removeChild(fiber.dom);
  } else {
    commitDeletion(fiber.child, domParent);
  }
}
```

#### 9. Hooks

终于最后一步了，有了函数式组件怎么能没有`Hooks`呢，让我们给函数式组件增加一些**状态(state)**。

```javascript
const Didact = {
  createElement,
  render,
  useState,
};

/** @jsx Didact.createElement */
function Counter() {
  const [state, setState] = Didact.useState(1);
  return <h1 onClick={() => setState((c) => c + 1)}>Count: {state}</h1>;
}

const element = <Counter />;
```

上面是我们新的例子，接着我们来实现一个`useState`：

```javascript
// work in the progress fiber
let wipFiber = null;
// 用来支持同一个组件中多次调用useState，这也是为什么react官方的钩子函数不能在条件语句中声明的原因，跟踪hook是用的下标
let hookIndex = null;

function updateFunctionComponent(fiber) {
  wipfiber = fiber;
  hookIndex = 0;
  wipFiber.hooks = [];
  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children);
}

function useState(initial) {
  const oldHook =
    wipFiber.alternate &&
    wipFiber.alternate.hooks &&
    wipFiber.alternate.hooks[hookIndex];
  const hook = {
    state: oldHook ? oldHook.state : initial,
    // 存放更新state的函数
    queue: [],
  };

  // 运行setState的操作，以我们的例子来说就是(c) => c + 1
  const actions = oldHook ? oldHook.queue : [];
  actions.forEach((action) => {
    hook.state = action(hook.state);
  });

  const setState = (action) => {
    hook.queue.push(action);
    wipRoot = {
      dom: currentRoot.dom,
      props: currentRoot.props,
      alternate: currentRoot,
    };
    // 即然状态更新了，那么就需要重新render，这里设置nextUnitOfWork来开启一个新的render
    nextUnitOfWork = wipRoot;
    deletions = [];
  };

  wipFiber.hooks.push(hook);
  hookIndex++;
  return [hook.state, setState];
}
```

## 四、参考资料

_Rodrigo Pombo_，[Build your own React](https://pomb.us/build-your-own-react/)
