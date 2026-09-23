import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import harp2 from "@/public/h1470.png";
import { Check, Heart, ShoppingCartIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Products() {
  return (
    <div className="grid grid-cols-5 gap-4">
      <Card className="group mx-auto">
        <CardContent>
          <div className="relative w-full aspect-square overflow-hidden">
            <Image
              src={harp2}
              alt="Harp"
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-contain transition-transform duration-300 group-hover:scale-120"
            />
          </div>
          <div className="my-2">
            <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
              Green
            </Badge>
            <Badge variant="secondary">Secondary</Badge>
          </div>
          <h1 className="line-clamp-2">
            ROG Harpe II Extreme Edition 20 Gaming Mouse
          </h1>
          <h1 className="text-xl text-red-600 my-2">8900000</h1>
        </CardContent>
        <CardFooter className="flex items-center gap-1.5">
          <div className="text-green-500 flex flex-1">
            <Check />
            <span>status</span>
          </div>
          <Button size="icon" className={"bg-red-600 hover:bg-red-700"}>
            <ShoppingCartIcon />
          </Button>
          <Button size="icon" className={"bg-gray-200 hover:bg-gray-400"}>
            <Heart className="text-black" />
          </Button>
        </CardFooter>
      </Card>

      <Card className="group mx-auto">
        <CardContent>
          <div className="relative w-full aspect-square overflow-hidden">
            <Image
              src={harp2}
              alt="Harp"
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-contain transition-transform duration-300 group-hover:scale-120"
            />
          </div>
          <div className="my-2">
            <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
              Green
            </Badge>
            <Badge variant="secondary">Secondary</Badge>
          </div>
          <h1 className="line-clamp-2">
            ROG Harpe II Extreme Edition 20 Gaming Mouse
          </h1>
          <h1 className="text-xl text-red-600 my-2">8900000</h1>
        </CardContent>
        <CardFooter className="flex items-center gap-2">
          <div className="text-green-500 flex flex-1">
            <Check />
            <span>status</span>
          </div>
          <Button size="icon" className={"bg-red-600 hover:bg-red-700"}>
            <ShoppingCartIcon />
          </Button>
          <Button size="icon" className={"bg-gray-200 hover:bg-gray-400"}>
            <Heart className="text-black" />
          </Button>
        </CardFooter>
      </Card>

      <Card className="group mx-auto">
        <CardContent>
          <div className="relative w-full aspect-square overflow-hidden">
            <Image
              src={harp2}
              alt="Harp"
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-contain transition-transform duration-300 group-hover:scale-120"
            />
          </div>
          <div className="my-2">
            <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
              Green
            </Badge>
            <Badge variant="secondary">Secondary</Badge>
          </div>
          <h1 className="line-clamp-2">
            ROG Harpe II Extreme Edition 20 Gaming Mouse
          </h1>
          <h1 className="text-xl text-red-600 my-2">8900000</h1>
        </CardContent>
        <CardFooter className="flex items-center gap-2">
          <div className="text-green-500 flex flex-1">
            <Check />
            <span>status</span>
          </div>
          <Button size="icon" className={"bg-red-600 hover:bg-red-700"}>
            <ShoppingCartIcon />
          </Button>
          <Button size="icon" className={"bg-gray-200 hover:bg-gray-400"}>
            <Heart className="text-black" />
          </Button>
        </CardFooter>
      </Card>

      <Card className="group mx-auto">
        <CardContent>
          <div className="relative w-full aspect-square overflow-hidden">
            <Image
              src={harp2}
              alt="Harp"
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-contain transition-transform duration-300 group-hover:scale-120"
            />
          </div>
          <div className="my-2">
            <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
              Green
            </Badge>
            <Badge variant="secondary">Secondary</Badge>
          </div>
          <h1 className="line-clamp-2">
            ROG Harpe II Extreme Edition 20 Gaming Mouse
          </h1>
          <h1 className="text-xl text-red-600 my-2">8900000</h1>
        </CardContent>
        <CardFooter className="flex items-center gap-2">
          <div className="text-green-500 flex flex-1">
            <Check />
            <span>status</span>
          </div>
          <Button size="icon" className={"bg-red-600 hover:bg-red-700"}>
            <ShoppingCartIcon />
          </Button>
          <Button size="icon" className={"bg-gray-200 hover:bg-gray-400"}>
            <Heart className="text-black" />
          </Button>
        </CardFooter>
      </Card>

      <Card className="group mx-auto">
        <CardContent>
          <div className="relative w-full aspect-square overflow-hidden">
            <Image
              src={harp2}
              alt="Harp"
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-contain transition-transform duration-300 group-hover:scale-120"
            />
          </div>
          <div className="my-2">
            <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
              Green
            </Badge>
            <Badge variant="secondary">Secondary</Badge>
          </div>
          <h1 className="line-clamp-2">
            ROG Harpe II Extreme Edition 20 Gaming Mouse
          </h1>
          <h1 className="text-xl text-red-600 my-2">8900000</h1>
        </CardContent>
        <CardFooter className="flex items-center gap-2">
          <div className="text-green-500 flex flex-1">
            <Check />
            <span>status</span>
          </div>
          <Button size="icon" className={"bg-red-600 hover:bg-red-700"}>
            <ShoppingCartIcon />
          </Button>
          <Button size="icon" className={"bg-gray-200 hover:bg-gray-400"}>
            <Heart className="text-black" />
          </Button>
        </CardFooter>
      </Card>

      <Card className="group mx-auto">
        <CardContent>
          <div className="relative w-full aspect-square overflow-hidden">
            <Image
              src={harp2}
              alt="Harp"
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-contain transition-transform duration-300 group-hover:scale-120"
            />
          </div>
          <div className="my-2">
            <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
              Green
            </Badge>
            <Badge variant="secondary">Secondary</Badge>
          </div>
          <h1 className="line-clamp-2">
            ROG Harpe II Extreme Edition 20 Gaming Mouse
          </h1>
          <h1 className="text-xl text-red-600 my-2">8900000</h1>
        </CardContent>
        <CardFooter className="flex items-center gap-2">
          <div className="text-green-500 flex flex-1">
            <Check />
            <span>status</span>
          </div>
          <Button size="icon" className={"bg-red-600 hover:bg-red-700"}>
            <ShoppingCartIcon />
          </Button>
          <Button size="icon" className={"bg-gray-200 hover:bg-gray-400"}>
            <Heart className="text-black" />
          </Button>
        </CardFooter>
      </Card>

      <Card className="group mx-auto">
        <CardContent>
          <div className="relative w-full aspect-square overflow-hidden">
            <Image
              src={harp2}
              alt="Harp"
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-contain transition-transform duration-300 group-hover:scale-120"
            />
          </div>
          <div className="my-2">
            <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
              Green
            </Badge>
            <Badge variant="secondary">Secondary</Badge>
          </div>
          <h1 className="line-clamp-2">
            ROG Harpe II Extreme Edition 20 Gaming Mouse
          </h1>
          <h1 className="text-xl text-red-600 my-2">8900000</h1>
        </CardContent>
        <CardFooter className="flex items-center gap-2">
          <div className="text-green-500 flex flex-1">
            <Check />
            <span>status</span>
          </div>
          <Button size="icon" className={"bg-red-600 hover:bg-red-700"}>
            <ShoppingCartIcon />
          </Button>
          <Button size="icon" className={"bg-gray-200 hover:bg-gray-400"}>
            <Heart className="text-black" />
          </Button>
        </CardFooter>
      </Card>

      <Card className="group mx-auto">
        <CardContent>
          <div className="relative w-full aspect-square overflow-hidden">
            <Image
              src={harp2}
              alt="Harp"
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-contain transition-transform duration-300 group-hover:scale-120"
            />
          </div>
          <div className="my-2">
            <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
              Green
            </Badge>
            <Badge variant="secondary">Secondary</Badge>
          </div>
          <h1 className="line-clamp-2">
            ROG Harpe II Extreme Edition 20 Gaming Mouse
          </h1>
          <h1 className="text-xl text-red-600 my-2">8900000</h1>
        </CardContent>
        <CardFooter className="flex items-center gap-2">
          <div className="text-green-500 flex flex-1">
            <Check />
            <span>status</span>
          </div>
          <Button size="icon" className={"bg-red-600 hover:bg-red-700"}>
            <ShoppingCartIcon />
          </Button>
          <Button size="icon" className={"bg-gray-200 hover:bg-gray-400"}>
            <Heart className="text-black" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
