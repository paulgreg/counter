const form = document.querySelector("form");
const inputName = form.querySelector("input[name=name]");
const inputPoint = form.querySelector("input[name=point]");
const templateItem = document.querySelector("#item");
const list = document.querySelector("#list");
const total = document.querySelector("#total");

const save = () => localStorage.setItem(KEY, JSON.stringify(data));

const addData = ({ name, point }) => {
  data.push({ name, point });
  save();
};

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

const createRow = ({ name, point }, idx) => {
  const item = templateItem.content.cloneNode(true);
  item.querySelector(".name").innerText = name;
  item.querySelector(".point").innerText = point;
  item.querySelector(".item").dataset.idx = idx;

  const nb = item.querySelector(".nb");

  item.querySelector(".plus").addEventListener(
    "click",
    (e) => {
      e.stopPropagation();
      const v = parseInt(nb.innerText, 10);
      nb.innerText = v + 1;
      compute();
    },
    false
  );

  item.querySelector(".minus").addEventListener(
    "click",
    (e) => {
      e.stopPropagation();
      const v = parseInt(nb.innerText, 10);
      if (v === 0) return;
      nb.innerText = v - 1;
      compute();
    },
    false
  );

  list.appendChild(item);
};

form.addEventListener(
  "submit",
  (e) => {
    e.preventDefault();
    const name = inputName.value;
    const point = inputPoint.value;

    createRow({ name, point }, data.length);
    addData({ name, point });

    inputName.value = "";
    inputPoint.value = "1";
    inputName.focus();
  },
  false
);

document.addEventListener(
  "click",
  (e) => {
    e.stopPropagation();
    if (e.target.className === "delete" && confirm("delete ?")) {
      const item = e.target.parentElement;
      const idx = parseInt(item.dataset.idx, 10);
      list.removeChild(item);
      data.splice(idx, 1);
      save();
    }
  },
  false
);

const KEY = "counter_data";
const data = JSON.parse(localStorage.getItem(KEY) ?? "[]");
data.forEach((item, idx) => createRow(item, idx));

const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("./sw.js", {
        scope: "/counter/",
      });
      if (registration.installing) {
        console.log("Service working installing");
      } else if (registration.waiting) {
        console.log("Service working installed");
      } else if (registration.active) {
        console.log("Service working active");
      }
    } catch (error) {
      console.error(`error while installer service worker: ${error}`);
    }
  }
};
registerServiceWorker();
