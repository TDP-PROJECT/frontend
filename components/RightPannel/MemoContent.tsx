"use client";

import { Dispatch, SetStateAction, useRef, useState, useEffect } from "react";
import { makeMemo, updateMemo } from "@/lib/api/memo";
import { useSearchParams } from "next/navigation";

type Props = {
  uiType: RightPannelUIType;
  setUiType: Dispatch<SetStateAction<RightPannelUIType>>;
  memoIdx?: number | null;
  setMemoIdx: Dispatch<SetStateAction<number | null>>;
  selectedMemo?: MemoContent;
  setMemoList: Dispatch<SetStateAction<MemoContent[]>>;
};

const MIN_HEIGHT = 40;

export default function MemoContent({
  uiType,
  setUiType,
  memoIdx,
  setMemoIdx,
  selectedMemo,
  setMemoList
}: Props) {
  const userIdx =
    typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") ?? "{}")?.idx : "";

  const searchParams = useSearchParams();
  const modelIdx = searchParams.get("modelIdx") ? parseInt(searchParams.get("modelIdx")!) : 0;

  const [inputValue, setInputValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // selectedMemo가 변경되면 inputValue 업데이트
  useEffect(() => {
    if (selectedMemo) {
      setInputValue(selectedMemo.memo || "");
    } else {
      setInputValue("");
    }
  }, [selectedMemo]);

  // 입력 시작 시 패널 확장
  useEffect(() => {
    if (uiType !== "default") return;
    if (inputValue.trim().length > 0) {
      setUiType("expanded");
    }
  }, [inputValue, uiType, setUiType]);

  // textarea 높이 조정 (expanded일 때는 전체 높이)
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    if (uiType === "expanded") {
      ta.style.height = "100%";
    } else {
      ta.style.height = `${MIN_HEIGHT}px`;
    }
  }, [uiType]);

  // 디바운스된 저장 함수
  const saveMemoRef = useRef<((value: string) => Promise<void>) | null>(null);

  useEffect(() => {
    saveMemoRef.current = async (value: string) => {
      if (!value.trim() || !userIdx) return;

      try {
        if (memoIdx === null || memoIdx === undefined) {
          // 새 메모 생성
          const res = await makeMemo({
            userIdx: parseInt(userIdx),
            memo: value,
            modelIdx
          });
          setMemoIdx(res.idx);
          // memoList에 추가
          setMemoList((prev) => [{ idx: res.idx, memo: value }, ...prev]);
        } else {
          // 기존 메모 업데이트
          await updateMemo({
            userIdx: parseInt(userIdx),
            memo: value,
            modelIdx,
            memoIdx
          });
          // memoList 업데이트
          setMemoList((prev) =>
            prev.map((memo) => (memo.idx === memoIdx ? { ...memo, memo: value } : memo))
          );
        }
      } catch (error) {
        console.error("메모 저장 실패:", error);
      }
    };
  }, [memoIdx, userIdx, modelIdx, setMemoIdx, setMemoList]);

  // inputValue 변경 시 디바운스된 저장 실행 (ref는 effect/타이머 안에서만 접근)
  useEffect(() => {
    if (!inputValue.trim()) return;

    const timeoutId = setTimeout(() => {
      saveMemoRef.current?.(inputValue);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [inputValue]);

  return (
    <div
      className={`flex flex-col h-full min-h-0 ${uiType === "default" ? "justify-end" : "justify-start"}`}
    >
      <textarea
        ref={textareaRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="원하는 내용을 적어보세요."
        className={`w-full resize-none px-4 py-2 text-[15px] leading-6 placeholder:text-gray-400 outline-none ${
          uiType === "expanded" ? "flex-1 min-h-0" : ""
        }`}
        style={{ height: uiType === "expanded" ? "100%" : MIN_HEIGHT }}
      />
    </div>
  );
}
