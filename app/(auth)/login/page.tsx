import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function Login() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required />
              </div>
            </div>
          </form>
          <div className="mt-3 text-right">
            <Link
              href="/forgot-password"
              className="text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex flex-col w-full gap-2">
            <Button className="w-full">Login</Button>
            <Button className="w-full">Sign up</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
