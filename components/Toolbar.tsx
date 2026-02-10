"use client";

import Image from "next/image";
import { useState } from "react";
import { Toast } from "@/components/Toast";

export type ToolbarMode = "cursor" | "pen" | "typo";

export interface ToolbarProps {
  /** 현재 선택된 도구 */
  value?: ToolbarMode;
  /** 도구 선택 시 호출 */
  onChange?: (mode: ToolbarMode) => void;
  className?: string;
}

const BOTTOM_TOOLS: { mode: ToolbarMode; src: string; alt: string }[] = [
  { mode: "cursor", src: "/icons/Cursor.svg", alt: "커서" },
  { mode: "pen", src: "/icons/Write.svg", alt: "펜" },
  { mode: "typo", src: "/icons/Typo.svg", alt: "텍스트" }
];

export function BottomToolbar({ value, onChange, className = "" }: ToolbarProps) {
  const [toastVisible, setToastVisible] = useState(false);

  const handleClick = (mode: ToolbarMode) => {
    onChange?.(mode);
    setToastVisible(true);
  };

  return (
    <>
      <ul
        role="toolbar"
        aria-label="도구"
        className={
          "inline-flex items-center rounded-xl bg-[#F3F3F3] border border-[#e8e8e8] shadow-xs px-1 py-0.5 gap-0 " +
          className
        }
      >
        {BOTTOM_TOOLS.map((tool, index) => (
          <li key={tool.mode} className="contents">
            {index > 0 && <span className="w-px h-4 bg-[#e0e0e0] shrink-0" aria-hidden />}
            <button
              type="button"
              onClick={() => handleClick(tool.mode)}
              aria-pressed={value === tool.mode}
              aria-label={tool.alt}
              className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-white/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[#999] data-[active]:bg-white data-[active]:shadow-sm"
              data-active={value === tool.mode || undefined}
            >
              <Image src={tool.src} alt="" width={20} height={20} className="opacity-90" />
            </button>
          </li>
        ))}
      </ul>

      {toastVisible && <Toast duration={1500} onClose={() => setToastVisible(false)} />}
    </>
  );
}

export type TextAlign = "left" | "center" | "right";
export type TextStyle = "bold" | "underline" | "strikethrough";

export interface TopToolbarProps {
  /** 현재 선택된 정렬 */
  align?: TextAlign;
  /** 정렬 변경 시 호출 */
  onAlignChange?: (align: TextAlign) => void;
  /** 현재 활성화된 스타일들 */
  activeStyles?: TextStyle[];
  /** 스타일 토글 시 호출 */
  onStyleToggle?: (style: TextStyle) => void;
  className?: string;
}

export function TopToolbar({
  align,
  onAlignChange,
  activeStyles = [],
  onStyleToggle,
  className = ""
}: TopToolbarProps) {
  const [toastVisible, setToastVisible] = useState(false);

  const showToast = () => {
    setToastVisible(true);
  };

  return (
    <>
      <div
        role="toolbar"
        aria-label="텍스트 서식 도구"
        className={
          "inline-flex items-center gap-2 bg-[#F3F3F3] rounded-xl shadow-sm px-2 py-1.5 " +
          className
        }
      >
        {/* 폰트명 드롭다운 (더미) */}
        <button
          type="button"
          className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-white   text-sm text-black hover:bg-gray-50 transition-colors"
          onClick={showToast}
        >
          <span>프리텐다드</span>
          <Image src="/icons/Down.svg" alt="" width={12} height={12} className="opacity-60" />
        </button>

        {/* 폰트 크기 드롭다운 (더미) */}
        <button
          type="button"
          className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-white  text-sm text-black hover:bg-gray-50 transition-colors"
          onClick={showToast}
        >
          <span>11</span>
          <Image src="/icons/Down.svg" alt="" width={12} height={12} className="opacity-60" />
        </button>

        {/* 구분선 */}
        <span className="w-px h-6 bg-gray-200 shrink-0" aria-hidden />

        {/* 텍스트 정렬 버튼 그룹 */}
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => {
              onAlignChange?.("left");
              showToast();
            }}
            aria-pressed={align === "left"}
            aria-label="왼쪽 정렬"
            className="flex items-center justify-center w-8 h-8 rounded hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[#999] data-[active]:bg-gray-100"
            data-active={align === "left" || undefined}
          >
            <Image
              src="/icons/AlignLeftLine.svg"
              alt=""
              width={20}
              height={20}
              className="opacity-90"
            />
          </button>
          <button
            type="button"
            onClick={() => {
              onAlignChange?.("center");
              showToast();
            }}
            aria-pressed={align === "center"}
            aria-label="가운데 정렬"
            className="flex items-center justify-center w-8 h-8 rounded hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[#999] data-[active]:bg-gray-100"
            data-active={align === "center" || undefined}
          >
            <Image
              src="/icons/AlignCenterLine.svg"
              alt=""
              width={20}
              height={20}
              className="opacity-90"
            />
          </button>
          <button
            type="button"
            onClick={() => {
              onAlignChange?.("right");
              showToast();
            }}
            aria-pressed={align === "right"}
            aria-label="오른쪽 정렬"
            className="flex items-center justify-center w-8 h-8 rounded hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[#999] data-[active]:bg-gray-100"
            data-active={align === "right" || undefined}
          >
            <Image
              src="/icons/AlignRightLine.svg"
              alt=""
              width={20}
              height={20}
              className="opacity-90"
            />
          </button>
        </div>

        {/* 구분선 */}
        <span className="w-px h-6 bg-gray-200 shrink-0" aria-hidden />

        {/* 텍스트 스타일 버튼 그룹 */}
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => {
              onStyleToggle?.("bold");
              showToast();
            }}
            aria-pressed={activeStyles.includes("bold")}
            aria-label="굵게"
            className="flex items-center justify-center w-8 h-8 rounded hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[#999] data-[active]:bg-gray-100"
            data-active={activeStyles.includes("bold") || undefined}
          >
            <Image src="/icons/Bold.svg" alt="" width={20} height={20} className="opacity-90" />
          </button>
          <button
            type="button"
            onClick={() => {
              onStyleToggle?.("underline");
              showToast();
            }}
            aria-pressed={activeStyles.includes("underline")}
            aria-label="밑줄"
            className="flex items-center justify-center w-8 h-8 rounded hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[#999] data-[active]:bg-gray-100"
            data-active={activeStyles.includes("underline") || undefined}
          >
            <Image
              src="/icons/UnderLine.svg"
              alt=""
              width={20}
              height={20}
              className="opacity-90"
            />
          </button>
          <button
            type="button"
            onClick={() => {
              onStyleToggle?.("strikethrough");
              showToast();
            }}
            aria-pressed={activeStyles.includes("strikethrough")}
            aria-label="취소선"
            className="flex items-center justify-center w-8 h-8 rounded hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[#999] data-[active]:bg-gray-100 font-medium text-sm"
            data-active={activeStyles.includes("strikethrough") || undefined}
          >
            <Image
              src="/icons/CenterLine.svg"
              alt=""
              width={20}
              height={20}
              className="opacity-90"
            />
          </button>
        </div>
      </div>

      {toastVisible && <Toast duration={1500} onClose={() => setToastVisible(false)} />}
    </>
  );
}
