const form = document.querySelector("form");
const inputName = form.querySelector("input[name=name]");
const inputPoint = form.querySelector("input[name=point]");
const templateItem = document.querySelector("#item");
const list = document.querySelector("#list");
const total = document.querySelector("#total");

const compute = () => {
  let sum = 0;
  for (let i = 0; i < list.children.length; i++) {
    const item = list.children[i];
    const point = parseInt(item.querySelector(".point").innerText, 10);
    const nb = parseInt(item.querySelector(".nb").innerText, 10);
    const subtotal = nb * point;
    item.querySelector(".subtotal").innerText = String(subtotal);
    sum += subtotal;
  }
  total.innerText = String(sum);
};

form.addEventListener(
  "submit",
  (e) => {
    e.preventDefault();
    const item = templateItem.content.cloneNode(true);
    item.querySelector(".name").innerText = inputName.value;
    item.querySelector(".point").innerText = inputPoint.value;
    inputName.value = "";
    inputPoint.value = "1";
    inputName.focus();

    const nb = item.querySelector(".nb");

    item.querySelector(".plus").addEventListener(
      "click",
      () => {
        const v = parseInt(nb.innerText, 10);
        nb.innerText = v + 1;
        compute();
      },
      false
    );

    item.querySelector(".minus").addEventListener(
      "click",
      () => {
        const v = parseInt(nb.innerText, 10);
        if (v === 0) return;
        nb.innerText = v - 1;
        compute();
      },
      false
    );

    list.appendChild(item);
  },
  false
);
