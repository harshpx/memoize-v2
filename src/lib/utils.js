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
  `data:image/svg+xml;base64,${btoa(avatar("harsh", { size: 400 }))}`,
  `data:image/svg+xml;base64,${btoa(avatar("123", { size: 400 }))}`,
  `data:image/svg+xml;base64,${btoa(avatar("1234", { size: 400 }))}`,
  `data:image/svg+xml;base64,${btoa(avatar("12345", { size: 400 }))}`,
  `data:image/svg+xml;base64,${btoa(avatar("123456", { size: 400 }))}`,
  `data:image/svg+xml;base64,${btoa(avatar("1234567", { size: 400 }))}`,
  `data:image/svg+xml;base64,${btoa(avatar("123456789", { size: 400 }))}`,
  `data:image/svg+xml;base64,${btoa(avatar("1234567890", { size: 400 }))}`,
  `data:image/svg+xml;base64,${btoa(avatar("12345678901", { size: 400 }))}`,
  `data:image/svg+xml;base64,${btoa(avatar("123456789012", { size: 400 }))}`,
  `data:image/svg+xml;base64,${btoa(avatar("12345678901234", { size: 400 }))}`,
  `data:image/svg+xml;base64,${btoa(avatar("123456789012345", { size: 400 }))}`,
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
