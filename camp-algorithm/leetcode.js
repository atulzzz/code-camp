/**
 * @param {number[]} nums
 * @return {number}
 */
var singleNumber = function (nums) {
  let result = nums[0];
  let index = 1;
  while (index < nums.length) {
    result ^= nums[index];
    index += 1;
  }
  return result;
};
// 1 1 2 2 4 10 10
// console.log(singleNumber([1, 2, 4, 10, 10, 2, 1]));

/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var subarraySum = function (nums, k) {
  let count = 0;
  let prev = 0;
  const record = new Map();
  record.set(0, 1);
  for (let i = 0; i < nums.length; i++) {
    prev += nums[i];
    if (record.get(prev - k)) {
      count += record.get(prev - k);
    }
    record.set(prev, (record.get(prev) || 0) + 1);
  }
  return count;
};

/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var maxSlidingWindow = function (nums, k) {
  const queue = [nums[0]];
  const result = [];
  // 先构建递减队列
  for (let i = 1; i < k; i++) {
    while (queue.length && queue[queue.length - 1] < nums[i]) {
      queue.pop();
    }
    queue.push(nums[i]);
  }
  result.push(queue[0]);
  // 移动窗口
  for (let i = k; i < nums.length; i++) {
    const removed = nums[i - k];
    removed === queue[0] && queue.shift();
    while (queue.length && queue[queue.length - 1] < nums[i]) {
      queue.pop();
    }
    queue.push(nums[i]);
    result.push(queue[0]);
  }
  return result;
};

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var searchInsert = function (nums, target) {
  // 核心在于找到第一个大于等于 target 的 num
  const recursion = (left, right) => {
    if (left === right) {
      return nums[left] >= target ? left : left + 1;
    }
    const location = Math.floor((left + right) / 2);
    if (nums[location] === target) {
      return location;
    } else if (nums[location] > target) {
      // 往左边找
      return recursion(left, location);
    } else {
      // 往右边找
      return recursion(location + 1, right);
    }
  };
  return recursion(0, nums.length - 1);
};

/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

/**
 * @param {ListNode} headA
 * @param {ListNode} headB
 * @return {ListNode}
 */
var getIntersectionNode = function (headA, headB) {};

/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var sortColors = function (nums) {
  const swap = (a, b) => {
    let temp = nums[a];
    nums[a] = nums[b];
    nums[b] = temp;
  };

  let ptr0 = 0;
  let ptr2 = nums.length - 1;
  for (let i = 0; i <= ptr2; i++) {
    while (nums[i] === 2) {
      swap(i, ptr2);
      ptr2 -= 1;
    }
    if (nums[i] === 0) {
      swap(ptr0, i);
      ptr0 += 1;
    }
  }
};

/**
 * @param {string} s
 * @param {string} t
 * @return {string}
 */
var minWindow = function (s, t) {
  if (s.length < t.length || s.length === 1) {
    return s === t ? s : "";
  }
  const hash = {};
  for (let i = 0; i < t.length; i++) {
    hash[t[i]] = (hash[t[i]] || 0) + 1;
  }
  let count = Object.keys(hash).length;
  // 既然是求最短字串，那么在 s 中选取的子串的首尾字符必定在 t 之内
  let left = 0;
  while (left < s.length && !hash[s[left]]) {
    left += 1;
  }
  let right = left;
  let result = [-Infinity, Infinity];
  const window = {};
  while (right < s.length) {
    if (hash[s[right]]) {
      window[s[right]] = (window[s[right]] || 0) + 1;
      window[s[right]] === hash[s[right]] && count--;
    }
    // 移动左边界到下一个起点，缩小窗口
    while (count === 0) {
      const len = result[1] - result[0];
      if (len > right - left) {
        result[0] = left;
        result[1] = right;
      }
      if (hash[s[left]]) {
        window[s[left]] -= 1;
        // 不能用 !== 判断，因为可能出现 window 内某个字符出现次数超过 hash
        window[s[left]] < hash[s[left]] && count++;
      }
      left += 1;
    }
    right += 1;
  }
  return result[0] === -Infinity ? "" : s.substring(result[0], result[1] + 1);
};

/**
 * @param {number[]} nums
 * @param {number} k
 * @return {void} Do not return anything, modify nums in-place instead.
 */
const rotate = function (nums, k) {
  k = k % nums.length;
  let count = 0;
  let start = 0;
  while (count !== nums.length) {
    let next = start;
    let temp = nums[next];
    do {
      next = (next + k) % nums.length;
      const b = nums[next];
      nums[next] = temp;
      temp = b;
      count += 1;
    } while (next !== start);
    start += 1;
  }
};
const nums = [-1, -100, 3, 99];
rotate(nums, 2);

/**
 * @param {number[]} nums
 * @return {number[]}
 */
var productExceptSelf = function (nums) {
  const len = nums.length;
  // 前缀积
  const prefix = [1, nums[0]];
  for (let i = 2; i < len; i++) {
    prefix[i] = prefix[i - 1] * nums[i - 1];
  }
  // 后缀积
  const suffix = new Array(len).fill(1);
  suffix[len - 2] = nums[len - 1];
  for (let i = len - 3; i >= 0; i--) {
    suffix[i] = suffix[i + 1] * nums[i + 1];
  }
  // 合并求积
  const result = [];
  for (let i = 0; i < len; i++) {
    result[i] = prefix[i] * suffix[i];
  }
  return result;
};

