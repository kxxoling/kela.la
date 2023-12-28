import { fetchRetry } from "./fetch-retry";

type RegionType = "prod_official_asia" | string;

export type Numeric = `${number}`;

type Lang = string;

export type WarpRecord = {
  uid: Numeric;
  gacha_id: Numeric;
  gacha_type: string;
  item_id: Numeric;
  count: Numeric;
  time: string;
  name: string;
  lang: Lang;
  item_type: string;
  rank_type: Numeric;
  id: Numeric;
};

type RetCode = 0 | -502 | -110 | number;

export type WarpResp = {
  retcode: RetCode;
  message: string;
  data: {
    page: string;
    size: string;
    list?: WarpRecord[];
    region: RegionType;
  };
};

export type GachaType = "11" | "12" | "1" | "2"; //
export const GACHA_TYPES = [
  ["11", "角色活动跃迁"],
  ["12", "光锥活动跃迁"],
  ["1", "常驻跃迁"],
  ["2", "新手跃迁"],
] as const;

export const clientGetWarpHistory = async (url: URL): Promise<WarpResp> => {
  const hsrParams = url.searchParams;
  const params = new URLSearchParams(hsrParams.toString());
  params.set("_api", url.origin + url.pathname);

  try {
    const resp = await fetchRetry("/api/warp?" + params.toString(), {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        Accept: "application/json",
      },
      cache: "force-cache",
    });
    const json: WarpResp = await resp.json();
    if (json.retcode !== 0) {
      throw new Error(`HSR API error ${json.retcode}: ${json.message}`, {
        cause: json,
      });
    }
    return json;
  } catch (err) {
    throw new Error(`HSR API JSON parse error`, { cause: err });
  }
};

export const getGachaWarpHistory = async ({
  type,
  href,
  end_id = "0",
}: {
  type: GachaType;
  href: string;
  end_id?: string;
}): Promise<WarpResp> => {
  // href: https://api-os-takumi.mihoyo.com/common/gacha_record/api/getGachaLog?authkey_ver=1&sign_type=2&lang=zh-cn&authkey=A-LONG-AUTH-KEY&game_biz=hkrpg_global
  const url = new URL(href);

  url.searchParams.set("gacha_type", type);
  url.searchParams.set("size", "20");
  url.searchParams.set("page", "1");
  if (end_id !== "0") {
    url.searchParams.set("end_id", end_id);
  }

  return await clientGetWarpHistory(url);
};

export const serverGetWarpHistory = async (
  searchParams: URLSearchParams
): Promise<WarpResp> => {
  const api = searchParams.get("_api");
  searchParams.delete("_href");
  const url = new URL(api + "?" + searchParams.toString());

  console.debug("serverGetWarpHistory", url.toString());
  const resp = await fetchRetry(url.toString(), {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Accept: "application/json",
      referrer: api!,
    },
  });

  try {
    const json: WarpResp = await resp.json();
    return json;
  } catch (err) {
    throw new Error("HSR API JSON parse error", { cause: err });
  }
};
