"use client";

import {
  type CSSProperties,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import Image from "next/image";

import * as Dialog from "@radix-ui/react-dialog";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Expand,
  Link2,
  Search,
  Shuffle,
  X,
} from "lucide-react";

import {
  type CategoryId,
  type ElementData,
  categories,
  elements,
  getElement,
} from "./elements";
import s from "./periodic-table.module.css";
import { exhibitPositions, getPosition, specimenStyle } from "./positions";

const phaseNames = {
  solid: "固态",
  liquid: "液态",
  gas: "气态",
  unknown: "尚不确定",
};
const artwork = "/images/periodic-table/element-wall.jpg";

function categoryFor(element: ElementData) {
  return categories.find((category) => category.id === element.categoryId);
}

function Specimen({
  element,
  large = false,
}: {
  element: ElementData;
  large?: boolean;
}) {
  if (element.number === 11 && large) {
    return (
      <Image
        className={s.sodiumImage}
        src="/images/periodic-table/sodium-specimen.png"
        alt="银白色钠标本的透明玻璃展盒艺术示意"
        width={1254}
        height={1254}
        sizes="(max-width: 600px) 215px, 480px"
        loading="eager"
      />
    );
  }
  return (
    <div
      className={s.specimen}
      style={specimenStyle(getPosition(element.number))}
      role="img"
      aria-label={`${element.name}的玻璃展盒艺术示意`}
    />
  );
}

