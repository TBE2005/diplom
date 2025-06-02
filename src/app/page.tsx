import { Button } from "@mantine/core";
import Link from "next/link";
export default function Home() {
  return (
    <>
      <Button component={Link} href="/dashboard">
        Войти через YooMoney
      </Button>
    </>
  );
}
