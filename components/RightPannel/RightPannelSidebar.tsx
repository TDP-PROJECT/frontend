import Image from "next/image";
import { Dispatch, SetStateAction } from "react";

type Props = {
  uiType: RightPannelUIType;
  setUiType: Dispatch<SetStateAction<RightPannelUIType>>;
  contentType: RightPannelContentType;
  chatList?: ChatContent[];
  roomId?: string;
  setRoomId: Dispatch<SetStateAction<string>>;
  sideContentType: RightPannelSideContentType;
  setSideContentType: Dispatch<SetStateAction<RightPannelSideContentType>>;
  memoList?: MemoContent[];
  memoIdx?: number | null;
  setMemoIdx: Dispatch<SetStateAction<number | null>>;
};

// 일단 더미데이터

const searchChatList: ChatContent[] = [
  {
    roomId: "1",
    createDate: "2026-02-05T13:06:12.107Z",
    messages: [
      { type: "REQUEST", message: "지금 하이라이트된 부품이 엔진 전체에서 정확히 어떤 역할을 해?" }
    ]
  }
];

const searchMemoList: MemoContent[] = [
  {
    idx: 1,
    memo: "2026-02-05T13:06:12.107Z"
  },
  {
    idx: 2,
    memo: "2026-02-05T13:06:12.107Z"
  }
];

// 사이드 버튼들 /  기록, 검색
export default function RightPannelSidebar({
  uiType,
  setUiType,
  sideContentType,
  setSideContentType,
  contentType, //UI 관련
  chatList,
  roomId,
  setRoomId,
  memoList,
  memoIdx,
  setMemoIdx //데이터 관련
}: Props) {
  const onClickSideBarBtn = () => {
    setUiType(uiType === "full" ? "expanded" : "full");
    if (uiType == "full" && sideContentType === "search") {
      setSideContentType("history");
    }
  };

  const onClickAddBtn = () => {
    setUiType((prev) => (prev === "default" ? "expanded" : prev));
    // ai
    if (contentType === "AI 어시스턴스" && roomId !== "") {
      setRoomId("");
      document.getElementById("aiChatInput")?.focus();
    }
    // 메모면 메모장 창 열기

    //  걍똑같을듯한
    if (uiType !== "default") {
      //  ai 어시스턴트 + 기존 컨텍스트가 있다면 (그거까지 저장하고.?) =>  새로운 컨텍스트 열기
      // 메모 + 쓰고있는 메모가 있다면 (그거까지 저장하고.?) => 새로운 메모 열기
    }
  };

  const onClickSearchBtn = () => {
    setSideContentType("search");
    setUiType((prev) => (prev !== "full" ? "full" : prev));
  };

  const onClickXBtn = () => {
    setSideContentType("history");
    // 검색어 다 지우기
  };

  return (
    <div
      className={`${uiType === "full" ? "w-[176px]" : "w-[55px]"}  flex flex-col gap-[24px] transition-all duration-300 h-full bg-white border-r border-gray-200`}
    >
      <button role="button" onClick={onClickSideBarBtn} className="px-2">
        <Image src={"/icons/SideBar.svg"} alt="사이드바" width={24} height={24} />
      </button>
      <button role="button" onClick={onClickAddBtn} className="px-2">
        <Image
          src={`/icons/${contentType == "AI 어시스턴스" ? "+" : "Write"}.svg`}
          alt="새로운 글 작성"
          width={24}
          height={24}
        />
      </button>

      {sideContentType == "history" ? (
        <button role="button" onClick={onClickSearchBtn} className="px-2">
          <Image src={"/icons/Search.svg"} alt="검색" width={24} height={24} />
        </button>
      ) : (
        <div className="relative flex items-center justify-between bg-gray-200 rounded-lg px-3 py-2 w-[160px]">
          <input
            id="searchInput"
            type="text"
            placeholder="검색하세요"
            className="text-blue-400 placeholder:text-gray-400 font-[16px] bg-transparent outline-none w-[114px]"
            autoFocus
          />
          <Image
            src={"/icons/X.svg"}
            className="text-gray-500  cursor-pointer"
            onClick={onClickXBtn}
            width={24}
            height={24}
            alt="삭제"
          />
        </div>
      )}

      {uiType == "full" && (
        <ul className="overflow-y-auto max-h-[calc(100vh-200px)] ">
          {contentType == "AI 어시스턴스" &&
            (sideContentType === "history" ? chatList : searchChatList)?.map((item) => (
              <li
                key={item.roomId}
                onClick={() => setRoomId(item.roomId)}
                className={`cursor-pointer ${roomId === item.roomId ? "bg-gray-100" : ""} px-2.5 leading-[38px] mr-4 rounded-lg hover:bg-gray-50`}
              >
                <p className="max-w-[155px] truncate">{item.messages?.[0]?.message}</p>
              </li>
            ))}

          {contentType == "메모장" &&
            (sideContentType === "history" ? memoList : searchMemoList)?.map((item) => (
              <li
                key={item.idx}
                onClick={() => setMemoIdx(item.idx)}
                className={`cursor-pointer ${memoIdx === item.idx ? "bg-gray-100" : ""} px-2.5 leading-[38px] mr-4 rounded-lg hover:bg-gray-50`}
              >
                <p className="max-w-[155px] truncate">{item.memo}</p>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