/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} n
 * @return {ListNode}
 */
var removeNthFromEnd = function (head, n) {
  if (!head.next) {
    return null;
  }
  let left = head;
  let right = head;
  n -= 1;
  while (n && right) {
    right = right.next;
    n -= 1;
  }
  let prev = null;
  while (right.next) {
    prev = left;
    left = left.next;
    right = right.next;
  }
  // if n = list.length
  if (prev) {
    prev.next = left.next;
  } else {
    head = head.next;
  }
  return head;
};

/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var swapPairs = function (head) {
  let left = head;
  let right = left.next;
  let lastSwapR = null;
  if (right) {
    head = right;
  }
  while (left && right) {
    left.next = right.next;
    right.next = left;
    if (!lastSwapR) {
      lastSwapR = left;
    } else {
      lastSwapR.next = right;
      lastSwapR = left;
    }
    left = left.next;
    right = left?.next;
  }
  return head;
};

// [1,2,3,4,5,6]
// [2,1,3,4,5,6]

/**
 * @param {number} capacity
 */
var LRUCache = function (capacity) {
  this.map = new Map();
  this.maxCapacity = capacity;
  this.last = null;
  this.head = null;
};

/**
 * @param {number} key
 * @return {number}
 */
LRUCache.prototype.get = function (key) {
  // if access, then move to head
  if (this.map.has(key)) {
    // node: { key, value: xxx, prev: node, next: node }
    const node = this.map.get(key);
    const headNode = this.map.get(this.head);
    const prevNode = node.prev;
    const nextNode = node.next;
    if (!prevNode) {
      return node.value;
    }
    // set node to head;
    node.prev = null;
    node.next = headNode;
    headNode.prev = node;
    this.head = key;
    // link prevNode and nextNode
    prevNode.next = nextNode;
    if (nextNode) {
      nextNode.prev = prevNode;
    } else {
      this.last = prevNode.key;
    }
    return node.value;
  }
  return -1;
};

/**
 * @param {number} key
 * @param {number} value
 * @return {void}
 */
LRUCache.prototype.put = function (key, value) {
  if (this.map.has(key)) {
    this.map.get(key).value = value;
    this.get(key);
    return;
  }
  // if is a new key
  if (!this.map.size || this.maxCapacity === 1) {
    this.last = key;
    this.head = key;
    this.map.clear();
    this.map.set(key, { key, value, prev: null, next: null });
    return;
  }
  if (this.map.size === this.maxCapacity) {
    const lastNode = this.map.get(this.last);
    this.last = lastNode.prev.key;
    lastNode.prev.next = null;
    this.map.delete(lastNode.key);
  }
  const headNode = this.map.get(this.head);
  const newNode = { key, value, prev: null, next: headNode };
  headNode.prev = newNode;
  this.map.set(key, newNode);
  this.head = key;
};

/**
 * Your LRUCache object will be instantiated and called as such:
 * var obj = new LRUCache(capacity)
 * var param_1 = obj.get(key)
 * obj.put(key,value)
 */
var ListNode = function (val) {
  this.val = val ?? null;
  this.minBeforeEnter = Infinity;
  this.prev = null;
  this.next = null;
};

var insertNode = function (a, b, c) {
  a.next = b;
  b.prev = a;
  c.prev = b;
  b.next = c;
};

var link2Nodes = function (a, b) {
  a.next = b;
  b.prev = a;
};

var MinStack = function () {
  this.size = 0;
  this.min = Infinity;
  this.dummyHead = new ListNode();
  this.dummyEnd = new ListNode();
  link2Nodes(this.dummyHead, this.dummyEnd);
};

/**
 * @param {number} val
 * @return {void}
 */
MinStack.prototype.push = function (val) {
  const node = new ListNode(val);
  if (!this.size) {
    insertNode(this.dummyHead, node, this.dummyEnd);
    this.min = val;
    this.size = 1;
    return;
  }
  this.size += 1;
  node.minBeforeEnter = this.min;
  this.min = Math.min(this.min, val);
  const realEnd = this.dummyEnd.prev;
  insertNode(realEnd, node, this.dummyEnd);
};

/**
 * @return {void}
 */
MinStack.prototype.pop = function () {
  if (!this.size) {
    return null;
  }
  this.size -= 1;
  const realEnd = this.dummyEnd.prev;
  link2Nodes(realEnd.prev, this.dummyEnd);
  // 如果弹出的节点刚好是最小值节点，那么最小值需要更新成这个节点入栈之前，栈内的最小值
  if (realEnd.val === this.min) {
    this.min = realEnd.minBeforeEnter;
  }
  return realEnd.val;
};

/**
 * @return {number}
 */
MinStack.prototype.top = function () {
  return this.dummyEnd.prev.val;
};

/**
 * @return {number}
 */
MinStack.prototype.getMin = function () {
  return this.min;
};

/**
 * Your MinStack object will be instantiated and called as such:
 * var obj = new MinStack()
 * obj.push(val)
 * obj.pop()
 * var param_3 = obj.top()
 * var param_4 = obj.getMin()
 */

/**
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */

/* 
1 2 3
4 5 6
7 8 9
*/

var loop = function (matric, startX, startY) {
  let currX = startX;
  let currY = startY;
  let currV = matric[currX][currY];
  do {
    const nextX = currY;
    const nextY = matric.length - 1 - currX;
    currV = currV + matric[nextX][nextY];
    matric[nextX][nextY] = currV - matric[nextX][nextY];
    currV = currV - matric[nextX][nextY];
    currX = nextX;
    currY = nextY;
  } while (currX !== startX || currY !== startY);
};

