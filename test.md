# 标题

# 1

## 2

### 3

##### 4

###### 5

# 引用

>这是一段引用

# 列表

1. question1;
2.  xxx;
1.  question2;
3.  xxx;
4.  question3;

- aojx
  - axios
- ajax
  - promise
    - webpack
  
- [x] chifan
- [x] shuijiao
- [ ] dadoudou
  
# 代码块

```javascript
const handleDialog = () => {
  if (versionDialogNotVisible.value === true) {
    if (localStorage.getItem("versionDialogNotVisible") === null) {
      localStorage.setItem(
        "versionDialogNotVisible",
        JSON.stringify(versionDialogNotVisible.value)
      );
    } else {
      localStorage.setItem(
        "versionDialogNotVisible",
        JSON.stringify(versionDialogNotVisible.value)
      );
    }
  }
  dialogVisible.value = false;
};
```

# 数学公式
$
\frac{\partial f}{\partial x} = 2\sqrt{a}x
$
>居中放大公式
>
$$
\frac{\partial f}{\partial x} = 2\sqrt{a}x
$$

# 表格

| name |  age | grade | sex | learning |
| :--- | ---: | :---: | --- | -------- |
| name |  age | grade | sex | learning |
|      |  age | grade | sex | learning |
|      |  age |       | sex | learning |

# 脚注

AJAX ^[重要]

^[重要]:确实很重要

# 横线

---
哈哈哈哈哈

---

# 链接

[百度](baidu.com '一个搜索引擎')&nbsp;&nbsp;

---
[百度][id]&nbsp;&nbsp; 这样是可以实现复用链接名称，注意放在id声明之前

[id]:baidu.com '一个搜索引擎'   

[前往表格](#表格)

URL：

http://www.baidu.com

![百度](图片链接 '百度')

*斜体* **加粗** ~~删除线~~ <u>下划线</u>
 `单行代码 printf()`
H~2~O x^2^
==高亮文字==

:clown_face:

# 直接使用<HTML>标记语言

<mark style="color:red;">HTML</mark>

<hr/>

<div class="div_test">
你好，我是傻子
</div>

<style>
    .div_test {
        color: red;
        background-color: pink;
        text-align: center;
    }
</style>