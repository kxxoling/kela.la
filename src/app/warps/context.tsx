import React, { createContext, useContext, useState, useCallback } from "react";

import type { GachaType, WarpRecord, Numeric } from "@/utils/warp-api";
import { GACHA_TYPES, getGachaWarpHistory } from "@/utils/warp-api";
import { sleep } from "@/utils/fetch-retry";

type WarpData = {
  [_: string]: WarpRecord[];
} | null;

type WarpContext = {
  data: WarpData
  state: null | string
  isLoading: boolean

  setData: React.Dispatch<React.SetStateAction<WarpData>>;
  pushGachaWarpHistory: (t: GachaType, h: WarpRecord[]) => void;
  getAllGachaWarpHistory: (href: string) => void;
};

type WarpContextProviderProps = {
  children: React.ReactNode;
};

const defaultValue: WarpData = null;

const WarpContext = createContext<WarpContext | null>(null);

export function WarpContextProvider({ children }: WarpContextProviderProps) {
  const [warpData, setWarpData] = useState<WarpData>(defaultValue);
  const [state, setState] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState(false);

  const pushGachaWarpHistory = useCallback((type: GachaType, warpHistory: WarpRecord[]) => {
    const currentHistory = warpData?.[type] ?? [];
    const lastWarp = currentHistory.at(-1);
    const firstWarp = warpHistory.at(0);
    const newWarpHistory = lastWarp?.id === firstWarp?.id ? currentHistory.concat(warpHistory.slice(1)) : currentHistory.concat(warpHistory);
    setWarpData(prev => ({ ...prev, [type]: newWarpHistory }));
  }, [warpData])

  const getAllGachaWarpHistory = useCallback(async (href: string) => {
    setIsLoading(true)
    try {
      for (const gacha of GACHA_TYPES) {
        const [type, gachaName] = gacha
        let page = 1

        const list: WarpRecord[] = []
        let end_id: Numeric | undefined = '0'
        while (end_id) {
          setState(`Fetching ${gachaName}, page ${page}`)

          const resp = await getGachaWarpHistory({ type, href, end_id })

          end_id = resp.data?.list?.at(-1)?.id

          if (resp.data?.list?.length) {
            const lastWarp = list.at(-1);
            const firstWarp = resp.data?.list?.at(0);
            if (lastWarp?.id === firstWarp?.id) {
              list.push(...resp.data?.list?.slice(1))
            } else {
              list.push(...resp.data?.list)
            }
          }

          page += 1
          if (end_id) {
            await sleep(500)
          }
        }

        setWarpData(prev => ({ ...prev, [type]: list }));
      }
      setState('Done!')
    } catch (err) {
      console.error(err)
      setState('Error!')
    } finally {
      setIsLoading(false)
    }
  }, [])


  return <WarpContext.Provider value={{
    data: warpData,
    state,
    isLoading,
    setData: setWarpData,
    pushGachaWarpHistory,
    getAllGachaWarpHistory
  }}>{children}</WarpContext.Provider>;
}

export function useWarpContext() {
  const context = useContext(WarpContext);
  if (!context) {
    throw new Error("useWarpContext must be used within a WarpProvider");
  }
  return context;
}
