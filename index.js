const form = document.querySelector("form");
const inputName = form.querySelector("input[name=name]");
const inputPoint = form.querySelector("input[name=point]");
const templateItem = document.querySelector("#item");
const list = document.querySelector("#list");
const total = document.querySelector("#total");

const KEY = "counter_data";
const data = JSON.parse(localStorage.getItem(KEY) ?? "[]");

const save = () => localStorage.setItem(KEY, JSON.stringify(data));

let saveTimeout;

const delayedSave = () => {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(save, 500);
};

const updateNb = (nameToSearch, nb) => {
  const item = data.find(({ name }) => nameToSearch === name);
  if (item) item.nb = nb;
};

const addRowToData = ({ name, point, nb }) => data.push({ name, point, nb });

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

const createRow = ({ name, point, nb }, idx) => {
  const item = templateItem.content.cloneNode(true);
  item.querySelector(".name").innerText = name;
  item.querySelector(".point").innerText = point;
  item.querySelector(".item").dataset.idx = idx;

  const nbEl = item.querySelector(".nb");
  nbEl.innerText = nb ?? "0";

  const updateCounter = (add) => (e) => {
    e.stopPropagation();
    const existingValue = parseInt(nbEl.innerText, 10);
    if (!add && existingValue === 0) return;
    const updateValue = add ? existingValue + 1 : existingValue - 1;
    nbEl.innerText = updateValue;
    compute();
    updateNb(name, updateValue);
    delayedSave();
  };

  item.querySelector(".plus").addEventListener("click", updateCounter(true), false);
  item.querySelector(".minus").addEventListener("click", updateCounter(false), false);

  list.appendChild(item);
};

form.addEventListener(
  "submit",
  (e) => {
    e.preventDefault();
    const name = inputName.value;
    const point = inputPoint.value;
    const nb = "0";

    createRow({ name, point, nb }, data.length);
    addRowToData({ name, point, nb });

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
      delayedSave();
    }
  },
  false
);

data.forEach((item, idx) => createRow(item, idx));
compute();

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
