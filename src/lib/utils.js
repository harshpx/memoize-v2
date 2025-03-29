import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import avatar from "animal-avatar-generator";
import Cookies from "js-cookie";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const colors = [
  "#171717",
  "#4b004f",
  "#510424",
  "#053345",
  "#FF9D76",
  "#FB3569",
  "#AC87C5",
  "#2D9596",
  "#789461",
  "#B47B84",
  "#C69774",
];

export const avatars = [
  "https://i.imgur.com/8GO2mo5.png",
  "https://i.imgur.com/DX92Le8.png",
  "https://i.imgur.com/w6quc8D.png",
  "https://i.imgur.com/5KFWFer.png",
  "https://i.imgur.com/hZEkVPz.png",
  "https://i.imgur.com/uaTcVQo.png",
  "https://i.imgur.com/ZIPnYJU.png",
  "https://i.imgur.com/994qIEz.png",
  "https://i.imgur.com/xv7TdK9.png",
  "https://i.imgur.com/jW7j7H9.png",
  "https://i.imgur.com/Wx95aDx.png",
  "https://i.imgur.com/yG2mnU5.png",
];

export const setCookie = (name, value, days = 10) => {
  Cookies.set(name, JSON.stringify(value), { expires: days });
};

export const getCookie = (name) => {
  return Cookies.get(name) ? JSON.parse(Cookies.get(name)) : null;
};

export const deleteCookie = (name) => {
  Cookies.remove(name);
};