var rotate1 = function (matrix) {
  let min = 0;
  let max = matrix.length - 1;
  while (min < max) {
    for (let i = min; i < max; i++) {
      loop(matrix, min, i);
    }
    min += 1;
    max -= 1;
  }
};

// const arr = [
//   [1, 2, 3],
//   [4, 5, 6],
//   [7, 8, 9],
// ];
// rotate1(arr);
/* 
  以左下角为坐标原点：
  (0, 0) -> (0, 2)
  (0, 1) -> (1, 2)
  (0, 2) -> (2, 2)

  (1, 0) -> (0, 1)
  (1, 1) -> (1, 1)
  (1, 2) -> (2, 1)

  (2, 0) -> (0, 0)
  (2, 1) -> (1, 0)
  (2, 2) -> (2, 0)

  Ax + By = length - 1;
  Ay = Bx

  (0, 0) -> (0, 3)
  (0, 1) -> (1, 3)
  (0, 2) -> (2, 3)
  (0, 3) -> (3, 3)
  (1, 0) -> (0, 2)
  (1, 1) -> (1, 2)
  (1, 2) -> (2, 2)
  (1, 3) -> (3, 2)
  (2, 0) -> (0, 1)
  (2, 1) -> (1, 1)
  (2, 2) -> (2, 1)
  (2, 3) -> (3, 1)
  (3, 0) -> (0, 0)
  (3, 1) -> (1, 0)
  (3, 2) -> (2, 0)
  (3, 3) -> (3, 0)


  不行，应该按照环来逐个变化，不然不好处理交换期间的暂存问题。

  按照实际坐标(以左上角为起点)变化逐步分析如下：
  (0, 0) -> (0, 2)
  (0, 1) -> (1, 2)
  (0, 2) -> (2, 2)
  (1, 2) -> (2, 1)
  (2, 2) -> (2, 0)
  (2, 1) -> (1, 0)
  (2, 0) -> (0, 0)
  (1, 0) -> (0, 1)
  暂存区长度 = 边长
*/

/* 
示例 1：

输入：nums = [-2,1,-3,4,-1,2,1,-5,4]
输出：6
解释：连续子数组 [4,-1,2,1] 的和最大，为 6 。
示例 2：

输入：nums = [1]
输出：1
示例 3：

输入：nums = [5,4,-1,7,8]
输出：23
*/

/* 
分析：假设下标 n 为结束，最大和是 Max(n)，那么 Max(n + 1) = Math.max(nums[n + 1], Max(n) + nums[n + 1])
*/

/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function (nums) {
  let max = nums[0];
  let prevMax = nums[0];
  for (let i = 1; i < nums.length; i++) {
    const currMax = Math.max(nums[i], prevMax + nums[i]);
    max = Math.max(max, currMax);
    prevMax = currMax;
  }
  return max;
};

/* 
示例 1：

输入：nums = [1,2,0]
输出：3
解释：范围 [1,2] 中的数字都在数组中。
示例 2：

输入：nums = [3,4,-1,1]
输出：2
解释：1 在数组中，但 2 没有。
示例 3：

输入：nums = [7,8,9,11,12]
输出：1
解释：最小的正数 1 没有出现。
*/

/**
 * @param {number[]} nums
 * @return {number}
 */
var firstMissingPositive = function (nums) {
  const hash = new Set(nums);
  for (let i = 1; ; i++) {
    if (!hash.has(i)) {
      return i;
    }
  }
};

/**
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */

var setFlags = function (matrix, x, y, rows, cols) {
  for (let i = 0; i < rows; i++) {
    if (i !== x && matrix[i][y] !== 0) {
      matrix[i][y] = "A";
    }
  }
  for (let i = 0; i < cols; i++) {
    if (i !== y && matrix[x][i] !== 0) {
      matrix[x][i] = "A";
    }
  }
};
var setZeroes = function (matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (matrix[i][j] === 0) {
        setFlags(matrix, i, j, rows, cols);
      }
    }
  }
  // change "A" to 0
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (matrix[i][j] === "A") {
        matrix[i][j] = 0;
      }
    }
  }
};

/* 
关键在于找起点：
1. 如果是左上角作起点，往右和往下，数字都会越来越大，不行。
2. 如果是右上角作起点，往左，数字越来越小；往下，数字越来越大，可以。
3. 如果是左下角作起点，往上，数字越来越小；往右，数字越来越大，可以。
4. 如果是右下角作起点，往左和往上，数字都会越来越小，不行。
*/

/**
 * @param {number[][]} matrix
 * @param {number} target
 * @return {boolean}
 */
var searchMatrixV2 = function (matrix, target) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  let row = 0;
  let col = cols - 1;
  while (col >= 0 && row < rows) {
    const value = matrix[row][col];
    if (value === target) {
      return true;
    }
    if (value > target) {
      col -= 1;
    } else {
      row += 1;
    }
  }
  return false;
};

/**
 * // Definition for a _Node.
 * function _Node(val, next, random) {
 *    this.val = val;
 *    this.next = next;
 *    this.random = random;
 * };
 */

/**
 * @param {_Node} head
 * @return {_Node}
 */