export function PeriodicTable() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryId | "all">("all");
  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState<ElementData | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(10);
  const [zoomed, setZoomed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [tab, setTab] = useState<"story" | "properties">("story");
  const [visited, setVisited] = useState<number[]>([]);
  const lastTrigger = useRef<HTMLElement | null>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const ownsHistoryEntry = useRef(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchQuery = query.trim().toLowerCase();
  const exactMatch = searchQuery
    ? elements.find((element) =>
        [
          element.symbol.toLowerCase(),
          element.name,
          String(element.number),
        ].includes(searchQuery),
      )
    : undefined;
  const filtered = elements.filter(
    (element) =>
      (category === "all" || element.categoryId === category) &&
      (!searchQuery ||
        (exactMatch
          ? element.number === exactMatch.number
          : [
              element.name,
              element.englishName,
              element.symbol,
              String(element.number),
            ].some((value) => value.toLowerCase().includes(searchQuery)))),
  );
  const matches = new Set(filtered.map((element) => element.number));
  const filtering = Boolean(searchQuery || category !== "all");
  const hoverPosition =
    hovered === null ? undefined : exhibitPositions[hovered];
  const hoverElement = hoverPosition
    ? getElement(hoverPosition.number)
    : undefined;
  const selectedCategory = selected ? categoryFor(selected) : undefined;

  useEffect(() => {
    const syncFromUrl = () => {
      let symbol = "";
      try {
        symbol = decodeURIComponent(window.location.hash.slice(1));
      } catch {
        /* Ignore malformed links. */
      }
      const element = elements.find(
        (item) => item.symbol.toLowerCase() === symbol.toLowerCase(),
      );
      setSelected(element ?? null);
      setHovered(null);
      setTab("story");
      if (element)
        setVisited((previous) =>
          previous.includes(element.number)
            ? previous
            : [...previous, element.number],
        );
    };
    syncFromUrl();
    window.addEventListener("popstate", syncFromUrl);
    window.addEventListener("hashchange", syncFromUrl);
    return () => {
      window.removeEventListener("popstate", syncFromUrl);
      window.removeEventListener("hashchange", syncFromUrl);
      if (copyTimer.current) clearTimeout(copyTimer.current);
    };
  }, []);

  function openElement(element: ElementData, trigger?: HTMLElement) {
    if (trigger) lastTrigger.current = trigger;
    const url = new URL(window.location.href);
    url.hash = element.symbol;
    if (selected) window.history.replaceState(null, "", url);
    else {
      window.history.pushState(null, "", url);
      ownsHistoryEntry.current = true;
    }
    setSelected(element);
    setHovered(null);
    setCopied(false);
    setCopyError(false);
    setTab("story");
    setVisited((previous) =>
      previous.includes(element.number)
        ? previous
        : [...previous, element.number],
    );
  }

  function closeElement() {
    setSelected(null);
    setHovered(null);
    if (ownsHistoryEntry.current) {
      ownsHistoryEntry.current = false;
      window.history.back();
    } else {
      const url = new URL(window.location.href);
      url.hash = "";
      window.history.replaceState(null, "", url);
    }
  }

  function resetFilters() {
    setQuery("");
    setCategory("all");
    setHovered(null);
  }

  function navigateGrid(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    if (
      ![
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End",
      ].includes(event.key)
    )
      return;
    event.preventDefault();
    const current = exhibitPositions[index]!;
    const available = exhibitPositions
      .map((position, i) => ({ ...position, index: i }))
      .filter((position) => matches.has(position.number));
    let next: (typeof available)[number] | undefined;
    if (event.key === "Home") next = available[0];
    else if (event.key === "End") next = available.at(-1);
    else if (event.key === "ArrowLeft")
      next = available.filter((position) => position.index < index).at(-1);
    else if (event.key === "ArrowRight")
      next = available.find((position) => position.index > index);
    else {
      const direction = event.key === "ArrowUp" ? -1 : 1;
      next = available
        .filter((position) => (position.y - current.y) * direction > 0)
        .sort(
          (a, b) =>
            Math.abs(a.y - current.y) - Math.abs(b.y - current.y) ||
            Math.abs(a.x - current.x) - Math.abs(b.x - current.x),
        )[0];
    }
    if (next) {
      setFocusedIndex(next.index);
      buttonRefs.current[next.index]?.focus({ preventScroll: true });
      buttonRefs.current[next.index]?.scrollIntoView({
        block: "nearest",
        inline: "nearest",
        behavior: "auto",
      });
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setCopyError(false);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopyError(true);
    }
  }

  const keyboardIndex =
    exhibitPositions[focusedIndex] &&
    matches.has(exhibitPositions[focusedIndex].number)
      ? focusedIndex
      : exhibitPositions.findIndex((position) => matches.has(position.number));

  return (
    <div className={s.root}>
      <div className={s.header}>
        <span className={s.brand}>THE ELEMENT GALLERY</span>
        <span className={s.headerNote}>元素展览 / 118 种元素的微型宇宙</span>
      </div>

      <div>
        <h1 className={s.srOnly}>
          元素周期表 · The Periodic Table of the Elements
        </h1>
        <section
          className={`${s.exhibition} ${zoomed ? s.exhibitionZoomed : ""}`}
          aria-label="118 种元素的互动玻璃展墙"
        >
          <div className={s.explorer}>
            <p className={s.eyebrow}>LOOK CLOSER. DISCOVER MORE.</p>
            <p className={s.explorerIntro}>每一种元素，都藏着一个宇宙。</p>
            <div className={s.searchRow}>
              <form
                className={s.search}
                onSubmit={(event) => {
                  event.preventDefault();
                  if (filtered[0])
                    openElement(
                      filtered[0],
                      event.currentTarget.querySelector("input") ?? undefined,
                    );
                }}
              >
                <Search size={17} strokeWidth={1.5} aria-hidden="true" />
                <input
                  aria-label="搜索元素"
                  placeholder="搜索名称、符号或原子序数"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setHovered(null);
                  }}
                />
                {query ? (
                  <button
                    type="button"
                    aria-label="清空搜索"
                    onClick={() => setQuery("")}
                  >
                    <X size={14} />
                  </button>
                ) : (
                  <kbd>↵</kbd>
                )}
              </form>
              <button
                className={s.randomButton}
                disabled={!filtered.length}
                onClick={(event) => {
                  const element =
                    filtered[Math.floor(Math.random() * filtered.length)];
                  if (element) openElement(element, event.currentTarget);
                }}
              >
                <Shuffle size={15} strokeWidth={1.5} />
                <span>偶遇一个元素</span>
              </button>
            </div>
            <div className={s.explorerMeta}>
              <span aria-live="polite">
                {filtering
                  ? `找到 ${filtered.length} 种元素`
                  : "118 种元素 · 无限种可能"}
              </span>
              {filtering ? (
                <button onClick={resetFilters}>
                  重置筛选 <X size={11} />
                </button>
              ) : (
                <>
                  <span className={s.desktopHint}>悬停观察 · 点击探索</span>
                  <span className={s.mobileHint}>左右滑动 · 点击探索</span>
                </>
              )}
            </div>
          </div>

          <div
            ref={scrollerRef}
            className={s.wallScroll}
            tabIndex={0}
            aria-label="元素展墙，可横向滚动"
            onScroll={() => setHovered(null)}
          >
            <div className={`${s.wall} ${zoomed ? s.wallZoomed : ""}`}>
              <img
                src={artwork}
                alt="白色展墙上的完整元素周期表，每个透明玻璃盒中陈列着元素的艺术标本"
                width={1536}
                height={1024}
                className={s.wallImage}
                fetchPriority="high"
                draggable={false}
              />
              <div
                className={s.hotspots}
                aria-label="元素标本，使用方向键浏览，回车打开详情"
              >
                {exhibitPositions.map((position, index) => {
                  const element = getElement(position.number);
                  if (!element) return null;
                  const matched = matches.has(position.number);
                  const isHovered = index === hovered;
                  return (
                    <button
                      key={`${position.number}-${index}`}
                      ref={(node) => {
                        buttonRefs.current[index] = node;
                      }}
                      type="button"
                      data-element={element.symbol}
                      aria-label={`${element.number} ${element.symbol} ${element.name}，查看元素详情`}
                      aria-describedby={
                        isHovered ? "element-hover-preview" : undefined
                      }
                      tabIndex={index === keyboardIndex ? 0 : -1}
                      disabled={!matched}
                      className={`${s.element} ${!matched ? s.dimmed : ""} ${filtering && matched ? s.matched : ""} ${isHovered ? s.hovered : ""}`}
                      style={{
                        left: `${(position.x / 1536) * 100}%`,
                        top: `${(position.y / 1024) * 100}%`,
                        width: `${(position.width / 1536) * 100}%`,
                        height: `${(position.height / 1024) * 100}%`,
                        ...(isHovered ? specimenStyle(position) : {}),
                      }}
                      onPointerEnter={(event) => {
                        if (event.pointerType === "mouse" && !selected)
                          setHovered(index);
                      }}
                      onPointerLeave={() => setHovered(null)}
                      onFocus={() => {
                        setFocusedIndex(index);
                        if (!selected) setHovered(index);
                      }}
                      onBlur={() => setHovered(null)}
                      onKeyDown={(event) => navigateGrid(event, index)}
                      onClick={(event) =>
                        openElement(element, event.currentTarget)
                      }
                    />
                  );
                })}
              </div>
              {hoverElement && hoverPosition && (
                <div
                  id="element-hover-preview"
                  role="tooltip"
                  className={s.hoverCard}
                  style={{
                    left: `${((hoverPosition.x > 1130 ? hoverPosition.x - 265 : hoverPosition.x + hoverPosition.width + 22) / 1536) * 100}%`,
                    top: `${(Math.min(hoverPosition.y, 785) / 1024) * 100}%`,
                  }}
                >
                  <div className={s.hoverHeading}>
                    <strong>{hoverElement.symbol}</strong>
                    <span>
                      {hoverElement.name}
                      <small>{hoverElement.englishName}</small>
                    </span>
                    <span className={s.hoverNumber}>
                      {String(hoverElement.number).padStart(3, "0")}
                    </span>
                  </div>
                  <p>{hoverElement.summary}</p>
                  <div className={s.hoverFooter}>
                    <span>
                      {categoryFor(hoverElement)?.name} ·{" "}
                      {phaseNames[hoverElement.phase]}
                    </span>
                    <span>
                      点击探索 <ArrowUpRight size={12} />
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className={s.viewBar}>
            <span className={s.viewHint}>
              <span className={s.desktopHint}>
                将光标移向标本，发现元素的故事
              </span>
              <span className={s.mobileHint}>
                左右滑动展墙 · 轻触标本查看详情
              </span>
            </span>
            <button
              className={s.zoomButton}
              aria-pressed={zoomed}
              onClick={() => {
                setZoomed(!zoomed);
                setHovered(null);
              }}
            >
              <Expand size={14} strokeWidth={1.5} />
              {zoomed ? "还原展墙" : "放大展墙"}
            </button>
          </div>
        </section>

        <section className={s.collection} aria-label="按元素类别筛选">
          <div className={s.collectionHeading}>
            <div>
              <p className={s.eyebrow}>A FAMILY OF ELEMENTS</p>
              <h2>万物，皆有联系。</h2>
            </div>
            <p>
              从氢到鿫，从星尘到你我。
              <br />
              选择一个家族，观察它们在周期表中的位置。
            </p>
          </div>
          <div className={s.categories}>
            <button
              className={`${s.category} ${category === "all" ? s.categoryActive : ""}`}
              aria-pressed={category === "all"}
              onClick={() => {
                setCategory("all");
                setHovered(null);
              }}
            >
              全部元素 <span>118</span>
            </button>
            {categories.map((item) => (
              <button
                key={item.id}
                className={`${s.category} ${category === item.id ? s.categoryActive : ""}`}
                style={{ "--category-color": item.color } as CSSProperties}
                aria-pressed={category === item.id}
                onClick={() => {
                  setCategory(category === item.id ? "all" : item.id);
                  setHovered(null);
                }}
              >
                <span className={s.categoryDot} />
                {item.name}
              </button>
            ))}
          </div>
          {filtering && (
            <div className={s.results} aria-live="polite">
              {filtered.length ? (
                filtered.map((element) => (
                  <button
                    key={element.number}
                    onClick={(event) =>
                      openElement(element, event.currentTarget)
                    }
                  >
                    <span>{element.symbol}</span>
                    {element.name}
                    <ArrowUpRight size={12} />
                  </button>
                ))
              ) : (
                <div className={s.emptyState}>
                  <Search size={20} strokeWidth={1.5} />
                  <p>没有找到符合条件的元素</p>
                  <span>试试「钠」「Na」或「11」，也可以清除当前分类。</span>
                  <button onClick={resetFilters}>
                    显示全部元素 <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      <footer className={s.footer}>
        <span>JIACH / AN INTERACTIVE EXHIBITION</span>
        <span>已探索 {visited.length} / 118</span>
        <p>标本为艺术示意；元素性质与故事以科学资料为准。</p>
      </footer>

      <Dialog.Root
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) closeElement();
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className={s.overlay} />
          <Dialog.Content
            className={s.dialog}
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              lastTrigger.current?.focus({ preventScroll: true });
            }}
          >
            {selected && (
              <>
                <div className={s.detailTop}>
                  <span>
                    THE ELEMENT GALLERY{" "}
                    <span className={s.detailTopDivider}>/</span> SPECIMEN{" "}
                    {String(selected.number).padStart(3, "0")}
                  </span>
                  <Dialog.Close
                    className={s.iconButton}
                    aria-label="关闭元素详情"
                  >
                    <X size={19} strokeWidth={1.5} />
                  </Dialog.Close>
                </div>
                <div className={s.detailBody}>
                  <div className={s.detailVisual}>
                    <div
                      className={`${s.specimenStage} ${selected.number !== 11 ? s.referenceSpecimen : ""}`}
                    >
                      <Specimen element={selected} large />
                    </div>
                    <div className={s.specimenCaption}>
                      <span>
                        NO. {String(selected.number).padStart(3, "0")}
                      </span>
                      <span>{selected.englishName.toUpperCase()}</span>
                      <span>元素标本 · 艺术示意</span>
                    </div>
                    <p className={s.visualNote}>
                      {selected.number >= 104
                        ? "此元素仅能以极少量原子人工合成，图中展品是想象性的视觉表达。"
                        : "以光、玻璃与物质，收藏一个微小的宇宙。"}
                    </p>
                  </div>
                  <div className={s.detailInfo}>
                    <div
                      className={s.detailTag}
                      style={
                        {
                          "--category-color": selectedCategory?.color,
                        } as CSSProperties
                      }
                    >
                      <span className={s.categoryDot} />
                      {selectedCategory?.name}
                      <span>第 {selected.period} 周期</span>
                    </div>
                    <div className={s.detailTitle}>
                      <span className={s.bigSymbol}>{selected.symbol}</span>
                      <div>
                        <Dialog.Title className={s.chineseName}>
                          {selected.name}
                        </Dialog.Title>
                        <span className={s.englishName}>
                          {selected.englishName}
                        </span>
                      </div>
                    </div>
                    <Dialog.Description className={s.description}>
                      {selected.summary}
                    </Dialog.Description>
                    <dl className={s.facts}>
                      <div>
                        <dt>原子序数</dt>
                        <dd>{selected.number}</dd>
                      </div>
                      <div>
                        <dt>相对原子质量</dt>
                        <dd>{selected.atomicMass}</dd>
                      </div>
                      <div>
                        <dt>室温状态</dt>
                        <dd className={s.phase}>
                          {phaseNames[selected.phase]}
                        </dd>
                      </div>
                    </dl>
                    <div
                      className={s.tabs}
                      role="tablist"
                      aria-label="元素详情内容"
                    >
                      <button
                        id="story-tab"
                        role="tab"
                        aria-selected={tab === "story"}
                        aria-controls="story-panel"
                        tabIndex={tab === "story" ? 0 : -1}
                        onClick={() => setTab("story")}
                        onKeyDown={(event) => {
                          if (event.key === "ArrowRight") {
                            setTab("properties");
                            document.getElementById("properties-tab")?.focus();
                          }
                        }}
                      >
                        元素的故事
                      </button>
                      <button
                        id="properties-tab"
                        role="tab"
                        aria-selected={tab === "properties"}
                        aria-controls="properties-panel"
                        tabIndex={tab === "properties" ? 0 : -1}
                        onClick={() => setTab("properties")}
                        onKeyDown={(event) => {
                          if (event.key === "ArrowLeft") {
                            setTab("story");
                            document.getElementById("story-tab")?.focus();
                          }
                        }}
                      >
                        元素档案
                      </button>
                    </div>
                    {tab === "story" ? (
                      <div
                        id="story-panel"
                        role="tabpanel"
                        aria-labelledby="story-tab"
                        className={s.story}
                        tabIndex={0}
                      >
                        <h3>发现的起点</h3>
                        <p>{selected.discovery}</p>
                        <h3>它，与我们的生活</h3>
                        <ul>
                          {selected.uses.map((use) => (
                            <li key={use}>{use}</li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div
                        id="properties-panel"
                        role="tabpanel"
                        aria-labelledby="properties-tab"
                        className={s.properties}
                        tabIndex={0}
                      >
                        <dl>
                          <div>
                            <dt>化学符号</dt>
                            <dd>{selected.symbol}</dd>
                          </div>
                          <div>
                            <dt>元素家族</dt>
                            <dd>{selectedCategory?.name}</dd>
                          </div>
                          <div>
                            <dt>周期 / 族</dt>
                            <dd>
                              第 {selected.period} 周期 /{" "}
                              {selected.group
                                ? `第 ${selected.group} 族`
                                : "f 区元素"}
                            </dd>
                          </div>
                          {selected.shells && (
                            <div>
                              <dt>电子层排布</dt>
                              <dd>{selected.shells.join(" · ")}</dd>
                            </div>
                          )}
                          <div>
                            <dt>原子质量</dt>
                            <dd>{selected.atomicMass}</dd>
                          </div>
                        </dl>
                        <p>
                          室温状态按约 20°C
                          描述。方括号内为代表性同位素的质量数，不是标准原子量。
                        </p>
                      </div>
                    )}
                    <a
                      className={s.sourceLink}
                      href={selected.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      在 Royal Society of Chemistry 继续探索{" "}
                      <ArrowUpRight size={13} />
                    </a>
                  </div>
                </div>
                <div className={s.detailBottom}>
                  <div className={s.detailNavigation}>
                    <button
                      className={s.iconButton}
                      aria-label="上一个元素"
                      disabled={selected.number === 1}
                      onClick={() => {
                        const element = getElement(selected.number - 1);
                        if (element) openElement(element);
                      }}
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <span>
                      {String(selected.number).padStart(3, "0")}{" "}
                      <span>/ 118</span>
                    </span>
                    <button
                      className={s.iconButton}
                      aria-label="下一个元素"
                      disabled={selected.number === 118}
                      onClick={() => {
                        const element = getElement(selected.number + 1);
                        if (element) openElement(element);
                      }}
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                  <span className={s.copyStatus} role="status">
                    {copyError ? "请复制地址栏中的链接" : ""}
                  </span>
                  <button className={s.copyButton} onClick={copyLink}>
                    {copied ? <Check size={14} /> : <Link2 size={14} />}
                    {copied ? "链接已复制" : "分享这个元素"}
                  </button>
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
