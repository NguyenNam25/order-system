"use client";

import productApi from "@/api/routes/productApi";
import { formatVND } from "@/lib/format";
import { useQuery } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { Heart, MinusIcon, PlusIcon } from "lucide-react";

export default function ProductDetail({ id }: { id: string }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", id],
    queryFn: () => productApi.getProductById(Number(id)),
  });

  return (
    <div className="grid grid-cols-8 gap-4">
      <div className="flex flex-col col-span-5">
        <div>
          <div className="bg-blue-300 rounded-lg w-full h-72"></div>
          <div className="bg-blue-300 rounded-lg w-full h-16 my-4"></div>
        </div>
      </div>
      <div className="col-span-3 flex flex-col gap-4">
        <h1 className="font-bold text-xl">{data?.name}</h1>

        <p className="w-full h-56 overflow-y-scroll">{data?.description}</p>

        <span className="text-xl text-red-600 font-bold">
          {formatVND(data?.price ?? 0)}
        </span>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <p>Số lượng: </p>
            <div className="flex items-center gap-2">
              <Button size="icon" variant="outline" className="rounded-md">
                <MinusIcon />
              </Button>
              <span className="text-base">2</span>
              <Button size="icon" variant="outline" className="rounded-md">
                <PlusIcon />
              </Button>
            </div>
          </div>
          <Button className="w-36 rounded-lg">
            Add to cart
          </Button>
          <Button size="icon" className="bg-gray-200 hover:bg-gray-400">
            <Heart className="text-black" />
          </Button>
        </div>

        <Button className="bg-red-600 w-full h-12">
            Mua Ngay
          </Button>
      </div>
    </div>
  );
}