var copyRandomList = function (head) {
  const hash = new Map();
  const recursion = (head) => {
    if (!head) {
      return null;
    }
    if (hash.has(head)) {
      return hash.get(head);
    }
    const newNode = new _Node(head.val);
    hash.set(head, newNode);
    newNode.next = recursion(head.next);
    newNode.random = recursion(head.random);
    return newNode;
  };
  return recursion(head);
};

/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
var diameterOfBinaryTree = function (root) {
  // 计算每个节点左右子树的最大深度，然后相加
};

/**
 * @param {number} n
 * @return {number}
 */
var numSquares = function (n) {
  const rows = n + 1;
  const cols = Math.floor(Math.sqrt(n));
  const dp = new Array(rows).fill(0).map(() => new Array(cols).fill(0));
  for (let i = 1; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      // material
      const m = j + 1;
      if (m * m > i) {
        dp[i][j] = dp[i][j - 1];
      } else {
        const a = dp[i - m * m][j] + 1;
        const b = dp[i][j - 1] || Infinity;
        dp[i][j] = Math.min(a, b);
      }
    }
  }
  return dp[n][cols - 1];
};
/* 
最大物料 <= Math.floor(Math.sqrt(n))

假设 dp[i][j] 是从 [0, j] 中选物料装满容量为 i 的背包时，所需要的最少物料。

以 n = 12 进行分析，n = 12，最大物料 = 3
    1   2   3
0   0   0   0 
1   1   1   1 -> 物料需要 <= 1，2 & 3 不可能用到，直接取 1 的值
2   2   2   2
3   3   3   3
4   4   2   2
5
6
7
8
9
10
11
12

如果拿了物料 j，那么 dp[i][j] = dp[i - j*j][j] + 1;
如果不拿物料 j，那么 dp[i][j] = dp[i][j - 1] || Infinity
综合，dp[i][j] = Math.min(dp[i - j*j][j] + 1, dp[i][j - 1] || Infinity)
*/

/**
 * @param {number[]} nums
 * @return {number}
 */
var lengthOfLIS = function (nums) {
  let max = 1;
  const hash = { [max]: nums[0] };
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] > hash[max]) {
      max += 1;
      hash[max] = nums[i];
    }
    if (nums[i] < hash[max]) {
      let tempMax = max - 1;
      let currIMax = 0;
      do {
        if (hash[tempMax] === undefined) {
          currIMax = 1;
        } else {
          currIMax = nums[i] > hash[tempMax] ? tempMax + 1 : 0;
        }
        tempMax -= 1;
      } while (!currIMax);
      hash[currIMax] = Math.min(nums[i], hash[currIMax]);
    }
  }
  return max;
};

/* 
假设 dp[i] 是 nums 中以下标 i 为结尾元素的最长严格递增子序列的长度，则可做以下分析：
1. 找到 Math.max(dp[0], dp[1], ..., dp[i - 1])，
2. 如果 nums[i] > nums[maxIndex]，dp[i] = max + 1, max = max + 1
3. 如果 nums[i] === nums[maxIndex]，dp[i] = max
4. 如果 nums[i] < nums[maxIndex]，排除 dp[maxIndex]，重回 #1

[10, 9, 2, 5, 3, 7, 101, 18]

10: 1
9:  1
2:  1
5:  2
3:  2
7:  3
101:4
18: 4
*/

/**
 * @param {number[]} nums
 * @return {number}
 */
var maxProduct = function (nums) {
  if (!nums.length) {
    return 0;
  }
  const dp = [];
  let max = -Infinity;
  let lastZeroIndex = -1;
  let prevNegativeNum = 0;
  let firstBelow0Index = Infinity;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] >= 0) {
      dp[i] = Math.max(nums[i], nums[i] * (dp[i - 1] || 1));
    } else {
      if (!prevNegativeNum) {
        dp[i] = nums[i];
      } else if (!(prevNegativeNum % 2)) {
        dp[i] = product(nums, firstBelow0Index + 1, i);
      } else {
        dp[i] = product(nums, lastZeroIndex + 1, i);
      }
      prevNegativeNum++;
      firstBelow0Index = Math.min(i, firstBelow0Index);
    }
    if (nums[i] === 0) {
      lastZeroIndex = i;
      prevNegativeNum = 0;
      firstBelow0Index = Infinity;
    }
    max = Math.max(max, dp[i]);
  }
  return max;
};

var product = function (nums, l, r) {
  let result = 1;
  for (let i = l; i <= r; i++) {
    result *= nums[i];
  }
  return result;
};

/* 
示例 1:
  输入: nums = [2,3,-2,4]
  输出: 6
  解释: 子数组 [2,3] 有最大乘积 6。

示例 2:
  输入: nums = [-2,0,-1]
  输出: 0
  解释: 结果不能为 2, 因为 [-2,-1] 不是子数组。

假设 dp[i] 是以 i 为结尾的最大乘积，那么
1. nums[i] = 0, dp[i] = nums[i];
2. nums[i] > 0, dp[i] = Math.max(nums[i], dp[i - 1] * nums[i]);
3. nums[i] < 0, 需要看之前有几个负数和零，或者说最近的一个零后面有几个负数。假设最新的零下标是 m
  A. 如果没有负数，那 dp[i] = nums[i]
  B. 如果有偶数个负数，那 dp[i] = nums[n + 1] * nums[n + 2] * ... * nums[i] -> nums[n] 是 m 之后的第一个负数
  C. 如果有奇数个负数，那 dp[i] = nums[m + 1] * nums[m + 2] * ... * nums[i]
4. max = Math.max(dp[i], max);
*/

