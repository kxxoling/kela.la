'use client'

import React from "react";
import Link from 'next/link'
import {
  Tabs, Tab, Card, CardHeader, CardBody, Button, Textarea,
} from "@nextui-org/react";

import { PullsTable } from "./_components/pulls";
import { WarpsCollapse } from "./_components/warps";
import { GACHA_TYPES } from "@/utils/warp-api";
import { WarpContextProvider, useWarpContext } from "./context";

function SubmitForm() {
  const [value, setValue] = React.useState("")

  const { getAllGachaWarpHistory, state, isLoading } = useWarpContext()

  const onSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault()

    try {
      await getAllGachaWarpHistory(value)
    } catch (err) {
      console.error(err)
    }
  }

  return <form onSubmit={onSubmit} className="flex flex-col gap-4">
    <Textarea placeholder="链接粘贴这里……" value={value} onChange={evt => setValue(evt.currentTarget.value)} />
    <div>
      {state}
    </div>
    <div className="flex justify-end">
      <Button type="submit" color="primary" className="" isLoading={isLoading}>提交</Button>
    </div>
  </form>
}

export default function WarpsPage() {
  return <>
    <WarpContextProvider>
      <div className="flex flex-col gap-8">
        <h1>跃迁记录</h1>
        <div>
          <Card>
            <CardHeader className="flex justify-between">
              <h3>填写跃迁查询链接进行跃迁分析</h3>
              <Link href="/warps/tips">
                <Button>跃迁查询链接获取方法</Button>
              </Link>
            </CardHeader>
            <CardBody>
              <SubmitForm />
            </CardBody>
          </Card>
        </div>

        <div className="flex w-full flex-col">
          <Tabs aria-label="gacha types">
            {
              [
                GACHA_TYPES.map(([type, title]) => {
                  return <Tab key={type} title={title}>
                    <PullsTable type={type} />
                  </Tab>
                })
              ]
            }
          </Tabs>
        </div>

        <div className="w-full gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {
            GACHA_TYPES.map(([type, title]) => {
              return <WarpsCollapse key={type} type={type} title={title} />
            })
          }
        </div>
      </div>
    </WarpContextProvider>
  </>
}
