"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { useState } from "react";
import harp2 from "@/public/h1470.png";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export default function Orders() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Tabs defaultValue={"waiting"}>
        <TabsList>
          <TabsTrigger value={"wating"}>Chờ xác nhận</TabsTrigger>
          <TabsTrigger value={"new"}>Đang giao hàng</TabsTrigger>
          <TabsTrigger value={"old"}>Đã giao</TabsTrigger>
          <TabsTrigger value={"gold"}>Trả hàng</TabsTrigger>
          <TabsTrigger value={"silver"}>Đã hủy</TabsTrigger>
        </TabsList>
        <TabsContent value={"wating"}>
          <Card>
            <CardHeader>
              <CardTitle>Danh sach</CardTitle>
              <CardDescription>Nhan de xem chi tiet</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Card className="py-3 rounded-md">
                <CardContent className="flex gap-4 font-bold text-base">
                  <h1 className="flex-2">Mã đơn hàng</h1>
                  <h1 className="w-48">Ngày đặt</h1>
                  <h1 className="flex-1">Tổng tiền</h1>
                  <h1 className="w-28">Trạng thái</h1>
                </CardContent>
              </Card>
              <Card
                className="py-3 rounded-md hover:cursor-pointer"
                onClick={() => setOpen(true)}
              >
                <CardContent className="flex gap-4 text-base">
                  <h1 className="flex-2">DKAHF12VA14JVFKA</h1>
                  <h1 className="w-48">23/09/2026</h1>
                  <h1 className="flex-1">100000000$</h1>
                  <h1 className="w-28">chờ duyệt</h1>
                </CardContent>
              </Card>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Chi tiết đơn hàng</DialogTitle>
                  </DialogHeader>

                  <div>
                    <p>Mã đơn hàng</p>
                    <p>Trạng thái</p>
                  </div>
                  <div>
                    <Card className="rounded-xl py-3">
                      <CardContent className="flex items-center justify-between px-3">
                        <div className="flex items-center gap-4 w-full">
                          <Image
                            src={harp2}
                            alt="ROG Harpe II Extreme Edition 20 Gaming Mouse"
                            width={64}
                            height={64}
                            className="object-contain"
                          />

                          <h1 className="flex-1">
                            ROG Harpe II Extreme Edition 20 Gaming Mouse
                          </h1>
                          <h2 className="text-black">x2</h2>
                          <h2 className="text-red-600">890000000</h2>
                        </div>
                      </CardContent>
                    </Card>
                    <h1>Tổng tiền: 89000000</h1>
                  </div>
                  <Separator />
                  <h2>Thông tin giao hàng</h2>
                  <p>Nguyễn Văn A - 0123456789 - Ba đình, Hà Nội</p>
                  <p>Chuyển tiền khi nhận hàng</p>
                  <Separator />
                  <Button>Hủy đơn hàng</Button>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value={"new"}>
          <Card>
            <CardHeader>
              <CardTitle>Danh sach</CardTitle>
              <CardDescription>Nhan de xem chi tiet</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Card className="py-3 rounded-md">
                <CardContent className="flex gap-4 font-bold text-base">
                  <h1 className="flex-2">Mã đơn hàng</h1>
                  <h1 className="w-48">Ngày đặt</h1>
                  <h1 className="flex-1">Tổng tiền</h1>
                  <h1 className="w-28">Trạng thái</h1>
                </CardContent>
              </Card>
              <Card
                className="py-3 rounded-md hover:cursor-pointer"
                onClick={() => setOpen(true)}
              >
                <CardContent className="flex gap-4 text-base">
                  <h1 className="flex-2">DKAHF12VA14JVFKA</h1>
                  <h1 className="w-48">23/09/2026</h1>
                  <h1 className="flex-1">100000000$</h1>
                  <h1 className="w-28">đang giao</h1>
                </CardContent>
              </Card>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Chi tiết đơn hàng</DialogTitle>
                  </DialogHeader>

                  <div>
                    <p>Mã đơn hàng</p>
                    <p>Trạng thái</p>
                  </div>
                  <div>
                    <Card className="rounded-xl py-3">
                      <CardContent className="flex items-center justify-between px-3">
                        <div className="flex items-center gap-4 w-full">
                          <Image
                            src={harp2}
                            alt="ROG Harpe II Extreme Edition 20 Gaming Mouse"
                            width={64}
                            height={64}
                            className="object-contain"
                          />

                          <h1 className="flex-1">
                            ROG Harpe II Extreme Edition 20 Gaming Mouse
                          </h1>
                          <h2 className="text-black">x2</h2>
                          <h2 className="text-red-600">890000000</h2>
                        </div>
                      </CardContent>
                    </Card>
                    <h1>Tổng tiền: 89000000</h1>
                  </div>
                  <Separator />
                  <h2>Thông tin giao hàng</h2>
                  <p>Nguyễn Văn A - 0123456789 - Ba đình, Hà Nội</p>
                  <p>Chuyển tiền khi nhận hàng</p>
                  <Separator />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value={"old"}>
          <Card>
            <CardHeader>
              <CardTitle>Danh sach</CardTitle>
              <CardDescription>Nhan de xem chi tiet</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Card className="py-3 rounded-md">
                <CardContent className="flex gap-4 font-bold text-base">
                  <h1 className="flex-2">Mã đơn hàng</h1>
                  <h1 className="w-48">Ngày đặt</h1>
                  <h1 className="flex-1">Tổng tiền</h1>
                  <h1 className="w-28">Trạng thái</h1>
                </CardContent>
              </Card>
              <Card
                className="py-3 rounded-md hover:cursor-pointer"
                onClick={() => setOpen(true)}
              >
                <CardContent className="flex gap-4 text-base">
                  <h1 className="flex-2">DKAHF12VA14JVFKA</h1>
                  <h1 className="w-48">23/09/2026</h1>
                  <h1 className="flex-1">100000000$</h1>
                  <h1 className="w-28">Đã giao</h1>
                </CardContent>
              </Card>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Chi tiết đơn hàng</DialogTitle>
                  </DialogHeader>

                  <div>
                    <p>Mã đơn hàng</p>
                    <p>Trạng thái</p>
                  </div>
                  <div>
                    <Card className="rounded-xl py-3">
                      <CardContent className="flex items-center justify-between px-3">
                        <div className="flex items-center gap-4 w-full">
                          <Image
                            src={harp2}
                            alt="ROG Harpe II Extreme Edition 20 Gaming Mouse"
                            width={64}
                            height={64}
                            className="object-contain"
                          />

                          <h1 className="flex-1">
                            ROG Harpe II Extreme Edition 20 Gaming Mouse
                          </h1>
                          <h2 className="text-black">x2</h2>
                          <h2 className="text-red-600">890000000</h2>
                        </div>
                      </CardContent>
                    </Card>
                    <h1>Tổng tiền: 89000000</h1>
                  </div>
                  <Separator />
                  <h2>Thông tin giao hàng</h2>
                  <p>Nguyễn Văn A - 0123456789 - Ba đình, Hà Nội</p>
                  <p>Chuyển tiền khi nhận hàng</p>
                  <Separator />
                  <Button>Hoàn trả hàng</Button>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value={"gold"}>
          <Card>
            <CardHeader>
              <CardTitle>Danh sach</CardTitle>
              <CardDescription>Nhan de xem chi tiet</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Card className="py-3 rounded-md">
                <CardContent className="flex gap-4 font-bold text-base">
                  <h1 className="flex-2">Mã đơn hàng</h1>
                  <h1 className="w-48">Ngày đặt</h1>
                  <h1 className="flex-1">Tổng tiền</h1>
                  <h1 className="w-28">Trạng thái</h1>
                </CardContent>
              </Card>
              <Card
                className="py-3 rounded-md hover:cursor-pointer"
                onClick={() => setOpen(true)}
              >
                <CardContent className="flex gap-4 text-base">
                  <h1 className="flex-2">DKAHF12VA14JVFKA</h1>
                  <h1 className="w-48">23/09/2026</h1>
                  <h1 className="flex-1">100000000$</h1>
                  <h1 className="w-28">Đã trả</h1>
                </CardContent>
              </Card>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Chi tiết đơn hàng</DialogTitle>
                  </DialogHeader>

                  <div>
                    <p>Mã đơn hàng</p>
                    <p>Trạng thái</p>
                  </div>
                  <div>
                    <Card className="rounded-xl py-3">
                      <CardContent className="flex items-center justify-between px-3">
                        <div className="flex items-center gap-4 w-full">
                          <Image
                            src={harp2}
                            alt="ROG Harpe II Extreme Edition 20 Gaming Mouse"
                            width={64}
                            height={64}
                            className="object-contain"
                          />

                          <h1 className="flex-1">
                            ROG Harpe II Extreme Edition 20 Gaming Mouse
                          </h1>
                          <h2 className="text-black">x2</h2>
                          <h2 className="text-red-600">890000000</h2>
                        </div>
                      </CardContent>
                    </Card>
                    <h1>Tổng tiền: 89000000</h1>
                  </div>
                  <Separator />
                  <h2>Thông tin giao hàng</h2>
                  <p>Nguyễn Văn A - 0123456789 - Ba đình, Hà Nội</p>
                  <p>Chuyển tiền khi nhận hàng</p>
                  <Separator />
                  <Button>Hủy đơn hàng</Button>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value={"silver"}>
          <Card>
            <CardHeader>
              <CardTitle>Danh sach</CardTitle>
              <CardDescription>Nhan de xem chi tiet</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Card className="py-3 rounded-md">
                <CardContent className="flex gap-4 font-bold text-base">
                  <h1 className="flex-2">Mã đơn hàng</h1>
                  <h1 className="w-48">Ngày đặt</h1>
                  <h1 className="flex-1">Tổng tiền</h1>
                  <h1 className="w-28">Trạng thái</h1>
                </CardContent>
              </Card>
              <Card
                className="py-3 rounded-md hover:cursor-pointer"
                onClick={() => setOpen(true)}
              >
                <CardContent className="flex gap-4 text-base">
                  <h1 className="flex-2">DKAHF12VA14JVFKA</h1>
                  <h1 className="w-48">23/09/2026</h1>
                  <h1 className="flex-1">100000000$</h1>
                  <h1 className="w-28">đã hủy</h1>
                </CardContent>
              </Card>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Chi tiết đơn hàng</DialogTitle>
                  </DialogHeader>

                  <div>
                    <p>Mã đơn hàng</p>
                    <p>Trạng thái</p>
                  </div>
                  <div>
                    <Card className="rounded-xl py-3">
                      <CardContent className="flex items-center justify-between px-3">
                        <div className="flex items-center gap-4 w-full">
                          <Image
                            src={harp2}
                            alt="ROG Harpe II Extreme Edition 20 Gaming Mouse"
                            width={64}
                            height={64}
                            className="object-contain"
                          />

                          <h1 className="flex-1">
                            ROG Harpe II Extreme Edition 20 Gaming Mouse
                          </h1>
                          <h2 className="text-black">x2</h2>
                          <h2 className="text-red-600">890000000</h2>
                        </div>
                      </CardContent>
                    </Card>
                    <h1>Tổng tiền: 89000000</h1>
                  </div>
                  <Separator />
                  <h2>Thông tin giao hàng</h2>
                  <p>Nguyễn Văn A - 0123456789 - Ba đình, Hà Nội</p>
                  <p>Chuyển tiền khi nhận hàng</p>
                  <Separator />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