/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {number[]} nums
 * @return {TreeNode}
 */
var sortedArrayToBST = function (nums) {
  /* 
    1. 所有节点的左右子树高度差不能超过 1
    2. 所有节点满足 left < root < right
    => nums 升序，层次遍历，从上到下，从左到右逐个构建
  */
  const recursion = (l, r) => {
    if (l === r) {
      return null;
    }
    const m = Math.floor((l + r) / 2);
    const root = new TreeNode(nums[m]);
    root.left = recursion(l, m);
    root.right = recursion(m + 1, r);
    return root;
  };
  return recursion(0, nums.length);
};

// [-10, -3, 0, 5, 9]
// 0 2 => pick -3
// 0 1 => pick -10
// 0 0 => pick null

/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {void} Do not return anything, modify root in-place instead.
 */
var flatten = function (root) {
  // 前序遍历，根左右
  const recursion = (root, node) => {
    if (!node) {
      return root;
    }
    root.left = null;
    root.right = node;
    const r = node.right;
    const last = recursion(node, node.left);
    return recursion(last, r);
  };
  const r = root?.right;
  const last = recursion(root, root?.left);
  recursion(last, r);
  return root;
};

/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {TreeNode}
 */
var lowestCommonAncestor = function (root, p, q) {
  const pPath = getPath(root, p, []);
  const qPath = getPath(root, q, []);
  const same = pPath.filter((node) => qPath.includes(node));
  return same[same.length - 1];
};

var getPath = function (node, target, path) {
  if (!node) {
    return null;
  }
  path.push(node);
  if (node === target) {
    return path;
  }
  if (getPath(node.left, target, path) || getPath(node.right, target, path)) {
    return path;
  }
  path.pop();
};

/**
 * @param {number[][]} matrix
 * @param {number} target
 * @return {boolean}
 */
var searchMatrix = function (matrix, target) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  let row = 0;
  let col = cols - 1;
  while (col >= 0 && row < rows) {
    const value = matrix[row][col];
    if (value === target) {
      return true;
    }
    if (value > target) {
      col -= 1;
    } else {
      row += 1;
    }
  }
  return false;
};

/**
 * @param {number[]} nums
 * @param {number} k
 * @param {number} numOperations
 * @return {number}
 */
var maxFrequency = function (nums, k, numOperations) {
  nums.sort((a, b) => a - b);
  const hash = {};
  for (const num of nums) {
    hash[num] = (hash[num] || 0) + 1;
  }
  let times = 0;
  for (
    let targetV = nums[0] - k;
    targetV < nums[nums.length - 1] + k;
    targetV++
  ) {
    let left = 0;
    let right = nums.length - 1;
    while (nums[left] + k < targetV) left++;
    while (nums[right] - k > targetV) right--;
    // [left, right] 之间的元素，全都是可以通过 +k/-k 之后变成 targetV 的元素
    // 如果 nums 中有正好等于 targetV 的元素，那么不需要消耗 numOperations。其余元素要想变成 targetV，每一个都需要消耗次数
    const self = hash[targetV] || 0;
    const others = Math.min(
      numOperations,
      Math.max(right - left + 1 - self, 0),
    );
    times = Math.max(times, self + others);
  }
  return times;
};

/**
 * @param {string} s
 * @return {boolean}
 */
var hasSameDigits = function (s) {
  const len = s.length;
  // 计算最后一轮变化各个字符出现的次数
  const counts = getYHSJRowNums(len - 2);
  let a = BigInt(0);
  let b = BigInt(0);
  for (let i = 0; i < counts.length; i++) {
    a += (counts[i] * BigInt(s[i])) % 10n;
    b += (counts[i] * BigInt(s[i + 1])) % 10n;
  }
  return a === b;
};

// 计算杨辉三角第 row 行的数字，row 从 0 开始
var getYHSJRowNums = function (row) {
  const a = factorial(row);
  // 杨辉三角每一行的数字是对称的，所以只要算一半就行
  const nums = new Array(row);
  // 计算第 row 行的每一个数字，下标从 0 开始
  for (let i = 0; i <= Math.floor(row / 2); i++) {
    const num = a / (factorial(i) * factorial(row - i));
    nums[i] = num;
    nums[row - i] = num;
  }
  return nums;
};

// 阶乘
var factorial = function (n) {
  n = BigInt(n);
  if (n === 0n) {
    return 1n;
  }
  return n * factorial(n - 1n);
};

/* 
392 -> len = 3
第一轮：39 92
最后一轮第一个数：1个s[0]、1个s[1]、0个其余数

3902 -> len = 4
第一轮：39 90 02
第二轮：3990 9002
最后一轮第一个数：1个s[0]、1个s[2]、2个s[1]、0个其余数

34789 -> len = 5
第一轮：34 47 78 89
第二轮：3447 4778 7889
第三轮：3 444 777 8
最后一轮第一个数：1个s[0]、1个s[3]、3个s[1]、3个s[2]、0个其余数


321881 -> len = 6
第一轮：32 21 18 88 81
第二轮：3221 2118 1888 8881
第三轮：32212118 21181888 18888881
第四轮：3 2222 111111 8888 8 
最后一轮第一个数：1个s[0]、1个s[4]、4个s[1]、4个s[3]、6个s[2]

2318976 -> len = 7
第一轮：23 31 18 89 97 76
第二轮：2331 3118 1889 8997 9776
第三轮：23313118 31181889 18898997 89979776
第四轮：2331311831181889 3118188918898997 1889899789979776
第五轮：2 33333 1111111111 8888888888 99999 7
最后一轮第一个数：1个s[0]、1个s[5]、5个s[1]、5个s[4]、10个s[2]、10个s[3]

12345678 -> len = 8
第一轮：12 23 34 45 56 67 78
第二轮：1223 2334 3445 4556 5667 6778
第三轮：12232334 23343445 34454556 45565667 56676778
第四轮：1223233423343445 2334344534454556 3445455645565667 4556566756676778
第五轮：12232334233434452334344534454556 23343445344545563445455645565667 34454556455656674556566756676778
第六轮：1 222222 333333333333333 44444444444444444444 555555555555555 666666 7

最后一轮(len-2)第一个数：由 [0, len-2] 之间的数字构成，其中每个数字出现的次数和杨辉三角(从0开始算)第(len-2)行匹配
*/

