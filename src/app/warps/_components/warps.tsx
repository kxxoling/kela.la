'use client'

import React from "react";
import {
  Accordion, AccordionItem,
  Card, CardHeader, CardBody, Checkbox, CheckboxGroup,
  Table, TableBody, TableRow, TableCell, TableHeader, TableColumn,
} from "@nextui-org/react";

import { useWarpContext } from "../context";
import type { GachaType, WarpRecord } from "@/utils/warp-api";

type LineProps = {
  title: string
  count: number
  details: React.ReactNode
}
export function Line({ title, count, details }: LineProps) {
  return <div className="px-2">
    <div className="px-6 py-4 bg-black/20 rounded-xl flex justify-between">
      <div className="flex flex-col justify-between">
        <div>{title}</div>
        <div>
          {details}
        </div>
      </div>
      <div className="flex items-center text-4xl">
        <div>{count}</div>
      </div>
    </div>
  </div>
}

type WarpsCollapseProps = {
  title: string
  type: GachaType
}

export function WarpsCollapse({ title, type }: WarpsCollapseProps) {
  const { data } = useWarpContext()
  const warps = data?.[type]
  const [filterTypes, setFilterTypes] = React.useState<WarpRecord['rank_type'][]>(['5', '4', '3'])
  const topContent = React.useMemo(() => <>
    <div className="flex gap-4">
      <CheckboxGroup
        orientation="horizontal"
        defaultValue={filterTypes}
        // @ts-ignore
        onChange={(value: WarpRecord['rank_type'][]) => setFilterTypes(value)}
      >
        <Checkbox color="warning" value="5">5★</Checkbox>
        <Checkbox color="secondary" value="4">4★</Checkbox>
        <Checkbox color="primary" value="3">3★</Checkbox>
      </CheckboxGroup>
    </div>
  </>, [filterTypes])
  if (!warps) return null

  const totalCount = warps.length
  const ssrGuaranteedCount = warps.findIndex(w => w.rank_type === '5') // maybe `-1`
  const guaranteedCount = warps.findIndex(w => w.rank_type === '4') // maybe `-1`

  const filteredWarps = warps.filter(w => filterTypes.includes(w.rank_type))

  return <div className="">
    <Card>
      <CardHeader className="px-8">{title}</CardHeader>
      <div className="flex flex-col gap-2">
        <Line title={'总抽取次数'} count={totalCount} details={0} />
        <Line title={'5★ 保底进度'} count={ssrGuaranteedCount === -1 ? totalCount : ssrGuaranteedCount} details={0} />
        <Line title={'4★ 保底进度'} count={guaranteedCount === -1 ? totalCount : guaranteedCount} details={0} />
      </div>
      <CardBody>
        <div className="">
          <Accordion defaultExpandedKeys={['1']}>
            <AccordionItem key="1" aria-label="Accordion" title={<h4 className="text-sm">详细信息</h4>} >
              <div>
                <Table aria-label="warps table" topContent={topContent} hideHeader removeWrapper>
                  <TableHeader>
                    <TableColumn>Name</TableColumn>
                    <TableColumn>Rank Type</TableColumn>
                    <TableColumn>Item Type</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {filteredWarps.map((warp) => {
                      const color = warp.rank_type === '5' ? 'text-yellow-500' : warp.rank_type === '4' ? 'text-purple-500' : 'text-blue-500'

                      return <TableRow key={warp.id} className="hover:bg-black/20">
                        <TableCell className={color}>{warp.name}</TableCell>
                        <TableCell className="">{warp.rank_type}</TableCell>
                        <TableCell>{warp.item_type}</TableCell>
                      </TableRow>
                    })}
                  </TableBody>
                </Table>
              </div>
            </AccordionItem>
          </Accordion>
        </div>
      </CardBody>
    </Card>
  </div>;
}
