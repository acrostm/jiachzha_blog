"use client";

/* eslint-disable no-console */
import { ASCII_ART_FONT, NICKNAME, SOURCE_CODE_GITHUB_PAGE } from "@/constants";
import { isBrowser } from "@/lib/utils";

const fontFamily =
  'font-family: Poppins, PingFang SC, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";';

(() => {
  if (isBrowser()) {
    // 放到这里执行，保证只输出一次
    console.log(ASCII_ART_FONT);
    console.log(
      `%c作者：${NICKNAME}`,
      `color: #999; font-size: 1rem;${fontFamily}`,
    );
    console.log(
      `%c网站源码 Github：${SOURCE_CODE_GITHUB_PAGE}`,
      `color: #999; font-size: 1rem;${fontFamily}`,
    );
  }
})();

/**
 * 在浏览器控制台输出一些自定义信息，注意必须使用 client 组件，因为是要运行在浏览器上的
 * 如果是 rsc 组件，则会输出在命令行里面
 * @returns
 */
export const Console = () => {
  return null;
};