/**
 * @param {string} num1
 * @param {string} num2
 * @return {string}
 */
var multiply = function (num1, num2) {
  return (BigInt(num1) * BigInt(num2)).toString();
};

/**
 * @param {string[]} bank
 * @return {number}
 */
var numberOfBeams = function (bank) {
  let prevLineMachines = 0;
  let beams = 0;
  for (const machines of bank) {
    let nums = 0;
    for (const machine of machines) {
      nums += Number(machine);
    }
    if (nums) {
      beams += prevLineMachines * nums;
      prevLineMachines = nums;
    }
  }
  return beams;
};

/**
 * @param {number[]} balance
 */
var Bank = function (balance) {
  this.balances = [...balance];
};

Bank.prototype.isVaildAccount = function (account) {
  if (account < 1 || account > this.balances.length) {
    return false;
  }
  return true;
};

/**
 * @param {number} account1
 * @param {number} account2
 * @param {number} money
 * @return {boolean}
 */
Bank.prototype.transfer = function (account1, account2, money) {
  // 从被卡住的测试用例来看，题目没有限制相同账号进行转账
  if (this.isVaildAccount(account1) && this.isVaildAccount(account2)) {
    if (this.balances[account1 - 1] >= money) {
      this.balances[account1 - 1] -= money;
      this.balances[account2 - 1] += money;
      return true;
    }
  }

  return false;
};

/**
 * @param {number} account
 * @param {number} money
 * @return {boolean}
 */
Bank.prototype.deposit = function (account, money) {
  if (this.isVaildAccount(account)) {
    this.balances[account - 1] += money;
    return true;
  }
  return false;
};

/**
 * @param {number} account
 * @param {number} money
 * @return {boolean}
 */
Bank.prototype.withdraw = function (account, money) {
  if (this.isVaildAccount(account) && this.balances[account - 1] >= money) {
    this.balances[account - 1] -= money;
    return true;
  }
  return false;
};

/**
 * Your Bank object will be instantiated and called as such:
 * var obj = new Bank(balance)
 * var param_1 = obj.transfer(account1,account2,money)
 * var param_2 = obj.deposit(account,money)
 * var param_3 = obj.withdraw(account,money)
 */

/**
 * @param {number[]} nums
 * @return {string}
 */
var largestNumber = function (nums) {
  // 降序
  nums.sort((a, b) => `${b}${a}` - `${a}${b}`);
  return nums[0] === 0 ? "0" : nums.join("");
};

/* 
  1. 如果两个数字位数相同，那么按照正常的大小进行比较
  2. 如果两个数字位数不同，从头到尾逐个对比，谁大谁排前面。如果长的完全覆盖了短的，那么比较拼接之后的字符串：“短+长” 和 “长+短”。
*/

/**
 * @param {number[]} nums
 * @return {number}
 */
var countValidSelections = function (nums) {
  let count = 0;
  let lSum = 0;
  let sum = nums.reduce((a, b) => a + b);
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) {
      lSum += nums[i];
    } else {
      const rSum = sum - lSum;
      const gap = Math.abs(lSum - rSum);
      if (gap === 0) count += 2;
      if (gap === 1) count += 1;
    }
  }
  return count;
};

countValidSelections([1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 9]);

/* 
1. 0 的左右两边的数字和如果相等，那么就是完美有效 0，计数加二
2. 0 的左右两边的数字和相差一，那么计数加一
*/

/**
 * @param {number} n
 * @return {number}
 */
var smallestNumber = function (n) {
  return Math.pow(2, n.toString(2).length) - 1;
};

/* 
给你一个整数数组 prices ，其中 prices[i] 表示某支股票第 i 天的价格。
在每一天，你可以决定是否购买和/或出售股票。你在任何时候 最多 只能持有 一股 股票。然而，你可以在 同一天 多次买卖该股票，但要确保你持有的股票不超过一股。
返回 你能获得的 最大 利润 。
*/

/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function (prices) {
  let profit = 0;
  let buyIn;
  for (let i = 0; i < prices.length; i++) {
    // 上升阶段的最低点是买入的好时机
    if (prices[i] < prices[i + 1] && buyIn === undefined) {
      buyIn = prices[i];
    }
    // 下降阶段的最高点时卖出的好时机
    if (prices[i] > prices[i + 1] && buyIn !== undefined) {
      profit += prices[i] - buyIn;
      // 卖出之后重置买入状态
      buyIn = undefined;
    }
    // 针对最后一个上涨阶段正好卡在末尾的处理
    if (i === prices.length - 1 && buyIn !== undefined) {
      // 再不卖出就没机会卖出了
      profit += Math.max(prices[i] - buyIn, 0);
    }
  }
  return profit;
};

