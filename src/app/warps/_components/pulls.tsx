'use client'
import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Badge,
  Chip
} from "@nextui-org/react";

import { useWarpContext } from "../context";
import type { WarpRecord } from "@/utils/warp-api";

function findRareWarpsAndCount(rankType: '4' | '5', warps: WarpRecord[]): [WarpRecord, number][] {
  let curWarp: WarpRecord | null = null
  let curWarpDistance = 0
  const rareWarpsAndCounts: [WarpRecord, number][] = []

  for (const warp of warps) {
    if (warp.rank_type === rankType) {
      if (curWarp) {
        rareWarpsAndCounts.push([curWarp, curWarpDistance + 1])
      }
      curWarp = warp
      curWarpDistance = 0
    } else {
      curWarpDistance += 1
    }
  }

  if (curWarp) {
    rareWarpsAndCounts.push([curWarp, curWarpDistance])
  }
  return rareWarpsAndCounts
}

function formatPercent(num: number) {
  return `${(num * 100).toFixed(2)}%`
}
function formatFloat(num: number) {
  return `${num.toFixed(2)}`
}

type PullsTableProps = {
  type: '11' | '12' | '1' | '2'
}

function ItemBadge({ item, count }: { item: WarpRecord, count: number }) {
  const color = item.rank_type === '5' ? 'warning' : 'secondary'
  return <Badge className="bg-green-500" content={count}>
    <Chip color={color} className="">{item.name}</Chip>
  </Badge>
}

export function PullsTable({ type }: PullsTableProps) {
  const { data } = useWarpContext()
  if (!data) return null

  const warps = data[type]
  if (!warps) {
    return null
  }

  const rareWarpsAndCount = findRareWarpsAndCount('4', warps)
  const rareAverageDrawCount = rareWarpsAndCount.reduce((acc, [_, count]) => acc + count, 0) / rareWarpsAndCount.length
  const ssrWarpsAndCount = findRareWarpsAndCount('5', warps)
  const ssrAverageDrawCount = ssrWarpsAndCount.reduce((acc, [_, count]) => acc + count, 0) / ssrWarpsAndCount.length
  // const guaranteedRareCount = warps.findIndex(w => w.rank_type === '4')
  // const guaranteedSsrCount = warps.findIndex(w => w.rank_type === '5')
  const rareLightCoreCount = warps.filter(w => w.rank_type === '4' && w.item_type in ['光锥', 'Light Cone']).length
  const rareCharacterCount = warps.filter(w => w.rank_type === '4' && w.item_type in ['角色', 'Character']).length
  const rareCharacterAverageDrawCount = warps.filter(w => w.rank_type === '4' && (w.item_type in ['角色', 'Character'])).length
  const rareLightCoreAverageDrawCount = warps.filter(w => w.rank_type === '4' && (w.item_type in ['光锥', 'Light Cone'])).length

  const bottomContent = <>
    <div className="flex gap-2">
      {ssrWarpsAndCount.map(([warp, count]) => {
        return <ItemBadge key={warp.id} item={warp} count={count} />
      })}
    </div>
    <div className="flex gap-2 flex-wrap">
    {rareWarpsAndCount.map(([warp, count]) => {
      return <ItemBadge key={warp.id} item={warp} count={count} />
    })}
  </div>
  </>
  return <>
    <Table aria-label="warps table" bottomContent={
      bottomContent
    }>
      <TableHeader>
        <TableColumn>祈愿</TableColumn>
        <TableColumn>总计</TableColumn>
        <TableColumn>百分比</TableColumn>
        <TableColumn>出货均数</TableColumn>
      </TableHeader>
      <TableBody>
        <TableRow style={{ color: 'yellow' }}>
          <TableCell>5★</TableCell>
          <TableCell>{ssrWarpsAndCount.length}</TableCell>
          <TableCell>{formatPercent(ssrWarpsAndCount.length / (warps.length))}</TableCell>
          <TableCell>{formatFloat(ssrAverageDrawCount)}</TableCell>
        </TableRow>
        {/* <TableRow style={{ color: 'yellow' }}>
          <TableCell>└ 小保底没歪</TableCell>
          <TableCell>333</TableCell>
          <TableCell>23%</TableCell>
          <TableCell>{''}</TableCell>
        </TableRow> */}
        <TableRow style={{ color: 'purple' }}>
          <TableCell>4★</TableCell>
          <TableCell>{rareWarpsAndCount.length}</TableCell>
          <TableCell>{formatPercent(rareWarpsAndCount.length / (warps.length))}</TableCell>
          <TableCell>{formatFloat(rareAverageDrawCount)}</TableCell>
        </TableRow>
        <TableRow style={{ color: 'purple' }}>
          <TableCell>└ 角色</TableCell>
          <TableCell>{rareCharacterCount}</TableCell>
          <TableCell>{formatPercent(rareCharacterCount / warps.length)}</TableCell>
          <TableCell>{formatFloat(rareCharacterAverageDrawCount)}</TableCell>
        </TableRow>
        <TableRow style={{ color: 'purple' }}>
          <TableCell>└ 光锥</TableCell>
          <TableCell>{rareLightCoreCount}</TableCell>
          <TableCell>{formatPercent(rareLightCoreCount / warps.length)}</TableCell>
          <TableCell>{formatFloat(rareLightCoreAverageDrawCount)}</TableCell>
        </TableRow>
        {/* <TableRow style={{ color: 'purple' }}>
          <TableCell>└ 小保底没歪</TableCell>
          <TableCell>164</TableCell>
          <TableCell>13.23%</TableCell>
          <TableCell>{''}</TableCell>
        </TableRow> */}
      </TableBody>
    </Table>
  </>
}
