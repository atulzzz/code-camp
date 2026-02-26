### Flutter:

Flutter is a cross-platform framework open sourced by Google that supports mobile, web, desktop and embedded devices. At its core, it combines a high-performance graphics engine implemented in C++ and the Dart programming language. In the development environment, Dart will provide type safety checking and stateful hot loading; in the production environment, Dart will compile into native machine code.

`Flutter  ` 是 `Google `开源的一个跨平台框架，支持移动、web、桌面和嵌入式设备。它的核心结合了由 `C++` 实现的高性能图形引擎和 `Dart` 编程语言。开发环境上，`Dart` 会提供类型安全检查和有状态热加载；生产环境上，`Dart` 会编译成本地机器码。

### Start

Digging into the official documentation, you can see Flutter's definition of Widget: **A Widget is an immutable description of part of a user interface.**

Widgets are the basic building blocks of a Flutter app. Everything is a widget in Flutter. A typical application structure built with Widget looks like this:

`Flutter` 官方文档对 ` Widget` 的定义是：**Widget 是用户页面的不可变描述**。

`Widget` 是构建 `Flutter` 应用程序的基础模块，在 `Flutter` 中一切皆 `Widget`。一个由 `Widget` 构建的典型应用程序结构如下所示：

```dart
import 'package:flutter/material.dart';

class HelloWord extends StatelessWidget {
  const HelloWord({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      color: const Color(0xFFFFFFFF),
      child: const Center(
        child: Text(
          'Hello World',
          textDirection: TextDirection.ltr,
          style: TextStyle(color: Colors.black),
        ),
      ),
    );
  }
}

void main() {
  debugPaintSizeEnabled = false; // Set to true for visual layout
  runApp(const HelloWord());
}
```

<img src="./world.png" alt="world" style="zoom:30%;" />

In the code, a HelloWorld Widget is constructed by inheriting the stateless Widget, and then the specific page layout is defined by overriding the build method of Widget. Container and Center are also Widget, the page layout is like a Widget tree.

代码中通过继承无状态 `Widget` 构建了一个 `HelloWorld Widget` ，然后通过重写 `Widget` 的 `build` 方法来定义具体的页面布局，`Container` 和 `Center` 同样也都是 `Widget` ，程序页面布局就像是一棵 `Widget` 树。

### Classification

Widgets can be roughly divided into three categories according to their functions

- Component Widget: Combination type Widget, this type of Widget directly or indirectly inherits from StatelessWidget and StatefulWidget, does not directly participate in the drawing process, is the most contacted Widget in normal business development.
- Renderer Widget: Rendering Widget, the most core Widget type. Responsible for creating RenderObject for Element for rendering, and directly participating in subsequent layout, drawing and other processes. Both Component Widget and Proxy Widget will eventually be mapped here.
- Proxy Widget: The proxy widget itself does not involve the internal logic of the widget, but is used as the support for function implementation, which is used to provide some additional intermediate functions for the Child widget, such as data sharing.

`Widget` 按照功能划分可以大致分为 3 类

- `Component Widget`：组合型 `Widget` ，这类 `Widget` 都直接或间接继承自 `StatelessWidget` 和 `StatefulWidget` ，不会直接参与绘制流程，是平常业务开发中接触最多的 `Widget` 。
- `Renderer Widget`：渲染型 `Widget`，最核心的 `Widget` 类型。负责为 `Element` 创建用于渲染的 `RenderObject` ，直接参与后续的布局、绘制等流程。`Component Widget` 和 `Proxy Widget` 最终都会映射到这里。
- `Proxy Widget`：代理型 `Widget` , 本身不涉及 `Widget` 内部逻辑 ，而是作为功能实现的支持，用于给 `Child Widget` 提供一些附加的中间功能，比如数据共享。

<img src="./Flutter-WidgetCategory.drawio.png" alt="Untitled Diagram.drawio" style="zoom:180%;" />

### Analysis