// console.log(maxProfit([1, 2, 3, 4, 5]));

/**
 * @param {number[]} citations
 * @return {number}
 */
var hIndex = function (citations) {
  citations.sort((a, b) => a - b);
  const length = citations.length;
  for (let i = length - 1; i >= 0; i--) {
    const h = i + 1;
    if (citations[length - 1 - i] >= h) {
      return h;
    }
  }
  return 0;
};

// h 指数 <= citations.length(发布论文数量)

// 实现RandomizedSet 类：

// RandomizedSet() 初始化 RandomizedSet 对象
// bool insert(int val) 当元素 val 不存在时，向集合中插入该项，并返回 true ；否则，返回 false 。
// bool remove(int val) 当元素 val 存在时，从集合中移除该项，并返回 true ；否则，返回 false 。
// int getRandom() 随机返回现有集合中的一项（测试用例保证调用此方法时集合中至少存在一个元素）。每个元素应该有 相同的概率 被返回。
// 你必须实现类的所有函数，并满足每个函数的 平均 时间复杂度为 O(1)

var RandomizedSet = function () {
  // key 是 val，value 是 val 在 arr 中的下标
  this.map = new Map();
  this.arr = new Array();
};

/**
 * @param {number} val
 * @return {boolean}
 */
RandomizedSet.prototype.insert = function (val) {
  if (!this.map.has(val)) {
    this.map.set(val, this.arr.length);
    this.arr.push(val);
    return true;
  }
  return false;
};

/**
 * @param {number} val
 * @return {boolean}
 */
RandomizedSet.prototype.remove = function (val) {
  if (this.map.has(val)) {
    const idx = this.map.get(val);
    this.map.delete(val);
    const lastElement = this.arr.pop();
    // 核心，用最后一个元素替代被移除元素的位置，以此保证数组的连续性
    if (val !== lastElement) {
      this.arr[idx] = lastElement;
      this.map.set(lastElement, idx);
    }
    return true;
  }
  return false;
};

/**
 * @return {number}
 */
RandomizedSet.prototype.getRandom = function () {
  // [0, 1) -> [0, length)
  const random = Math.floor(Math.random() * this.arr.length);
  return this.arr[random];
};

/**
 * Your RandomizedSet object will be instantiated and called as such:
 * var obj = new RandomizedSet()
 * var param_1 = obj.insert(val)
 * var param_2 = obj.remove(val)
 * var param_3 = obj.getRandom()
 */

// ["RandomizedSet","insert","remove","insert","getRandom","remove","insert","getRandom"]
// [[],[1],[2],[2],[],[1],[2],[]]
// var obj = new RandomizedSet();
// var param_1 = obj.insert(1);
// var param_2 = obj.remove(2);
// var param_3 = obj.insert(2);
// var param_4 = obj.getRandom();
// var param_5 = obj.remove(1);

/**
 * 1. 满二叉树是每一层节点数量都达到最大的二叉树
 * 2. 完全二叉树和满二叉树结构类似，节点编号与其在满二叉树中一样，最后一层不是满节点
 * 3. 小顶堆和大顶堆都是堆排序，堆排序是一种选择排序，最好最坏平均时间复杂度都是 O(nlogn)
 * 4. 堆是一种特殊的完全二叉树：
 *  4.1 小顶堆：每一个根节点都小于等于它的左右子节点
 *  4.2 大顶堆：每一个根节点都大于等于它的左右子节点
 * 5. 按照层次遍历的顺序给每个节点编号，并将他们编入数组之中，那么小顶堆和大顶堆的特殊性可用如下表达式表示：
 *  5.1 小顶堆：n[i] <= n[2i+1] && n[i] <= n[2i+2]
 *  5.2 大顶堆：n[i] >= n[2i+1] && n[i] >= n[2i+2]
 * 6. 升序：大顶堆最大值在顶部，得到最大值之后，可以将其和最后的元素互换位置，然后再在前 n-1 个元素中构建新的大顶堆，如此往复可得升序排列结果
 * 7. 降序：小顶堆最小值在顶部，得到最小值之后，可以将其和最后的元素互换位置，然后再在前 n-1 个元素中构建新的小顶堆，如此往复可得降序排列结果
 */

// 小顶堆
var smallHeapSort = function (nums) {
  var down = function (parentIndex, maxIndex = nums.length - 1) {
    const parent = nums[parentIndex];
    const left = 2 * parentIndex + 1;
    const right = left + 1;
    const leftValue = left <= maxIndex ? nums[left] : Infinity;
    const rightValue = right <= maxIndex ? nums[right] : Infinity;
    const min = Math.min(leftValue, rightValue);
    if (min !== Infinity) {
      const smallerSonIndex = min === leftValue ? left : right;
      if (min < parent) {
        nums[parentIndex] = min;
        nums[smallerSonIndex] = parent;
        // 父子节点发生互换，需要看换下去的父节点是否比原来子节点的子节点小
        down(smallerSonIndex, maxIndex);
      }
    }
  };

  var buildSmallHeap = function (nums) {
    /**
     * 1. 父节点下标是 i，左右子节点是 2i+1、2i+2
     * 2. 反推，子节点下标是 i，那么父节点是 (i-1)/2 或者 (i-2)/2，综合是 Math.floor((i-1)/2)
     */
    const length = nums.length;
    // 最后一个叶子结点
    const lastLeaf = length - 1;
    for (let i = Math.floor((lastLeaf - 1) / 2); i >= 0; i--) {
      down(i);
    }
  };

  // 构建小顶堆
  buildSmallHeap(nums);
  const length = nums.length;
  for (let i = length - 1; i > 0; i--) {
    // 调换堆顶和堆尾
    [nums[0], nums[i]] = [nums[i], nums[0]];
    // 调整小顶堆
    down(0, i - 1);
  }
};

