# 如何实现一个 Table

- [x] 第一步，能够实现 table 的 column 与 data 渲染，能够实现 column 使用自己的 render 来渲染，基础架构建立
- [x] 加上了 title/footer/summary
- [x] 渲染 表格的 header 
    每一个 column 中的 title 是如何渲染到 table 当中的  
- [x] 单元格合并
    涉及到单元格合并，参数是 colSpan / rowSpan 那么这个参数直接传递到 cell 后，还需要做什么吗？理论上应该不需要吧
    涉及到 column 中直接设定这两个参数，以及在 column render 的时候，会根据 index 来设置，所以需要 column 的 props 的传递
    最后是传递给 td，然后设置上这两个参数
  
---
还有的重点就是
1. header 固定
2. 左右两栏可以实现固定
3. 可以实现 row 下面可以展开 row / table 