Below, briefly introduce the core methods of various types of Widgets, so as to better understand how Widgets participate in the entire UI construction process。

#### Widget

overview: base class for everything

设计原则是：概念尽可能地少

`Widget` 的相关属性和方法如下图所示，也可以通过点击[这里](https://github.com/flutter/flutter/blob/master/packages/flutter/lib/src/widgets/framework.dart#L310)查看源代码：

<img src="./Flutter-Widget.drawio.png" alt="Widget" style="zoom:100%;" />

- _Key key：_ `Widget` 在 `Widget Tree` 中的标识，是判定当 `Widget` 更新时原 `Widget` 对应的 `Element` 是复用更新还是销毁新建的条件之一，可以不设置。
- *Element createElement：*根据 `Widget` 创建对应的 `Element` ，多次出现在 `Widget Tree` 中的同一个 `Widget` 也会对应创建多个 `Element` 。
- *static bool canUpdate：*判定能否使用 `new Widget` 来更新 `old Widget` 对应的 `Element` 的方法，命中条件是 `key` 和 `runtimeType` 都相同。需要注意的是，如果 `Widget` 都没有设定 `key` ，那么只需判定 `runtimeType` 即可。

#### StatelessWidget - Abstract Class （抽象类中可以有抽象方法和非抽象方法，抽象方法没有方法体，需要子类去实现）

overview: A widget that does not require mutable state. A stateless widget is a widget that describes part of the user interface by building a constellation of other widgets that describe the user interface more concretely. The building process continues recursively until the description of the user interface is fully concrete.

概述： `StatelessWidget` 无状态 `Widget` ，其 `build` 方法通过组合构建具体 `UI` 的 `Widget` 来描述 `UI` 层级结构。整个构建过程递归进行，直至描述用户页面的 `Widget` 全部 `build` 为实例。

`StatelessWidget` 的相关方如下图所示，也可以点击[这里](https://github.com/flutter/flutter/blob/master/packages/flutter/lib/src/widgets/framework.dart#L520)查看源代码：

<img src="./Flutter-StatelessWidget.drawio.png" alt="StatelessWidget"/>

- _StatelessElement createElement_:：`SatelessWidget` 继承自 `Widget` ，和 `Widget` - `Element` 的关联一样，它同样也存在一个对应的 `StatelessElement` 来负责处理它在树中的位置信息。`StatelessElement` -> `ComponentElement` -> `Element` 。一般情况下继承 `StatelessWidget` 的自定义 `Widget` 不需要关注重写此方法，就像最开始自定义的 `HelloWorld Widget` 一样。

- *Widget build：*平常开发中接触次数最多的 `Flutter` 核心方法，以声明式 UI 的方式描述了当前 `Widget` 在当前用户页面上所对应的 `UI` 层次结构和样式信息，该方法会在下面这两种情况下触发执行：
  - 首次加载
  - 依赖更新。例如，当此 `Widget` 引用的 `InheritedWidget` 发生变化时，那么此 `Widget` 的 `build` 会重新执行。

#### StatefulWidget

overview: A widget that has mutable state. It is useful when the part of the user interface you are describing can change dynamically. [StatefulWidget] instances themselves are immutable and store their mutable state either in separate [State] objects that are created by the [createState] method.

概述：`StatefulWidget` ，有状态 `Widget` ，用于帮助构建动态变化的用户页面。需要注意的是，`StatefulWidget ` 实例本身依旧是不可变的，它们将可变化的状态数据存储在一个独立的 `State` 对象中。

`StatefulWidget` 的相关方法如下图所示，也可以点击[这里](https://github.com/flutter/flutter/blob/master/packages/flutter/lib/src/widgets/framework.dart#L765)查看源代码：

<img src="./Flutter-StatefulWidget.drawio.png" alt="StatelessWidget" style="zoom:120%;" />

- *StatefulElement createElement：*和 `StatelessWidget` 的类似，`StatefulWidget` 对应的 `Element` 为 `StatefulElement` 。 `StatefulElement` -> `ComponentElement` -> `Element` 。

- _State createState：_ `StatefulWidget` 创建 `State` 的方法，**继承 `StatefulWidget` 的自定义 `Widget` 需要重写此方法**，该方法定义了具体的 `ui` 层次结构。在 `StatefulWidget` 转为 `StatefulElement` 时，由 `StatefulElement` 的构造函数调用。当同一个 `StatefulWidget` 在 `Widget Tree` 中被使用多次时，`Flutter` 会多次调用该 `Widget` 的 `createState` 来创建多个彼此之间互相隔离的 `State` 对象。另外，当 `Widget` 在树中被移除后续又再次插入时，为了简化 `State` 对象的生命周期，`Flutter` 会抛弃之前的 `State` 对象，调用 `createState` 再次创建一个新的 `State` 对象。

  ```dart
  /// An [Element] that uses a [StatefulWidget] as its configuration. ( /// means Documentation Comments, /** ... */ is also okay)
  class StatefulElement extends ComponentElement {
    /// Creates an element taht uses the given widget as its configuration
    StatefulElement (StatefulWidget widget)
      : _state = widget.createState(),
    		super(widget) {
          // ...

          // state is _state
          state._element = this;
          state._widget = widget;
        }
  }
  ```

#### State

overview: The logic and internal state for a [StatefulWidget]. It is information that (1) can be read synchronously when the widget is built and (2) might change during the lifetime of the widget. It is the responsibility of the widget implementer to ensure that the [State] is promptly notified when such state changes, using [State.setState].

概述：`StatefulWidget` 的逻辑所在和内部状态。当状态变更时，使用 `setState` 来变更 `State` 来触发重新 `build` 。

The life cycle of a state is complex. There are 11 related descriptions in the source code: [state's life cycle](https://github.com/flutter/flutter/blob/master/packages/flutter/lib/src/widgets/framework.dart#L836) .The whole process is shown in the following figure:

`State` 的生命周期较为复杂，源码中对此做了 11 个相关描述：[State's lifecysle](https://github.com/flutter/flutter/blob/master/packages/flutter/lib/src/widgets/framework.dart#L836) ，整个流程大致如下图所示：

<img src="./lifecycle.png" alt="StatelessWidget" style="zoom:100%;" />

1. 上述生命周期的 `created` 、`initState` 和 `didChangeDependencies` 的执行过程如下图所示：![createState](./ready.png)

2. `State` 和 `BuildContext` 的绑定。这一步骤也存在于 `StatefulElement.constructor` 之中，关键语句即上面图里的 `state._element = this` 。这个 `this` 就是实例化的 `StatefulElement` ，而 `State` 的 `BuildContext` 指向的就是 `state._element` 。这两者的指向关系是永久的，即使该 `Element` 在 `Element Tree` 中发生了移动，这种关系依旧存在，即 `StatefulElement` 是带着状态移动的。

```dart
/// The location in the tree where this widget builds.
///
/// The framework associates [State] objects with a [BuildContext] after
/// creating them with [StatefulWidget.createState] and before calling
/// [initState]. The association is permanent: the [State] object will never
/// change its [BuildContext]. However, the [BuildContext] itself can be moved
/// around the tree.
///
/// After calling [dispose], the framework severs the [State] object's
/// connection with the [BuildContext].
BuildContext get context {
  assert(() {
    if (_element == null) {
      throw FlutterError(
        'This widget has been unmounted, so the State no longer has a context (and should be considered defunct). \n'
        'Consider canceling any active work during "dispose" or using the "mounted" getter to determine if the State is still active.',
      );
    }
    return true;
  }());
  return _element!;
}
```

3. `initState` & `didChandeDependencies` ，`StatefulElement` 在 `mount` 过程中会调用 `initState()` 对 `state` 做初始化，此时已经可以在 `initState` 中访问 `context` & `widget` 属性。在调用 `initState` 做完初始化工作之后， `Flutter` 接着会调用 `didChangeDependencies` ，这个方法在 `State` 依赖的对象发生变化时会触发执行，但是后续流程的 `build` 方法一样会因为依赖更新而触发执行，所以一般情况下这个方法也不需要去重写，除非有非常耗时的操作。
4. `build` ，定义了 `StatefulWidget` 描述的 `UI` 层次结构和样式，此时 `State` 已完全初始化，因状态变化和依赖更新等原因 `Flutter` 后续会多次调用 `build` 方法来渲染当前 `StatefulWidget` 及其子树。可通过 `setState` 主动触发 `build` 。
5. `didUpdateWidget` ，此时 `Element Tree` 和 `RenderObject Tree` 已构建完成，程序的整个 `UI` 已完全显示。当 `parentWidget` 树下某处使用了一个 `newWidget` 来替换原来的 `widget` 构建页面，而且 `newWidget.runtimeType == oldWidget.runtimeType && newWidget.key == oldWidget.key` ，即命中复用更新条件时，原`oldWidget`创建的 `State` 会更新其 `widget` 指向为 `newWidget` ，即 `state._widget = newWidget` ，然后再将`oldWidget` 作为参数调用 `didUpdateWidget` 。
6. `reassemble` ，当通过 `Flutter` 命令行工具输入 `r` 或者 `IDE` 触发热重载时，此方法触发执行，不需要关注。
7. `deactivate` & `activate ` ，在用户交互的过程中，任何节点都有被移除的可能，`State` 也会被随之移除。每当 `Flutter` 从树中移除 `State` 对象时，`state.deactive` 就会被触发。在某些情况下，`Flutter` 会将 `State` 对象移除后又重新插入到树的其他部分（比如说某个使用了 `GlobayKey` 的 `StatefulWidget` 在某次用户交互中变换了层级位置），这时 `Flutter` 会再次调用 `state.activate` 以重新“激活” `State` ，让它能够重新获取在 `deactivate` 中释放的资源，再然后就是重新走 `build` 流程，将 `Widget` 描述的 `ui` 渲染出来。
8. `dispose` ，如果在动画单帧内移除的 `Widget` 没有再次插入到树中，那么 `state.dispose` 方法将触发执行，`State` 生命周期结束。

然后，来看一下用以触发重新 `build` 的 `setState` 方法：

```dart
void setState(VoidCallback fn) {
  assert(fn != null);
  assert(() {
    if (_debugLifecycleState == _StateLifecycle.defunct) {
      throw FlutterError.fromParts(<DiagnosticsNode>[
        ErrorSummary('setState() called after dispose(): $this'),
        ErrorDescription(
          'This error happens if you call setState() on a State object for a widget that '
          'no longer appears in the widget tree (e.g., whose parent widget no longer '
          'includes the widget in its build). This error can occur when code calls '
          'setState() from a timer or an animation callback.',
        ),
        ErrorHint(
          'The preferred solution is '
          'to cancel the timer or stop listening to the animation in the dispose() '
          'callback. Another solution is to check the "mounted" property of this '
          'object before calling setState() to ensure the object is still in the '
          'tree.',
        ),
        ErrorHint(
          'This error might indicate a memory leak if setState() is being called '
          'because another object is retaining a reference to this State object '
          'after it has been removed from the tree. To avoid memory leaks, '
          'consider breaking the reference to this object during dispose().',
        ),
      ]);
    }
    if (_debugLifecycleState == _StateLifecycle.created && !mounted) {
      throw FlutterError.fromParts(<DiagnosticsNode>[
        ErrorSummary('setState() called in constructor: $this'),
        ErrorHint(
          'This happens when you call setState() on a State object for a widget that '
          "hasn't been inserted into the widget tree yet. It is not necessary to call "
          'setState() in the constructor, since the state is already assumed to be dirty '
          'when it is initially created.',
        ),
      ]);
    }
    return true;
  }());
  final Object? result = fn() as dynamic;
  assert(() {
    if (result is Future) {
      throw FlutterError.fromParts(<DiagnosticsNode>[
        ErrorSummary('setState() callback argument returned a Future.'),
        ErrorDescription(
          'The setState() method on $this was called with a closure or method that '
          'returned a Future. Maybe it is marked as "async".',
        ),
        ErrorHint(
          'Instead of performing asynchronous work inside a call to setState(), first '
          'execute the work (without updating the widget state), and then synchronously '
          'update the state inside a call to setState().',
        ),
      ]);
    }
    // We ignore other types of return values so that you can do things like:
    //   setState(() => x = 3);
    return true;
  }());
  _element!.markNeedsBuild();
}
```

源码中可以看到一些关于 `setState` 用法上的注意事项：

1. 不能在 `dispose` 之后 `setState`
2. 不能在构造函数中 `setState`
3. `setState` 的回调函数不能是异步的

可以看到上面源码的最后调用了 `_element!.markNeedsBuild()` ，这个方法的作用就是将当前 `Element` 标记为 `Dirty Element` , 然后调用刷新机制等待 `Flutter` 统一处理 `Dirty Elements` ，此方法源代码简化后如下所示（具体源码可以点击[这里](https://github.com/flutter/flutter/blob/master/packages/flutter/lib/src/widgets/framework.dart#L4531)查看）：

```dart
void markNeedsBuild() {
  assert(_lifecycleState != _ElementLifecycle.defunct);
  if (_lifecycleState != _ElementLifecycle.active) return;
  // ...
  if (dirty) return;
  _dirty = true;
  owner!.scheduleBuildFor(this);
}
```

来看个例子：

```dart
import 'tom.dart';
import 'jerry.dart';
import 'package:flutter_application/demo/share/inherited.dart';
import 'package:flutter/material.dart';

class ShareDemo extends StatefulWidget {
  const ShareDemo({super.key});

  @override
  State<ShareDemo> createState() => _ShareDemo();
}

class _ShareDemo extends State<ShareDemo> {
  late List<Widget> sonWidgets;
  late MaterialColor color;

  @override
  void initState() {
    super.initState();
    sonWidgets = [const Tom(key: Key('Tom')), const Jerry(key: Key('Jerry'))];
    color = Colors.deepOrange;
  }

  // Jerry move with state & deactivate & activate
  void swap() {
    setState(() {
      sonWidgets.insert(
        0,
        Container(
          child: sonWidgets.removeAt(1),
        ),
      );
    });
  }

  // Tom didUpdateWidget
  void changeColor() {
    setState(() {
      color = Colors.deepPurple;
      sonWidgets = [const Tom(key: Key('Tom')), const Jerry(key: GlobalObjectKey('Jerry'))];
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Share Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: Scaffold(
        appBar: AppBar(
          title: const Text('Share Demo'),
        ),
        body: ProviderColor(
          color: color,
          child: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                // const AlbumWidget(),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    ElevatedButton(
                      onPressed: changeColor,
                      child: const Text('Change ProviderColor'),
                    ),
                    ElevatedButton(
                      onPressed: swap,
                      child: const Text('Swap Tom and Jerry'),
                    ),
                  ],
                ),
                ...sonWidgets
              ],
            ),
          ),
        ),
      ),
    );
  }
}


import 'package:flutter/material.dart';
class ProviderColor extends InheritedWidget {
  const ProviderColor({
    super.key,
    required this.color,
    required super.child,
  });

  final Color color;

  static ProviderColor of(BuildContext context) {
    final ProviderColor? result = context.dependOnInheritedWidgetOfExactType<ProviderColor>();
    assert(result != null, 'No ProviderColor found in context');
    return result!;
  }

  @override
  bool updateShouldNotify(ProviderColor oldWidget) => color != oldWidget.color;
}


import 'package:flutter/material.dart';
import 'package:flutter_application/demo/share/inherited.dart';

class Tom extends StatefulWidget {
  const Tom({required Key key}) : super(key: key);

  @override
  State<Tom> createState() => _Tom();
}

class _Tom extends State<Tom> {
  @override
  void initState() {
    super.initState();
    debugPrint('Tom initState');
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    debugPrint('Tom didChangeDependencies');
  }

  @override
  void didUpdateWidget(covariant Tom oldWidget) {
    super.didUpdateWidget(oldWidget);
    debugPrint('Tom didUpdateWidget');
  }

  @override
  Widget build(BuildContext context) {
    debugPrint('Tom build');
    return Text(
      'Hi, I am Tom, and I use ProviderColor',
      style: TextStyle(color: ProviderColor.of(context).color),
    );
  }
}

import 'package:flutter/material.dart';

class Jerry extends StatefulWidget {
  const Jerry({required Key key}) : super(key: key);

  @override
  State<Jerry> createState() => _Jerry();
}

class _Jerry extends State<Jerry> {
  late MaterialColor color;

  @override
  void initState() {
    super.initState();
    color = Colors.brown;
  }

  @override
  void deactivate() {
    super.deactivate();
    debugPrint('Jerry deactivated');
  }

  @override
  void activate() {
    super.activate();
    debugPrint('Jerry activated');
  }

  @override
  void dispose() {
    super.dispose();
    debugPrint('Jerry dispose');
  }

  void changeColor() {
    setState(() {
      color = Colors.lightBlue;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              'Jerry: I am Jerry and I use my own',
              style: TextStyle(color: color),
            ),
            // Stack()
          ],
        ),
        Container(
          margin: const EdgeInsets.symmetric(vertical: 10),
          child: ElevatedButton(
            onPressed: changeColor,
            child: const Text('change own color'),
          ),
        ),
      ],
    );
  }
}

```

上面例子启动之后，可以看到声明周期函数如期运行 `initState` -> `didChangeDependencies` -> `build`：

![lifecycle_01](./lifecycle_01.png)

在点击 `Change ProviderColor` 更改 `InheritedWidget` 提供的 `Color` 之后，可以看到 `Tom` 的文案颜色随之改变，同时新的生命周期函数也如期执行 `didUpdateWidget` -> `didChangeDependencies` -> `build` 。`didChangedDependencies` 触发是因为 `Tom Widget` 依赖了 `InheritedWidget` 提供的 `Color` 。另外，注意在 `changeColor` 中使用了一个全新的使用 `GlobayKey`的 `Jerry` 来替换原来的 `Jerry` ，所以 `deactivated` 和 `dispose` 触发执行了。

![lifecycle_02](./lifecycle_02.png)

接着点击 `Jerry` 的 `change own color` 改变 `Jerry` 的文案颜色，再点击 `Swap Tom and Jerry` ，可以看到 `Jerry` 的 `deactivated` 和 `activated` 触发执行，对应上了前面第 7 点的描述。另外，可以看到 `Jerry` 的文案颜色在交换前后是一样的，这就是前面第 2 点提到的 `StatefulElement` 是带着状态移动的。

![lifecycle_03](./lifecycle_03.png)

一张方法总结图：

![Flutter-State.drawio](./Flutter-State.drawio.png)

ps: `build` 不放在 `StatefulWidget` 中而是放在 `State` 中原因有：

1. 子类继承 `StatefulWidget` 时可以更加灵活
2. 避免隐式闭包中 `this` 导致的 `bug`

具体描述可点击[这里](https://github.com/flutter/flutter/blob/master/packages/flutter/lib/src/widgets/framework.dart#L1276)查看官方在源码中的说明。

#### InheritedWidget

overview：base class for widgets that efficiently propagate information down the tree.

概述：跨多层高效传递数据的基类

<img src="./Flutter-InheriatedWidget-Start.drawio.png" alt="Flutter-InheriatedWidget-Start.drawio" style="zoom:80%;" /><img src="./Flutter-InheriatedWidget-02.drawio.png" alt="Flutter-InheriatedWidget-02.drawio" style="zoom:80%;" />

有种比较常见的场景是层级非常深的某个 `Widget` 想要拿到非常上层的 `Widget` 的数据，比如说网站主题，这种情况下如果依靠数据层层传递的方式，那代码结构会非常的糟糕，维护起来很麻烦。`InheritedWidget` 为解决这个问题而诞生，它下面的所有 `Widget` 都能通过 `BuildContext.dependOnInheritedWidgetOfExactType` 来直接访问到它本身。

`InheritedWidget` 的相关方法如下图所示，也可以点击[这里](https://github.com/flutter/flutter/blob/master/packages/flutter/lib/src/widgets/framework.dart#L1703)查看源代码：

<img src="./Flutter-InheritedWidget.drawio.png" alt="Flutter-InheriatedWidget-Start.drawio" style="zoom:80%;" />

- _InheritedElement createElement：_ `InheritedWidget` 对应的 `Element` 为 `InheritedElement`，一般情况下子类不用重写该方法；
- *bool updateShouldNotify：*在 `InheritedWidget` `rebuilt` 时判断是否需要 `rebuilt` 那些依赖它的 `Widget` 。

ps: 由于 `BuildContext.dependOnInheritedWidgetOfExactType` 不够语义化，所以一般情况 `InheritedWidget` 都会提供一个静态的 `of` 方法来自动执行这条冗长的语句，详情见前面 `State` 的例子。

#### RenderObjectWidget

overview: RenderObjectWidgets provide the configuration for [RenderObjectElement]s, which wrap [RenderObject]s, which provide the actual rendering of the application.

概述：与渲染直接相关的 `Widget` ，对应的 `Element` 类型 为 `RenderObjectElement` ，负责生成 `RenderObject` 渲染页面。

`RenderObjectWidget` 的相关方法如下图所示，也可以点击[这里](https://github.com/flutter/flutter/blob/master/packages/flutter/lib/src/widgets/framework.dart#L1737)查看源代码：

![Flutter-RenderObjectWidget.drawio](./Flutter-RenderObjectWidget.drawio.png)

- _RenderObjectElement createElement：_`RenderObject Widget` 对应的 `Element` 为 `RenderObjectElement` ，由于`RenderObjectElement`是抽象类，所以子类需要重写该方法。
- *RenderObject createRenderObject：*页面渲染的核心，负责创建 `RenderWidget` 对应的 `RenderObject`，子类需要重写该方法。该方法在 `Widget` 对应的 `Element` 的挂载阶段会调用。
- _void updateRenderObject：_ 核心方法，在 `Widget` 更新后，修改对应的 `RenderObject`。该方法在首次 `build` 以及需要更新 `Widget` 时都会调用；
- *void didUnmountRenderObject：*对应的 `Render Object` 从树中被移除时该方法触发执行。

### Summary

`Widget` 无状态，是不可变的，本身并不直接参与最后的 `UI` 渲染，只是描述 `UI` 的配置信息。每种 `Widget` 都会提供一个创建它对应的 `Element` 的方法 —— `createElement` ，它们之间的关系有些类似于 `json` 和 `object` 。`Element` 是 `Widget` 和 `RenderObject` 之间的协调者，它会将 `Widget Tree` 的变化视情况更新到 `RenderObject Tree`。

### 参考资料和推荐阅读

https://github.com/flutter/flutter/blob/master/packages/flutter/lib/src/widgets/framework.dart

https://www.youtube.com/watch?v=996ZgFRENMs

https://www.youtube.com/watch?v=kn0EOS-ZiIc

https://juejin.cn/post/6914486206700978183

https://api.flutter.dev/flutter/widgets/InheritedWidget-class.html

https://juejin.cn/post/6844904152905023496