// 大顶堆
var bigHeapSort = function (nums) {
  var down = function (parentIndex, maxIndex = nums.length - 1) {
    const parent = nums[parentIndex];
    const left = 2 * parentIndex + 1;
    const right = left + 1;
    const leftValue = left <= maxIndex ? nums[left] : -Infinity;
    const rightValue = right <= maxIndex ? nums[right] : -Infinity;
    const max = Math.max(leftValue, rightValue);
    if (max !== -Infinity) {
      const biggerSonIndex = max === leftValue ? left : right;
      if (max > parent) {
        nums[parentIndex] = max;
        nums[biggerSonIndex] = parent;
        // 父子节点发生互换，需要看换下去的父节点是否比原来子节点的子节点大
        down(biggerSonIndex, maxIndex);
      }
    }
  };

  var buildBigHeap = function (nums) {
    /**
     * 1. 父节点下标是 i，左右子节点是 2i+1、2i+2
     * 2. 反推，子节点下标是 i，那么父节点是 (i-1)/2 或者 (i-2)/2，综合是 Math.floor((i-1)/2)
     */
    const length = nums.length;
    // 最后一个叶子结点
    const lastLeaf = length - 1;
    for (let i = Math.floor((lastLeaf - 1) / 2); i >= 0; i--) {
      down(i);
    }
  };

  // 构建大顶堆
  buildBigHeap(nums);
  const length = nums.length;
  for (let i = length - 1; i > 0; i--) {
    // 调换堆顶和堆尾
    [nums[0], nums[i]] = [nums[i], nums[0]];
    // 调整大顶堆
    down(0, i - 1);
  }
};

/**
 * 给你一个下标从 1 开始的整数数组 numbers ，该数组已按 非递减顺序排列  ，
 * 请你从数组中找出满足相加之和等于目标数 target 的两个数。
 * 如果设这两个数分别是 numbers[index1] 和 numbers[index2] ，则 1 <= index1 < index2 <= numbers.length 。
 * 以长度为 2 的整数数组 [index1, index2] 的形式返回这两个整数的下标 index1 和 index2。
 * 你可以假设每个输入 只对应唯一的答案 ，而且你 不可以 重复使用相同的元素。
 * 你所设计的解决方案必须只使用常量级的额外空间。
 *
 * 示例 1：
 * 输入：numbers = [2,7,11,15], target = 9
 * 输出：[1,2]
 * 解释：2 与 7 之和等于目标数 9 。因此 index1 = 1, index2 = 2 。返回 [1, 2] 。
 */
/**
 * @param {number[]} numbers
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function (numbers, target) {
  let left = 0;
  let right = numbers.length - 1;
  while (left <= right) {
    const sum = numbers[left] + numbers[right];
    if (sum === target) {
      break;
    }
    sum > target && right--;
    sum < target && left++;
  }
  return [left + 1, right + 1];
};
// console.log(twoSum([-1, 0], -1));

/**
 * 给你一个 无重叠的 ，按照区间起始端点排序的区间列表 intervals，其中 intervals[i] = [starti, endi] 表示第 i 个区间的开始和结束，并且 intervals 按照 starti 升序排列。
 * 同样给定一个区间 newInterval = [start, end] 表示另一个区间的开始和结束。
 * 在 intervals 中插入区间 newInterval，使得 intervals 依然按照 starti 升序排列，且区间之间不重叠（如果有必要的话，可以合并区间）。
 * 返回插入之后的 intervals。
 * 注意 你不需要原地修改 intervals。你可以创建一个新数组然后返回它。
 *
 * 示例 1：
 * 输入：intervals = [[1,3],[6,9]], newInterval = [2,5]
 * 输出：[[1,5],[6,9]]
 *
 * 示例 2：
 * 输入：intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]
 * 输出：[[1,2],[3,10],[12,16]]
 * 解释：这是因为新的区间 [4,8] 与 [3,5],[6,7],[8,10] 重叠。
 */
/**
 * @param {number[][]} intervals
 * @param {number[]} newInterval
 * @return {number[][]}
 */
var insert = function (intervals, newInterval) {
  const merge = (a, b) => {
    if ((a[0] <= b[0] && b[0] <= a[1]) || (b[0] <= a[0] && a[0] <= b[1])) {
      return [Math.min(a[0], b[0]), Math.max(a[1], b[1])];
    }
    return a;
  };
  intervals.push(newInterval);
  intervals.sort((a, b) => a[0] - b[0]);
  const result = [intervals[0]];
  let j = 1;
  while (j < intervals.length) {
    const a = result[result.length - 1];
    const b = intervals[j];
    const c = merge(a, b);
    if (a === c) {
      result.push(b);
    } else {
      result[result.length - 1] = c;
    }
    j += 1;
  }
  return result;
};

console.log(
  insert(
    [
      [1, 2],
      [3, 5],
      [6, 7],
      [8, 10],
      [12, 16],
    ],
    [4, 8],
  ),
);
