'use client'
import Link from 'next/link'
import { Tab, Tabs, Button, Card, CardBody, CardHeader, Code, Snippet } from '@nextui-org/react'

export default function GotchaPage() {
  return <div>
    <div>
      <Link href="/warps">
        <Button>返回</Button>
      </Link>
    </div>
    <Tabs aria-label="tips">
      <Tab key="pc" title="电脑 PC 端">
        <Card>
          <CardHeader>
            电脑客户端获取星穹铁道跃迁查询链接的方法
          </CardHeader>
          <CardBody>
            <p>
              这个方法要求星铁的客户端路径中没有中文
            </p>
            <ol>
              <li>
                1.打开星穹铁道跃迁历史记录
              </li>
              <li>
                2.打开电脑上自带的powershell
                <p>
                  [电脑桌面使用快捷键
                  <Code>Win+X</Code>
                  即可打开 部分用户需
                  <Code>Win+R</Code>
                  打开命令窗口，然后输入 powershell 之后回车打开]
                </p>
              </li>
              <li>
                3.输入以下命令，并回车：
                <ol>
                  <li>
                    国服:
                    <Snippet color="primary">
                      Invoke-Expression (New-Object Net.WebClient).DownloadString(&apos;https://kela.la/scripts/cn_v4.ps1&apos;)
                    </Snippet>
                  </li>
                  <li>
                    <Snippet color="primary">
                      Invoke-Expression (New-Object Net.WebClient).DownloadString(&apos;https://kela.la/scripts/os_v4.ps1&apos;)
                    </Snippet>
                  </li>
                </ol>
              </li>
              <li>
                4.如果顺利的话，此时已经成功复制到链接，到非小酋提交即可。
              </li>
            </ol>
          </CardBody>
        </Card>
      </Tab>
      <Tab key="android" title="安卓手机/平板">
        <Card>
          <CardBody>
            <div>
              to be done
            </div>
          </CardBody>
        </Card>
      </Tab>
      <Tab key="ios" title="iPhone/iPad">
        <Card>
          <CardBody>
            <div>
              to be done
            </div>
          </CardBody>
        </Card>
      </Tab>
    </Tabs>
  </div>
}
